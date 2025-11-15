import { NextRequest, NextResponse } from 'next/server'
import { circleWalletService } from '@/lib/services/circleWallet'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * GET /api/circle/wallet/transactions?userToken=xxx&walletId=xxx
 * Get Circle wallet transactions
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const userToken = searchParams.get('userToken')
    const walletId = searchParams.get('walletId')
    
    if (!userToken) {
      return NextResponse.json(
        { success: false, error: 'User token is required' },
        { status: 400 }
      )
    }
    
    const userId = session.user.id || session.user.email || ''
    const result = await circleWalletService.getTransactions(userId, userToken, walletId || undefined)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}
