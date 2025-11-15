import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

// ARC Testnet RPC URL
const ARC_TESTNET_RPC = process.env.NEXT_PUBLIC_ARC_TESTNET_RPC || 'https://rpc.testnet.arc.network'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    // Create a new wallet using ethers.js
    const wallet = ethers.Wallet.createRandom()

    // In production, you would:
    // 1. Store the encrypted private key securely
    // 2. Use account abstraction for better UX
    // 3. Implement proper key management

    return NextResponse.json({
      success: true,
      wallet: {
        address: wallet.address,
        // Never expose private key in production!
        // This is for demo purposes only
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic?.phrase,
        userId,
      },
    })
  } catch (error) {
    console.error('Error creating wallet:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create wallet' },
      { status: 500 }
    )
  }
}

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

    // Validate address format
    if (!ethers.isAddress(address)) {
      return NextResponse.json(
        { success: false, error: 'Invalid address format' },
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

      // Get wallet info with timeout
      const balance = await Promise.race([
        provider.getBalance(address),
        timeout(5000)
      ]) as bigint
      
      const transactionCount = await Promise.race([
        provider.getTransactionCount(address),
        timeout(5000)
      ]) as number

      // Get USDC balance
      const USDC_CONTRACT = '0x3600000000000000000000000000000000000000'
      const usdcAbi = [
        'function balanceOf(address account) view returns (uint256)',
        'function decimals() view returns (uint8)',
      ]
      const usdcContract = new ethers.Contract(USDC_CONTRACT, usdcAbi, provider)
      const usdcBalance = await Promise.race([
        usdcContract.balanceOf(address),
        timeout(5000)
      ]) as bigint
      
      const decimals = await Promise.race([
        usdcContract.decimals(),
        timeout(5000)
      ]) as number

      return NextResponse.json({
        success: true,
        wallet: {
          address,
          nativeBalance: ethers.formatEther(balance),
          usdcBalance: ethers.formatUnits(usdcBalance, decimals),
          transactionCount,
        },
      })
    } catch (rpcError) {
      // RPC connection failed - return demo data for development
      console.warn('RPC connection failed, returning demo data:', rpcError)
      
      return NextResponse.json({
        success: true,
        wallet: {
          address,
          nativeBalance: '0.1',
          usdcBalance: '1000.00',
          transactionCount: 0,
        },
        isDemoMode: true,
        message: 'Using demo data - ARC testnet RPC unavailable',
      })
    }
  } catch (error) {
    console.error('Error retrieving wallet:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve wallet information' },
      { status: 500 }
    )
  }
}
