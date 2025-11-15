import { NextRequest, NextResponse } from 'next/server'
import { circleWalletService } from '@/lib/services/circleWallet'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * POST /api/circle/wallet/create
 * Create a new Circle wallet for authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { userToken } = body
    
    if (!userToken) {
      return NextResponse.json(
        { success: false, error: 'User token is required' },
        { status: 400 }
      )
    }
    
    const userId = session.user.id || session.user.email || ''
    const result = await circleWalletService.createWallet(userId, userToken)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in Circle wallet creation:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/circle/wallet/create?userToken=xxx
 * Get wallets for authenticated user
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
    
    if (!userToken) {
      return NextResponse.json(
        { success: false, error: 'User token is required' },
        { status: 400 }
      )
    }
    
    const userId = session.user.id || session.user.email || ''
    const result = await circleWalletService.getWallets(userId, userToken)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching Circle wallets:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}
