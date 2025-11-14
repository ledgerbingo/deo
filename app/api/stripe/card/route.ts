import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-10-29.clover',
  })
}

export async function POST(request: NextRequest) {
  try {
    const { customerId, cardholderName, isVirtual = true } = await request.json()

    const stripe = getStripeClient()

    // Create a cardholder
    const cardholder = await stripe.issuing.cardholders.create({
      name: cardholderName,
      email: `customer@deofinance.example`,
      phone_number: '+18888888888',
      status: 'active',
      type: 'individual',
      billing: {
        address: {
          line1: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
          postal_code: '94111',
          country: 'US',
        },
      },
    })

    // Create a card
    const card = await stripe.issuing.cards.create({
      cardholder: cardholder.id,
      currency: 'usd',
      type: isVirtual ? 'virtual' : 'physical',
      status: 'active',
      spending_controls: {
        spending_limits: [
          {
            amount: 100000, // $1,000 limit
            interval: 'daily',
          },
        ],
      },
      metadata: {
        customer_id: customerId,
      },
    })

    return NextResponse.json({
      success: true,
      card: {
        id: card.id,
        last4: card.last4,
        brand: card.brand,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        type: card.type,
        status: card.status,
      },
    })
  } catch (error) {
    console.error('Error creating card:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create card' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID required' },
        { status: 400 }
      )
    }

    const stripe = getStripeClient()

    // List cards for customer
    const cards = await stripe.issuing.cards.list({
      limit: 10,
    })

    // Filter by metadata (in production, you'd want better filtering)
    const customerCards = cards.data.filter(
      (card) => card.metadata.customer_id === customerId
    )

    return NextResponse.json({
      success: true,
      cards: customerCards.map((card) => ({
        id: card.id,
        last4: card.last4,
        brand: card.brand,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        type: card.type,
        status: card.status,
      })),
    })
  } catch (error) {
    console.error('Error retrieving cards:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve cards' },
      { status: 500 }
    )
  }
}
