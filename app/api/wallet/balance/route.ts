import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

// ARC Testnet RPC URL
const ARC_TESTNET_RPC = process.env.NEXT_PUBLIC_ARC_TESTNET_RPC || 'https://arc-testnet-rpc.circle.com'

// USDC contract address on ARC testnet (example - replace with actual)
const USDC_CONTRACT_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'

// USDC ABI (simplified - only the functions we need)
const USDC_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address required' },
        { status: 400 }
      )
    }

    try {
      // Connect to ARC testnet with timeout
      const provider = new ethers.JsonRpcProvider(ARC_TESTNET_RPC, undefined, {
        staticNetwork: true,
      })

      // Set timeout for RPC calls
      const timeout = (ms: number) => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('RPC request timeout')), ms)
      )

      // Get USDC contract
      const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, provider)

      // Get balance with timeout
      const balance = await Promise.race([
        usdcContract.balanceOf(address),
        timeout(5000)
      ]) as bigint
      
      const decimals = await Promise.race([
        usdcContract.decimals(),
        timeout(5000)
      ]) as number
      
      const symbol = await Promise.race([
        usdcContract.symbol(),
        timeout(5000)
      ]) as string

      // Format balance
      const formattedBalance = ethers.formatUnits(balance, decimals)

      return NextResponse.json({
        success: true,
        balance: {
          raw: balance.toString(),
          formatted: formattedBalance,
          decimals,
          symbol,
          address,
        },
      })
    } catch (rpcError) {
      // RPC connection failed - return demo data
      console.warn('RPC connection failed, returning demo data:', rpcError)
      
      return NextResponse.json({
        success: true,
        balance: {
          raw: '1000000000',
          formatted: '1000.00',
          decimals: 6,
          symbol: 'USDC',
          address,
        },
        isDemoMode: true,
        message: 'Using demo data - ARC testnet RPC unavailable',
      })
    }
  } catch (error) {
    console.error('Error retrieving balance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve balance' },
      { status: 500 }
    )
  }
}
