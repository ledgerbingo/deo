import { NextRequest, NextResponse } from 'next/server'
import { walletService } from '@/lib/services/wallet'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const txHash = searchParams.get('hash')

    if (!txHash) {
      return NextResponse.json(
        { success: false, error: 'Transaction hash required' },
        { status: 400 }
      )
    }

    const receipt = await walletService.getTransactionReceipt(txHash)

    return NextResponse.json({
      success: true,
      receipt,
    })
  } catch (error) {
    console.error('Error retrieving receipt:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve transaction receipt' },
      { status: 500 }
    )
  }
}
