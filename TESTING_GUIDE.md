# Testing Guide: ARC Testnet Real Data Connection

## Overview
This guide helps you test the DEO Finance application with real ARC testnet blockchain data after the connection update.

## Prerequisites

### 1. Get Test USDC
Visit the official Circle faucet to get test USDC:
- **Faucet URL**: https://faucet.circle.com
- Select "Arc Testnet" as the network
- Enter your wallet address
- Request test USDC tokens

### 2. Setup Environment Variables
Create a `.env.local` file in the project root:

```env
# Circle ARC Blockchain - Official Testnet
NEXT_PUBLIC_ARC_TESTNET_RPC=https://rpc.testnet.arc.network

# Optional: Alternative RPC endpoints for redundancy
# NEXT_PUBLIC_ARC_TESTNET_RPC=https://arc-testnet.drpc.org
# NEXT_PUBLIC_ARC_TESTNET_RPC=https://arc-testnet.g.alchemy.com/YOUR_API_KEY

# Stripe Configuration (for other features)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_IDENTITY_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Application
```bash
npm run build
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Testing Real Blockchain Connection

### Test 1: Balance Query
Test retrieving real USDC balance from the blockchain:

```bash
# Using curl
curl "http://localhost:3000/api/wallet/balance?address=0x742D35cC6634C0532925A3b844bc9E7595f0BEb8"
```

**Expected Response:**
```json
{
  "success": true,
  "balance": {
    "raw": "1000000000",
    "formatted": "1000.00",
    "decimals": 6,
    "symbol": "USDC",
    "address": "0x742D35cC6634C0532925A3b844bc9E7595f0BEb8"
  }
}
```

### Test 2: Wallet Information
Test retrieving complete wallet information:

```bash
curl "http://localhost:3000/api/wallet/create?address=0x742D35cC6634C0532925A3b844bc9E7595f0BEb8"
```

**Expected Response:**
```json
{
  "success": true,
  "wallet": {
    "address": "0x742D35cC6634C0532925A3b844bc9E7595f0BEb8",
    "nativeBalance": "0.1234",
    "usdcBalance": "1000.00",
    "transactionCount": 5
  }
}
```

### Test 3: Transaction History
Test retrieving transaction history from the blockchain:

```bash
curl "http://localhost:3000/api/wallet/transactions?address=0x742D35cC6634C0532925A3b844bc9E7595f0BEb8&limit=10"
```

**Expected Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "hash": "0xabc123...",
      "from": "0x123...",
      "to": "0x742...",
      "amount": "100.00",
      "currency": "USDC",
      "timestamp": 1699564800,
      "blockNumber": 123456,
      "status": "success",
      "type": "receive",
      "gasUsed": "65000",
      "fee": "0.000123"
    }
  ],
  "count": 1
}
```

### Test 4: Transaction Receipt
Test retrieving detailed transaction receipt:

```bash
curl "http://localhost:3000/api/wallet/receipt?hash=0xYOUR_TRANSACTION_HASH"
```

## Verification with Block Explorer

### 1. View Wallet on Explorer
Visit the ARC testnet block explorer:
```
https://testnet.arcscan.app/address/YOUR_WALLET_ADDRESS
```

Example:
```
https://testnet.arcscan.app/address/0x742D35cC6634C0532925A3b844bc9E7595f0BEb8
```

### 2. View Transaction on Explorer
```
https://testnet.arcscan.app/tx/YOUR_TRANSACTION_HASH
```

### 3. View USDC Contract
```
https://testnet.arcscan.app/address/0x3600000000000000000000000000000000000000
```

## Network Configuration for MetaMask

To add ARC Testnet to MetaMask manually:

1. Open MetaMask
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Enter the following details:

```
Network Name: Arc Testnet
New RPC URL: https://rpc.testnet.arc.network
Chain ID: 5042002
Currency Symbol: USDC
Block Explorer URL: https://testnet.arcscan.app
```

## Using ethers.js Directly

You can also interact with ARC testnet using ethers.js:

```javascript
import { ethers } from 'ethers'

// Connect to ARC testnet
const provider = new ethers.JsonRpcProvider('https://rpc.testnet.arc.network')

// USDC contract
const USDC_ADDRESS = '0x3600000000000000000000000000000000000000'
const USDC_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)'
]

// Create contract instance
const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider)

// Get balance
const balance = await usdcContract.balanceOf('0x742D35cC6634C0532925A3b844bc9E7595f0BEb8')
const decimals = await usdcContract.decimals()
const formattedBalance = ethers.formatUnits(balance, decimals)

console.log(`USDC Balance: ${formattedBalance} USDC`)
```

## Troubleshooting

### Issue: "RPC request timeout"
**Solution**: 
- Check your internet connection
- Try alternative RPC endpoint: `https://arc-testnet.drpc.org`
- Increase timeout in the code

### Issue: "Failed to retrieve balance"
**Solution**:
- Verify the wallet address is valid
- Ensure the RPC endpoint is accessible
- Check if the network is operational at https://testnet.arcscan.app

### Issue: "Transaction not found"
**Solution**:
- Wait a few seconds for transaction to be indexed
- Verify transaction hash is correct
- Check transaction on block explorer

### Issue: Demo mode activated
**Solution**:
- This happens when RPC connection fails
- Check environment variables are set correctly
- Verify RPC endpoint is reachable

## Network Status

Check ARC testnet status:
- **Block Explorer**: https://testnet.arcscan.app
- **Network Stats**: Check the latest blocks and transactions
- **Faucet Status**: https://faucet.circle.com

## API Rate Limits

The public RPC endpoints may have rate limits:
- **Public RPC**: ~100 requests per minute
- **Alchemy (with API key)**: Higher limits based on plan
- **dRPC**: Higher limits with account

For production use, consider:
1. Using Alchemy or dRPC with an API key
2. Implementing request caching
3. Adding rate limiting on your backend

## Advanced Testing

### Load Testing
Test with multiple concurrent requests:

```bash
# Install apache bench
sudo apt-get install apache2-utils

# Run 100 requests with 10 concurrent
ab -n 100 -c 10 "http://localhost:3000/api/wallet/balance?address=0x742D35cC6634C0532925A3b844bc9E7595f0BEb8"
```

### Integration Testing
Create automated tests:

```javascript
describe('ARC Testnet Connection', () => {
  it('should fetch real USDC balance', async () => {
    const response = await fetch(
      'http://localhost:3000/api/wallet/balance?address=0x742D35cC6634C0532925A3b844bc9E7595f0BEb8'
    )
    const data = await response.json()
    
    expect(data.success).toBe(true)
    expect(data.balance).toBeDefined()
    expect(data.balance.symbol).toBe('USDC')
    expect(data.balance.decimals).toBe(6)
  })
})
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never expose private keys**: The demo wallet creation exposes mnemonics for testing only
2. **Use environment variables**: Store sensitive data in environment variables
3. **Implement rate limiting**: Protect your API endpoints
4. **Validate inputs**: Always validate and sanitize user inputs
5. **Use HTTPS**: In production, always use HTTPS
6. **Implement authentication**: Add proper authentication for wallet operations

## Performance Optimization

### Caching
Implement caching for balance queries:

```javascript
// Example: Cache balance for 10 seconds
const cache = new Map()
const CACHE_TTL = 10000

async function getBalanceWithCache(address) {
  const cached = cache.get(address)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  
  const balance = await fetchBalance(address)
  cache.set(address, { data: balance, timestamp: Date.now() })
  return balance
}
```

### Connection Pooling
Reuse provider instances:

```javascript
// Create a singleton provider
let provider = null

function getProvider() {
  if (!provider) {
    provider = new ethers.JsonRpcProvider('https://rpc.testnet.arc.network')
  }
  return provider
}
```

## Monitoring

Track important metrics:
- RPC response times
- Success/failure rates
- Gas fees
- Transaction confirmation times
- API endpoint usage

## Resources

- **ARC Documentation**: https://docs.arc.network
- **Circle Developer Docs**: https://developers.circle.com
- **ethers.js Documentation**: https://docs.ethers.org
- **Next.js Documentation**: https://nextjs.org/docs
- **ARC Testnet Explorer**: https://testnet.arcscan.app
- **Circle Faucet**: https://faucet.circle.com

## Support

For issues or questions:
1. Check the [ARC Documentation](https://docs.arc.network)
2. Visit the [ARC Testnet Explorer](https://testnet.arcscan.app)
3. Open an issue in the GitHub repository
4. Join the Circle developer community

---

**Last Updated**: 2025-11-15  
**Status**: ✅ Ready for Testing
