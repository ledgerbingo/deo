import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

// ARC Testnet RPC URL
const ARC_TESTNET_RPC = process.env.NEXT_PUBLIC_ARC_TESTNET_RPC || 'https://arc-testnet-rpc.circle.com'

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

    // Connect to ARC testnet
    const provider = new ethers.JsonRpcProvider(ARC_TESTNET_RPC)

    // Get wallet info
    const balance = await provider.getBalance(address)
    const transactionCount = await provider.getTransactionCount(address)

    // Get USDC balance
    const USDC_CONTRACT = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
    const usdcAbi = [
      'function balanceOf(address account) view returns (uint256)',
      'function decimals() view returns (uint8)',
    ]
    const usdcContract = new ethers.Contract(USDC_CONTRACT, usdcAbi, provider)
    const usdcBalance = await usdcContract.balanceOf(address)
    const decimals = await usdcContract.decimals()

    return NextResponse.json({
      success: true,
      wallet: {
        address,
        nativeBalance: ethers.formatEther(balance),
        usdcBalance: ethers.formatUnits(usdcBalance, decimals),
        transactionCount,
      },
    })
  } catch (error) {
    console.error('Error retrieving wallet:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve wallet information' },
      { status: 500 }
    )
  }
}
