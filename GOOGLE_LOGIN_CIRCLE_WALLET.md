# Google Login and Circle Wallet Integration Guide

This guide explains the Google Login integration and Circle developer-controlled wallet implementation added to DEO Finance.

## Overview

The application now supports two wallet types on the ARC blockchain:
1. **Existing ARC Smart Wallet**: Client-side wallet created using ethers.js
2. **Circle Smart Wallet**: Developer-controlled wallet linked to Google account (NEW)

Both wallets are displayed on the account page, with the Circle wallet appearing as a separate section below the existing wallet.

## Features

### Google Authentication
- Sign in with Google OAuth using NextAuth.js
- Secure session management
- User profile integration with Circle wallets

### Circle Developer-Controlled Wallets
- Wallets linked to Google-authenticated users
- Built on Circle's ARC blockchain testnet
- Smart Contract Account (SCA) type wallets
- Full USDC balance tracking
- Transaction history
- Send and receive functionality

## Setup Instructions

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure OAuth consent screen if not already done
6. Select "Web application" as the application type
7. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
8. Copy the Client ID and Client Secret

### 2. Circle API Setup

1. Visit [Circle Developer Portal](https://developers.circle.com/)
2. Sign up or log in to your account
3. Create a new project
4. Navigate to API Keys section
5. Generate a new API key for testnet/production
6. Copy the API Key

### 3. Environment Variables

Add the following to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Circle User-Controlled Wallets
CIRCLE_API_KEY=your_circle_api_key_here
NEXT_PUBLIC_CIRCLE_API_KEY=your_circle_api_key_here
CIRCLE_ENTITY_SECRET=your_circle_entity_secret_here
CIRCLE_APP_ID=your_circle_app_id_here

# Circle ARC Blockchain
NEXT_PUBLIC_ARC_TESTNET_RPC=https://rpc.testnet.arc.network
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### 4. Vercel Deployment

If deploying to Vercel, add all environment variables in your project settings:
1. Go to your Vercel project
2. Navigate to Settings → Environment Variables
3. Add each variable for Production, Preview, and Development environments

## User Flow

### Authentication
1. User clicks "Sign in with Google" on the auth page
2. Google OAuth flow is triggered
3. User grants permissions
4. Session is created and user is redirected to account page

### Wallet Creation
1. After signing in, user sees the Circle Wallet section on account page
2. Click "Create Circle Wallet" button
3. Circle wallet is created and linked to Google account
4. Wallet address and balance are displayed

### Using the Wallet
- **View Balance**: USDC balance shown on the wallet card
- **Receive Funds**: Click "Receive" to get wallet address and QR code
- **Send Funds**: Click "Send" to transfer USDC (requires PIN setup in production)
- **Transaction History**: View all past transactions

## Architecture

### Components

#### SessionProvider
- Wraps the application with NextAuth session context
- Located in: `components/providers/SessionProvider.tsx`

#### CircleWalletSection
- Main Circle wallet UI component
- Displays balance, address, and transactions
- Handles wallet creation and data loading
- Located in: `components/wallet/CircleWalletSection.tsx`

### Services

#### circleWallet.ts
- Circle SDK integration service
- Methods for wallet operations:
  - `createUser()`: Register user in Circle system
  - `createWallet()`: Create new wallet (returns challengeId)
  - `getWallets()`: Fetch user's wallets
  - `getWalletBalance()`: Get USDC balance
  - `createTransaction()`: Initiate transfer
  - `getTransactions()`: Fetch transaction history

### API Routes

All Circle wallet APIs are under `/api/circle/wallet/`:

#### POST /api/circle/wallet/create
Create a new Circle wallet for authenticated user.

**Request Body**:
```json
{
  "userToken": "token_user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "challengeId": "challenge-id-here",
  "message": "Wallet creation initiated..."
}
```

#### GET /api/circle/wallet/create?userToken=xxx
Get wallets for authenticated user.

**Response**:
```json
{
  "success": true,
  "wallets": [
    {
      "walletId": "wallet-id",
      "address": "0x...",
      "blockchain": "ARC-TESTNET",
      "accountType": "SCA",
      "state": "LIVE"
    }
  ]
}
```

#### GET /api/circle/wallet/balance?walletId=xxx&userToken=xxx
Get wallet USDC balance.

**Response**:
```json
{
  "success": true,
  "tokenBalances": [
    {
      "token": {
        "id": "token-id",
        "symbol": "USDC",
        "decimals": 6
      },
      "amount": "100.00"
    }
  ]
}
```

#### GET /api/circle/wallet/transactions?userToken=xxx&walletId=xxx
Get transaction history.

**Response**:
```json
{
  "success": true,
  "transactions": [
    {
      "id": "tx-id",
      "transactionType": "OUTBOUND",
      "state": "COMPLETE",
      "amounts": ["10.00"],
      "destinationAddress": "0x...",
      "createDate": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/circle/wallet/transfer
Create a transfer transaction.

**Request Body**:
```json
{
  "userToken": "token_user@example.com",
  "walletId": "wallet-id",
  "destinationAddress": "0x...",
  "amount": "10.00",
  "tokenId": "token-id"
}
```

**Response**:
```json
{
  "success": true,
  "challengeId": "challenge-id",
  "transaction": { ... }
}
```

## Security Considerations

### Production Checklist
- [ ] Rotate NEXTAUTH_SECRET regularly
- [ ] Use secure, random secret generation
- [ ] Enable HTTPS/SSL for all environments
- [ ] Set proper CORS policies
- [ ] Implement rate limiting on API routes
- [ ] Add request validation and sanitization
- [ ] Use production Circle API keys (not testnet)
- [ ] Configure proper OAuth redirect URIs
- [ ] Enable Circle's security features (MFA, PIN)
- [ ] Implement proper error handling
- [ ] Add audit logging
- [ ] Review and update dependencies regularly

### Circle Challenges
Circle's User-Controlled Wallets use a challenge-based security model:
- **Wallet Creation**: Returns a challengeId that must be completed with PIN setup
- **Transactions**: Require challenge completion for security
- **PIN Management**: Users set and manage their own PINs

In production, you need to implement:
1. Circle's Web SDK for challenge completion UI
2. PIN setup flow
3. Security question management
4. Challenge status monitoring

## Testing

### Testing Google Login
1. Start the development server: `npm run dev`
2. Navigate to `/auth`
3. Click "Continue with Google"
4. Complete Google authentication
5. Verify redirect to `/account`
6. Check session is active

### Testing Circle Wallet
1. Sign in with Google
2. Navigate to `/account`
3. Scroll to Circle Smart Wallet section
4. Click "Create Circle Wallet"
5. Verify wallet creation (note: will show demo mode without proper Circle API keys)

### Demo Mode
Without valid Circle API credentials, the app will:
- Show error messages for Circle wallet operations
- Still display the UI components
- Allow testing of Google authentication flow

## Troubleshooting

### Google OAuth Errors
- **"redirect_uri_mismatch"**: Check authorized redirect URIs in Google Console
- **"invalid_client"**: Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- **Session not persisting**: Check NEXTAUTH_SECRET is set

### Circle API Errors
- **"CIRCLE_API_KEY is not configured"**: Ensure environment variable is set
- **"Unauthorized"**: Verify API key is valid and has correct permissions
- **"Wallet creation failed"**: Check Circle account has testnet access

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Circle Developer Portal](https://developers.circle.com/)
- [Circle User-Controlled Wallets SDK](https://www.npmjs.com/package/@circle-fin/user-controlled-wallets)
- [Circle API Reference](https://developers.circle.com/api-reference/w3s/common/ping)

## Support

For issues or questions:
- Check the [CIRCLE_AUTH_SETUP.md](./CIRCLE_AUTH_SETUP.md) document
- Visit [Circle Support](https://support.circle.com/)
- Open an issue in the GitHub repository

## Future Enhancements

Potential improvements:
- [ ] Implement Circle Web SDK for challenge completion
- [ ] Add PIN setup flow
- [ ] Multi-wallet support per user
- [ ] Enhanced transaction filtering and search
- [ ] NFT support
- [ ] Multi-chain support
- [ ] Social recovery features
- [ ] Gasless transactions
- [ ] Batch transactions
