import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-10-29.clover',
  })
}

export async function POST(request: NextRequest) {
  try {
    const { 
      customerId, 
      cardholderName = 'DEO User', 
      isVirtual = true,
      spendingLimit = 5000,
      email,
      phoneNumber,
      address,
    } = await request.json()

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    const stripe = getStripeClient()

    // Prepare cardholder data
    const cardholderData: Stripe.Issuing.CardholderCreateParams = {
      name: cardholderName,
      email: email || `${customerId}@deofinance.example`,
      phone_number: phoneNumber || '+18888888888',
      status: 'active',
      type: 'individual',
      billing: {
        address: address || {
          line1: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
          postal_code: '94111',
          country: 'US',
        },
      },
      metadata: {
        customer_id: customerId,
        created_at: new Date().toISOString(),
      },
    }

    // Create a cardholder
    const cardholder = await stripe.issuing.cardholders.create(cardholderData)

    // Convert spending limit from dollars to cents for Stripe
    const spendingLimitCents = Math.round(spendingLimit * 100)

    // Create a card with proper spending controls
    const card = await stripe.issuing.cards.create({
      cardholder: cardholder.id,
      currency: 'usd',
      type: isVirtual ? 'virtual' : 'physical',
      status: 'active',
      spending_controls: {
        spending_limits: [
          {
            amount: spendingLimitCents,
            interval: 'daily',
          },
        ],
        allowed_categories: [], // Empty array means all categories allowed
      },
      metadata: {
        customer_id: customerId,
        cardholder_id: cardholder.id,
        spending_limit: spendingLimit.toString(),
        created_at: new Date().toISOString(),
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
        cardholder_id: cardholder.id,
        spending_limit: spendingLimit,
      },
      cardholder: {
        id: cardholder.id,
        name: cardholder.name,
        email: cardholder.email,
      },
    })
  } catch (error: any) {
    console.error('Error creating card:', error)
    
    // Provide more detailed error messages
    let errorMessage = 'Failed to create card'
    if (error?.type === 'StripeInvalidRequestError') {
      errorMessage = error.message || errorMessage
    } else if (error?.code === 'resource_missing') {
      errorMessage = 'Stripe Issuing not enabled for this account'
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
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

    // List all cards (limited to 100)
    const cards = await stripe.issuing.cards.list({
      limit: 100,
    })

    // Filter by metadata to find customer's cards
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
        cardholder_id: card.cardholder,
        spending_limit: card.metadata.spending_limit ? parseFloat(card.metadata.spending_limit) : 5000,
      })),
    })
  } catch (error: any) {
    console.error('Error retrieving cards:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve cards',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    )
  }
}

// PATCH endpoint for updating card status (freeze, unfreeze, cancel)
export async function PATCH(request: NextRequest) {
  try {
    const { cardId, action } = await request.json()

    if (!cardId || !action) {
      return NextResponse.json(
        { success: false, error: 'Card ID and action are required' },
        { status: 400 }
      )
    }

    const stripe = getStripeClient()

    let updatedCard
    
    switch (action) {
      case 'freeze':
        updatedCard = await stripe.issuing.cards.update(cardId, {
          status: 'inactive',
        })
        break
      
      case 'unfreeze':
        updatedCard = await stripe.issuing.cards.update(cardId, {
          status: 'active',
        })
        break
      
      case 'cancel':
        updatedCard = await stripe.issuing.cards.update(cardId, {
          status: 'canceled',
        })
        break
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: freeze, unfreeze, or cancel' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      card: {
        id: updatedCard.id,
        status: updatedCard.status,
        last4: updatedCard.last4,
      },
    })
  } catch (error: any) {
    console.error('Error updating card:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update card status',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    )
  }
}
