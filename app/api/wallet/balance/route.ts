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

    // Connect to ARC testnet
    const provider = new ethers.JsonRpcProvider(ARC_TESTNET_RPC)

    // Get USDC contract
    const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, provider)

    // Get balance
    const balance = await usdcContract.balanceOf(address)
    const decimals = await usdcContract.decimals()
    const symbol = await usdcContract.symbol()

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
  } catch (error) {
    console.error('Error retrieving balance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve balance' },
      { status: 500 }
    )
  }
}
