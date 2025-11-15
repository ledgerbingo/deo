import { NextRequest, NextResponse } from 'next/server'
import { circleWalletService } from '@/lib/services/circleWallet'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * POST /api/circle/wallet/transfer
 * Create a transfer transaction
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
    const { userToken, walletId, destinationAddress, amount, tokenId } = body
    
    if (!userToken || !walletId || !destinationAddress || !amount || !tokenId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      )
    }
    
    const result = await circleWalletService.createTransaction({
      userToken,
      walletId,
      destinationAddress,
      amount,
      tokenId,
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}
