# Stripe Issuing Integration Guide

## Overview

DEO Finance now supports Stripe Issuing for creating virtual and physical cards. This guide explains how to configure and use the card issuance features.

## Prerequisites

1. **Stripe Account**: You need a Stripe account with Issuing enabled
2. **Stripe API Keys**: Both Secret and Publishable keys must be configured
3. **Vercel Environment Variables**: Keys should be stored securely in Vercel

## Environment Variables

Add the following environment variables to your Vercel project or `.env.local` file:

```env
# Stripe Secret Key (for server-side operations)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Stripe Publishable Key (for client-side operations)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## Features Implemented

### 1. Virtual Card Issuance
- Instant card generation
- Customizable spending limits
- Immediate availability for online transactions

### 2. Physical Card Issuance
- Ships within 5-7 business days
- Same spending controls as virtual cards
- Delivered to registered billing address

### 3. Card Management
- **Freeze Card**: Temporarily disable a card
- **Unfreeze Card**: Reactivate a frozen card
- **Cancel Card**: Permanently disable a card (irreversible)

### 4. Spending Controls
- Daily spending limits (customizable per card)
- Limit configuration during card creation
- Can be adjusted after issuance (future enhancement)

## API Endpoints

### POST `/api/stripe/card`
Create a new virtual or physical card.

**Request Body:**
```json
{
  "customerId": "user_123",
  "cardholderName": "John Doe",
  "isVirtual": true,
  "spendingLimit": 5000,
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "address": {
    "line1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94111",
    "country": "US"
  }
}
```

**Response:**
```json
{
  "success": true,
  "card": {
    "id": "ic_abc123",
    "last4": "4242",
    "brand": "visa",
    "exp_month": 12,
    "exp_year": 2027,
    "type": "virtual",
    "status": "active",
    "cardholder_id": "ich_abc123",
    "spending_limit": 5000
  },
  "cardholder": {
    "id": "ich_abc123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### GET `/api/stripe/card?customerId={id}`
Retrieve all cards for a specific customer.

**Response:**
```json
{
  "success": true,
  "cards": [
    {
      "id": "ic_abc123",
      "last4": "4242",
      "brand": "visa",
      "exp_month": 12,
      "exp_year": 2027,
      "type": "virtual",
      "status": "active",
      "spending_limit": 5000
    }
  ]
}
```

### PATCH `/api/stripe/card`
Update card status (freeze, unfreeze, or cancel).

**Request Body:**
```json
{
  "cardId": "ic_abc123",
  "action": "freeze"  // or "unfreeze" or "cancel"
}
```

**Response:**
```json
{
  "success": true,
  "card": {
    "id": "ic_abc123",
    "status": "inactive",
    "last4": "4242"
  }
}
```

## Usage Example

### From the Cards Page UI

1. Navigate to `/card` in the application
2. Click "Request New Card" button
3. Select card type (Virtual or Physical)
4. Set the daily spending limit (default: $5,000)
5. Click "Issue Virtual Card" or "Issue Physical Card"

### Programmatic Usage

```typescript
import { cardService } from '@/modules/card/service';

// Issue a new virtual card
const newCard = await cardService.issueCard({
  userId: 'user_123',
  type: 'virtual',
  spendingLimit: 5000,
  cardholderName: 'John Doe'
});

// Get all user cards
const cards = await cardService.getUserCards('user_123');

// Freeze a card
await cardService.freezeCard('ic_abc123');

// Unfreeze a card
await cardService.unfreezeCard('ic_abc123');

// Cancel a card
await cardService.cancelCard('ic_abc123');
```

## Card Status Mapping

Stripe Issuing uses different status values than our application. The mapping is:

| Stripe Status | Application Status | Description |
|--------------|-------------------|-------------|
| `active` | `active` | Card is active and can be used |
| `inactive` | `frozen` | Card is temporarily disabled |
| `canceled` | `cancelled` | Card is permanently disabled |

## Spending Limits

- Spending limits are set per card during creation
- Limits are in dollars (USD) and converted to cents for Stripe API
- Default limit: $5,000 per day
- Limits can be customized from $1 to $100,000+ per day

## Important Notes

### Test Mode
- In Stripe test mode, cards won't work for real transactions
- Physical cards won't actually ship in test mode
- Use test card numbers for validation

### Security
- Never expose `STRIPE_SECRET_KEY` to client-side code
- All card operations must go through secure API routes
- Cardholder PII (name, email, address) should be validated
- Never display full card numbers (PAN) - only last 4 digits

### Error Handling
The API provides detailed error messages:
- `Stripe Issuing not enabled for this account`: Contact Stripe to enable Issuing
- `Customer ID is required`: Ensure customerId is provided
- `Failed to create card`: Check Stripe dashboard for more details

### Production Checklist
- [ ] Enable Stripe Issuing in your Stripe account
- [ ] Set production API keys in Vercel environment variables
- [ ] Verify cardholder information validation
- [ ] Test card creation in Stripe test mode
- [ ] Configure spending limits according to business requirements
- [ ] Set up Stripe webhooks for card events (future enhancement)
- [ ] Implement proper user authentication and authorization
- [ ] Add audit logging for card operations

## Future Enhancements

1. **Transaction History**: Display real card transactions from Stripe
2. **Spending Categories**: Allow/block specific merchant categories
3. **Card Details View**: Show more detailed card information
4. **Webhooks**: Listen to Stripe webhooks for real-time updates
5. **3D Secure**: Enhance security for online transactions
6. **Multi-currency Support**: Support cards in different currencies
7. **Card Personalization**: Custom card designs and names

## Troubleshooting

### Cards Not Loading
- Check if `STRIPE_SECRET_KEY` is set correctly
- Verify Stripe Issuing is enabled in your account
- Check browser console for error messages

### Card Creation Fails
- Ensure all required fields are provided
- Verify spending limit is within acceptable range
- Check Stripe API logs in the Stripe Dashboard

### Card Status Not Updating
- Ensure the card ID is correct
- Verify the action parameter is valid: `freeze`, `unfreeze`, or `cancel`
- Check if card is already in the requested state

## Support

For issues with:
- **Stripe Integration**: Contact Stripe Support or check [Stripe Docs](https://docs.stripe.com/issuing)
- **Application Issues**: Check the repository issues or contact the development team

## References

- [Stripe Issuing Documentation](https://docs.stripe.com/issuing)
- [Stripe API Reference](https://stripe.com/docs/api/issuing)
- [Stripe Dashboard](https://dashboard.stripe.com)
