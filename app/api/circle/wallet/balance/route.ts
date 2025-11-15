import { NextRequest, NextResponse } from 'next/server'
import { circleWalletService } from '@/lib/services/circleWallet'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * GET /api/circle/wallet/balance?walletId=xxx&userToken=xxx
 * Get Circle wallet balance
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
    const walletId = searchParams.get('walletId')
    const userToken = searchParams.get('userToken')
    
    if (!walletId || !userToken) {
      return NextResponse.json(
        { success: false, error: 'Wallet ID and user token are required' },
        { status: 400 }
      )
    }
    
    const result = await circleWalletService.getWalletBalance(walletId, userToken)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching wallet balance:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}
