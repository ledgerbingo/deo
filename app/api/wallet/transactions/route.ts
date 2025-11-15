import { NextRequest, NextResponse } from 'next/server'
import { walletService } from '@/lib/services/wallet'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address required' },
        { status: 400 }
      )
    }

    const transactions = await walletService.getTransactionHistory(address, limit)

    return NextResponse.json({
      success: true,
      transactions,
      count: transactions.length,
    })
  } catch (error) {
    console.error('Error retrieving transactions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve transaction history' },
      { status: 500 }
    )
  }
}
