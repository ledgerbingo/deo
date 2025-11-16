# DEO Finance

**Comprehensive Financial Service on Circle's ARC Blockchain**

DEO Finance provides next-generation financial services powered by USDC stablecoin on Circle's ARC blockchain testnet, integrated with Stripe for KYC verification and card issuance.

## Features

### 🔐 ARC Smart Wallet with Real-Time Blockchain Integration
- Full-featured USDC wallet on Circle's ARC blockchain testnet
- Real-time balance tracking directly from blockchain
- Complete transaction history with USDC transfer events
- Detailed transaction receipts with gas fees and timestamps
- Send and receive USDC stablecoin
- Transaction filtering (all, sent, received)
- Direct links to ARC testnet block explorer (testnet.arcscan.app)
- Account abstraction for improved user experience

### 🌐 Circle Developer-Controlled Wallets (NEW)
- Google OAuth authentication with NextAuth.js
- Circle SDK integration for developer-controlled wallets
- Wallets linked to Google accounts for easy access
- Built on Circle's ARC blockchain testnet
- Smart Contract Account (SCA) type wallets
- Full balance and transaction history
- Secure challenge-based security model
- Separate wallet section on account page

### 💳 Stripe Card Issuance
- Virtual and physical card issuance powered by Stripe
- Instant card generation
- Spend USDC anywhere with seamless conversion
- Daily spending limits and controls

### ✅ Identity Verification (KYC)
- Fast and secure KYC through Stripe Identity
- Document-based verification
- Compliant with financial regulations
- Quick approval process

### 🌐 Circle ARC Blockchain Integration
- Built on Circle's ARC testnet
- Fast transaction processing
- Low transaction fees
- Secure and reliable infrastructure
- Direct blockchain data querying
- USDC ERC-20 token support

## Tech Stack

- **Frontend**: Next.js 14 with React 19
- **Styling**: Tailwind CSS
- **Blockchain**: Circle ARC Testnet, ethers.js
- **Circle SDK**: @circle-fin/user-controlled-wallets
- **Authentication**: NextAuth.js with Google OAuth
- **Payments**: Stripe (Identity, Card Issuing)
- **Language**: TypeScript
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Stripe account with test mode enabled
- Circle API credentials for ARC testnet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ledgerbingo/deo.git
cd deo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
   - Circle API keys
   - ARC testnet RPC URL
   - Stripe API keys (Secret and Publishable)
   - Stripe Identity webhook secret

### Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
deo/
├── app/
│   ├── api/
│   │   ├── stripe/        # Stripe API routes
│   │   │   ├── kyc/       # KYC verification endpoints
│   │   │   └── card/      # Card issuance endpoints
│   │   └── wallet/        # Wallet API routes
│   │       ├── create/    # Wallet creation
│   │       ├── balance/   # Balance queries
│   │       └── transfer/  # USDC transfers
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Landing page
├── components/
│   └── ui/               # Reusable UI components
├── lib/
│   └── services/         # Business logic services
│       ├── wallet.ts     # Wallet service
│       └── stripe.ts     # Stripe service
└── public/               # Static assets
```

## API Endpoints

### Wallet APIs

- `POST /api/wallet/create` - Create a new wallet
- `GET /api/wallet/create?address={address}` - Get wallet information (balance, transaction count)
- `GET /api/wallet/balance?address={address}` - Get USDC balance
- `GET /api/wallet/transactions?address={address}&limit={limit}` - Get transaction history
- `GET /api/wallet/receipt?hash={txHash}` - Get transaction receipt details
- `POST /api/wallet/transfer` - Transfer USDC

### Stripe APIs

- `POST /api/stripe/kyc` - Create KYC verification session
- `GET /api/stripe/kyc?sessionId={id}` - Get verification status
- `POST /api/stripe/card` - Issue a new card
- `GET /api/stripe/card?customerId={id}` - List customer cards

## Key Features Implementation

### ARC Smart Wallet
The wallet implementation uses ethers.js to interact directly with the ARC blockchain:
- **Real-time balance queries**: Fetches USDC balance from the ERC-20 contract
- **Transaction history**: Retrieves Transfer events from the blockchain
- **Transaction receipts**: Provides detailed receipt information including gas fees
- **Block explorer integration**: Links to testnet.arcscan.app for transaction verification
- **Account abstraction support**: Enhanced security and user experience features

### Stripe Identity Integration
KYC verification flow:
1. User initiates verification
2. System creates Stripe Identity session
3. User completes document verification
4. System receives webhook confirmation
5. Account is verified and full features unlocked

### Card Issuance
Card issuance process:
1. User completes KYC verification
2. User requests virtual or physical card
3. System creates Stripe cardholder
4. Card is issued with spending controls
5. User can start using the card immediately

## Security Considerations

⚠️ **Important**: This is a demonstration application. For production use:

- Never expose private keys or mnemonics
- Implement proper key management (HSM, KMS)
- Use secure session management
- Implement rate limiting
- Add proper error handling
- Use environment-specific configurations
- Implement audit logging
- Add multi-factor authentication
- Use secure random number generation
- Implement proper CORS policies

## Environment Variables

```env
# Circle ARC Blockchain
NEXT_PUBLIC_CIRCLE_API_KEY=your_circle_api_key
CIRCLE_API_KEY=your_circle_api_key
NEXT_PUBLIC_ARC_TESTNET_RPC=https://rpc.testnet.arc.network

# Circle User-Controlled Wallets
CIRCLE_ENTITY_SECRET=your_circle_entity_secret
CIRCLE_APP_ID=your_circle_app_id

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_IDENTITY_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Documentation

- **[GOOGLE_LOGIN_CIRCLE_WALLET.md](GOOGLE_LOGIN_CIRCLE_WALLET.md)** - NEW: Google Login and Circle wallet integration guide
- **[SERVICE_INTEGRATION.md](SERVICE_INTEGRATION.md)** - Detailed guide on how module services connect to APIs
- **[MODULAR_DESIGN.md](MODULAR_DESIGN.md)** - Architecture and module catalog
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview and status
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Implementation details and statistics
- **[ARC_WALLET_IMPLEMENTATION.md](ARC_WALLET_IMPLEMENTATION.md)** - ARC wallet features and integration
- **[ARC_TESTNET_CONNECTION_UPDATE.md](ARC_TESTNET_CONNECTION_UPDATE.md)** - ARC testnet connection update details
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Guide for testing with real ARC testnet data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License

## Support

For support, please open an issue in the GitHub repository.

---

**Built with ❤️ using Circle ARC Blockchain and Stripe**