import Stripe from 'stripe'

function getStripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-10-29.clover',
  })
}

export class StripeService {
  /**
   * Create a verification session for KYC
   */
  async createVerificationSession(customerId: string) {
    try {
      const stripe = getStripeClient()
      const session = await stripe.identity.verificationSessions.create({
        type: 'document',
        metadata: {
          customer_id: customerId,
        },
      })
      return {
        id: session.id,
        url: session.url,
        clientSecret: session.client_secret,
      }
    } catch (error) {
      console.error('Error creating verification session:', error)
      throw error
    }
  }

  /**
   * Get verification session status
   */
  async getVerificationStatus(sessionId: string) {
    try {
      const stripe = getStripeClient()
      const session = await stripe.identity.verificationSessions.retrieve(sessionId)
      return {
        status: session.status,
        verified: session.status === 'verified',
      }
    } catch (error) {
      console.error('Error getting verification status:', error)
      throw error
    }
  }

  /**
   * Issue a card
   */
  async issueCard(customerId: string, cardholderName: string, isVirtual = true) {
    try {
      const stripe = getStripeClient()
      
      // Create cardholder
      const cardholder = await stripe.issuing.cardholders.create({
        name: cardholderName,
        email: `${customerId}@deofinance.example`,
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

      // Create card
      const card = await stripe.issuing.cards.create({
        cardholder: cardholder.id,
        currency: 'usd',
        type: isVirtual ? 'virtual' : 'physical',
        status: 'active',
        spending_controls: {
          spending_limits: [
            {
              amount: 100000,
              interval: 'daily',
            },
          ],
        },
        metadata: {
          customer_id: customerId,
        },
      })

      return {
        id: card.id,
        last4: card.last4,
        brand: card.brand,
        expMonth: card.exp_month,
        expYear: card.exp_year,
        type: card.type,
      }
    } catch (error) {
      console.error('Error issuing card:', error)
      throw error
    }
  }

  /**
   * List customer cards
   */
  async listCards(customerId: string) {
    try {
      const stripe = getStripeClient()
      const cards = await stripe.issuing.cards.list({
        limit: 10,
      })

      return cards.data
        .filter((card) => card.metadata.customer_id === customerId)
        .map((card) => ({
          id: card.id,
          last4: card.last4,
          brand: card.brand,
          expMonth: card.exp_month,
          expYear: card.exp_year,
          type: card.type,
          status: card.status,
        }))
    } catch (error) {
      console.error('Error listing cards:', error)
      throw error
    }
  }
}

export const stripeService = new StripeService()
