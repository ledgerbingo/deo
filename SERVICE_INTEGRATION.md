# DEO Finance - Service Integration Documentation

## Overview

This document describes how the DEO Finance modular services are integrated with the actual blockchain and Stripe APIs.

## Architecture

DEO Finance uses a three-tier architecture:

1. **API Routes** (`/app/api/*`) - Next.js API routes that interact with external services
2. **Service Layer** (`/lib/services/*`) - Core business logic for blockchain and Stripe
3. **Module Services** (`/modules/*/service.ts`) - High-level feature services that use API routes

## Service Integration Status

### ✅ Connected Services (Using Real APIs)

#### 1. Account Module (`/modules/account/service.ts`)

**Purpose**: USDC wallet and transaction management

**Connected Endpoints**:
- `createWallet()` → `POST /api/wallet/create`
- `getWallet()` → `GET /api/wallet/create?address={address}`
- `getBalance()` → `GET /api/wallet/balance?address={address}`
- `sendTransaction()` → `POST /api/wallet/transfer`
- `getTransactionHistory()` → `GET /api/wallet/transactions?address={address}`
- `getTransaction()` → `GET /api/wallet/receipt?hash={txHash}`

**Backend Service**: `/lib/services/wallet.ts`
- Uses ethers.js to interact with Circle ARC blockchain
- Queries USDC ERC-20 contract for balances and transfers
- Provides graceful degradation with demo data if RPC unavailable

#### 2. Card Module (`/modules/card/service.ts`)

**Purpose**: Card issuance and management

**Connected Endpoints**:
- `issueCard()` → `POST /api/stripe/card`
- `getUserCards()` → `GET /api/stripe/card?customerId={id}`

**Backend Service**: `/lib/services/stripe.ts`
- Uses Stripe Issuing API to create cards
- Manages cardholders and spending controls
- Supports both virtual and physical cards

#### 3. Onboarding Module (`/modules/onboarding/service.ts`)

**Purpose**: User onboarding and KYC verification

**Connected Endpoints**:
- `startKYC()` → `POST /api/stripe/kyc`
- `getKYCStatusBySession()` → `GET /api/stripe/kyc?sessionId={id}`

**Backend Service**: `/lib/services/stripe.ts`
- Uses Stripe Identity API for document verification
- Creates verification sessions
- Checks verification status

### 📊 Mock Data Services (No Backend APIs Yet)

#### 4. Investment Module (`/modules/investment/service.ts`)
- Returns mock portfolio data
- Simulates trading operations
- Ready for integration when backend APIs are available

#### 5. Exchange Module (`/modules/exchange/service.ts`)
- Returns mock exchange rates
- Simulates currency exchanges
- Ready for integration when backend APIs are available

#### 6. Dashboard, Settings, Support, Notifications
- Use mock data appropriate for their features
- Can be connected to backend APIs when needed

## API Integration Patterns

### Request Flow

```
UI Component → Module Service → API Route → Core Service → External API
                                                            (Blockchain/Stripe)
```

### Example: Getting Wallet Balance

```typescript
// 1. UI calls module service
import { accountService } from '@/modules/account/service';
const balance = await accountService.getBalance(address);

// 2. Module service calls API route
const response = await fetch(`/api/wallet/balance?address=${address}`);

// 3. API route uses core service
import { walletService } from '@/lib/services/wallet';
const balance = await walletService.getUSDCBalance(address);

// 4. Core service queries blockchain
const usdcContract = new ethers.Contract(USDC_ADDRESS, ABI, provider);
const balance = await usdcContract.balanceOf(address);
```

### Error Handling

All services implement graceful degradation:

```typescript
try {
  // Attempt real API call
  const response = await fetch('/api/endpoint');
  return response.data;
} catch (error) {
  console.error('API error:', error);
  // Return empty/default data instead of throwing
  return [];
}
```

This ensures the UI never breaks even if APIs are unavailable.

## Environment Configuration

### Required Environment Variables

```env
# Circle ARC Blockchain
NEXT_PUBLIC_ARC_TESTNET_RPC=https://rpc.testnet.arc.network

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_IDENTITY_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Demo Mode

When RPC endpoints are unavailable, the services automatically fall back to demo mode:
- Returns realistic mock data
- Logs demo mode status
- Allows development without live services

## Testing the Integration

### 1. Test Wallet Balance

```bash
curl http://localhost:3000/api/wallet/balance?address=0x742D35cC6634C0532925A3b844bc9E7595f0BEb8
```

### 2. Test Wallet Creation

```bash
curl -X POST http://localhost:3000/api/wallet/create \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123"}'
```

### 3. Test Transaction History

```bash
curl http://localhost:3000/api/wallet/transactions?address=0x742D35cC6634C0532925A3b844bc9E7595f0BEb8&limit=10
```

### 4. Test KYC Session Creation

```bash
curl -X POST http://localhost:3000/api/stripe/kyc \
  -H "Content-Type: application/json" \
  -d '{"customerId":"user123"}'
```

### 5. Test Card Issuance

```bash
curl -X POST http://localhost:3000/api/stripe/card \
  -H "Content-Type: application/json" \
  -d '{"customerId":"user123","cardholderName":"John Doe","isVirtual":true}'
```

## Benefits of This Architecture

### 1. Separation of Concerns
- UI components don't need to know about API details
- Module services provide clean, type-safe interfaces
- API routes handle HTTP and external service communication

### 2. Type Safety
- Full TypeScript coverage from UI to API
- Interfaces define clear contracts
- Compile-time error detection

### 3. Testability
- Each layer can be tested independently
- Mock data easily substituted
- API routes can be tested with mock services

### 4. Flexibility
- Easy to swap implementations
- Can add new services without changing UI
- Support for multiple backends

### 5. Developer Experience
- Clear code organization
- Easy to understand and maintain
- Good documentation at each level

## Future Enhancements

### 1. Add Investment Backend
- Create API routes for portfolio management
- Integrate with market data providers
- Connect investment service to real APIs

### 2. Add Exchange Backend
- Create API routes for currency exchange
- Integrate with exchange rate APIs
- Connect exchange service to real rates

### 3. Add Caching
- Cache blockchain queries for better performance
- Implement Redis for session management
- Add CDN for static assets

### 4. Add Real-Time Updates
- WebSocket connections for live data
- Push notifications for transactions
- Real-time balance updates

### 5. Enhanced Error Handling
- Retry logic for failed requests
- Better error messages for users
- Detailed logging and monitoring

## Security Considerations

### Current Implementation
- ✅ No private keys stored in frontend
- ✅ API keys in environment variables
- ✅ Input validation on all endpoints
- ✅ Type safety prevents common errors
- ✅ CodeQL security scan passed

### Production Recommendations
- Implement proper authentication/authorization
- Add rate limiting to API endpoints
- Use secure session management
- Implement API key rotation
- Add monitoring and alerting
- Use proper key management (HSM/KMS)
- Add audit logging
- Implement CORS policies

## Troubleshooting

### Issue: RPC Timeout
**Symptom**: API returns demo data with "RPC request timeout" message
**Solution**: Check ARC testnet RPC URL is correct and accessible

### Issue: Stripe API Error
**Symptom**: Card or KYC endpoints return errors
**Solution**: Verify Stripe API keys are correct and have necessary permissions

### Issue: Transaction Not Found
**Symptom**: Transaction history or receipt returns empty
**Solution**: Ensure the address has transactions on ARC testnet

### Issue: Build Errors
**Symptom**: TypeScript errors during build
**Solution**: Run `npm install` to ensure all dependencies are installed

## Conclusion

The DEO Finance service integration successfully connects modular services to real blockchain and Stripe APIs while maintaining:
- Clean architecture with separation of concerns
- Type-safe interfaces throughout
- Graceful error handling
- Developer-friendly structure
- Production-ready foundation

All core financial services (wallet, card, KYC) are now using real APIs, providing a solid foundation for production deployment.
