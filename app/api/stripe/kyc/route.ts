import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-10-29.clover',
  })
}

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json()

    const stripe = getStripeClient()

    // Create a Stripe Identity verification session
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        customer_id: customerId,
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: verificationSession.id,
      clientSecret: verificationSession.client_secret,
      url: verificationSession.url,
    })
  } catch (error) {
    console.error('Error creating verification session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create verification session' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      )
    }

    const stripe = getStripeClient()

    // Retrieve the verification session
    const verificationSession = await stripe.identity.verificationSessions.retrieve(sessionId)

    return NextResponse.json({
      success: true,
      status: verificationSession.status,
      verified: verificationSession.status === 'verified',
    })
  } catch (error) {
    console.error('Error retrieving verification session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve verification session' },
      { status: 500 }
    )
  }
}
