# Circle Authentication Setup Guide

This document provides information about setting up Circle authentication for the DEO Finance application.

## Overview

DEO Finance uses Circle's ARC blockchain for wallet and USDC operations. The current implementation supports direct wallet creation without requiring Circle's social login features.

## Required Environment Variables

### Circle ARC Blockchain Configuration

The following environment variables are required for Circle ARC blockchain integration:

```env
# Circle API Key (if using Circle's SDK features)
NEXT_PUBLIC_CIRCLE_API_KEY=your_circle_api_key_here
CIRCLE_API_KEY=your_circle_api_key_here

# ARC Testnet RPC URL
NEXT_PUBLIC_ARC_TESTNET_RPC=https://rpc.testnet.arc.network
```

### How to Obtain Circle API Keys

1. **Visit Circle Developer Portal**: Go to [https://developers.circle.com/](https://developers.circle.com/)
2. **Sign Up/Login**: Create an account or log in with your existing credentials
3. **Create a Project**: Navigate to the dashboard and create a new project
4. **Generate API Keys**: 
   - Go to API Keys section
   - Generate a new API key for testnet/production
   - Copy both the API Key and API Secret
5. **Configure Environment**: Add the keys to your `.env` file

## Circle Social Login (Optional)

If you plan to implement Circle's social login features (Google, Email, etc.) for user authentication, you'll need:

### Additional Configuration

```env
# Circle OAuth Configuration (if implementing social login)
CIRCLE_CLIENT_ID=your_circle_client_id
CIRCLE_CLIENT_SECRET=your_circle_client_secret
CIRCLE_REDIRECT_URI=http://localhost:3000/auth/callback

# Circle User-Controlled Wallets SDK
CIRCLE_ENTITY_SECRET=your_entity_secret
CIRCLE_APP_ID=your_app_id
```

### Social Login Setup Steps

1. **Enable Social Login in Circle Dashboard**:
   - Log into Circle Developer Portal
   - Navigate to your project settings
   - Enable "User-Controlled Wallets" feature
   - Configure OAuth providers (Google, Email, etc.)

2. **Configure OAuth Providers**:
   - **Google OAuth**: 
     - Set up Google Cloud Console project
     - Enable Google+ API
     - Create OAuth 2.0 credentials
     - Add authorized redirect URIs
   - **Email/Password**:
     - Enable email authentication in Circle dashboard
     - Configure email templates and verification settings

3. **Set Redirect URIs**:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`

4. **Add to Vercel Environment Variables**:
   - Go to your Vercel project settings
   - Navigate to Environment Variables section
   - Add all Circle configuration variables
   - Ensure they're available for the correct environments (Production, Preview, Development)

## Current Implementation

The current DEO Finance implementation uses:
- Direct wallet creation via ethers.js
- Local storage for wallet management
- Circle ARC testnet RPC for blockchain operations
- No Circle social login integration (wallets are created client-side)

If the ARC testnet RPC is unavailable, the application automatically falls back to demo mode with sample data.

## Vercel Deployment

### Required Environment Variables in Vercel

For the current implementation, set these in Vercel:

```
NEXT_PUBLIC_ARC_TESTNET_RPC=https://rpc.testnet.arc.network
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_IDENTITY_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### Optional Circle Variables (for future features)

If you plan to add Circle social login:

```
CIRCLE_API_KEY=your_circle_api_key
NEXT_PUBLIC_CIRCLE_API_KEY=your_circle_api_key
CIRCLE_CLIENT_ID=your_circle_client_id
CIRCLE_CLIENT_SECRET=your_circle_client_secret
```

## Testing

To test the application without Circle API keys:
1. The app will automatically use demo mode for wallet data
2. Wallet creation and management still works (using ethers.js)
3. All UI features remain functional with sample data

## Support

For issues with Circle API keys or social login:
- Circle Developer Docs: https://developers.circle.com/docs
- Circle Support: https://support.circle.com/
- DEO Finance Issues: https://github.com/ledgerbingo/deo/issues

## Security Notes

⚠️ **Important Security Reminders**:
- Never commit API keys or secrets to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Use different keys for development and production
- Enable IP whitelisting for production API keys where possible
- Store private keys securely (use HSM/KMS in production)
