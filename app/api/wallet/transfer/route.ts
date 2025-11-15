import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

// ARC Testnet RPC URL
const ARC_TESTNET_RPC = process.env.NEXT_PUBLIC_ARC_TESTNET_RPC || 'https://rpc.testnet.arc.network'

// USDC contract address on ARC testnet
const USDC_CONTRACT_ADDRESS = '0x3600000000000000000000000000000000000000'

// USDC ABI (simplified)
const USDC_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
]

export async function POST(request: NextRequest) {
  try {
    const { from, to, amount, privateKey } = await request.json()

    if (!from || !to || !amount || !privateKey) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Connect to ARC testnet
    const provider = new ethers.JsonRpcProvider(ARC_TESTNET_RPC)

    // Create wallet from private key
    const wallet = new ethers.Wallet(privateKey, provider)

    // Get USDC contract
    const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, wallet)

    // Get decimals
    const decimals = await usdcContract.decimals()

    // Convert amount to wei
    const amountInWei = ethers.parseUnits(amount.toString(), decimals)

    // Execute transfer
    const tx = await usdcContract.transfer(to, amountInWei)

    // Wait for confirmation
    const receipt = await tx.wait()

    return NextResponse.json({
      success: true,
      transaction: {
        hash: receipt.hash,
        from,
        to,
        amount,
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? 'success' : 'failed',
      },
    })
  } catch (error) {
    console.error('Error executing transfer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to execute transfer' },
      { status: 500 }
    )
  }
}
