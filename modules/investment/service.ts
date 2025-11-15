/**
 * Investment Service
 * 
 * Manages investment portfolios and trading operations.
 * Fetches real-time prices from external APIs.
 */

import { Portfolio, Asset, TradeRequest, Trade, PortfolioHolding, AssetType } from './types';

// Cache for real-time prices
interface PriceCache {
  [symbol: string]: {
    price: number;
    change24h: number;
    timestamp: number;
  };
}

const priceCache: PriceCache = {};
const CACHE_DURATION = 30000; // 30 seconds

// Fallback base prices for assets (used if API fails)
const FALLBACK_PRICES: Record<string, number> = {
  'BTC': 96327.12,
  'ETH': 3500,
  'SOL': 150,
  'AAPL': 178,
  'GOOGL': 140,
  'MSFT': 380,
  'SPY': 470,
  'QQQ': 390,
  'VTI': 240,
  'AGG': 95,
  'BND': 72,
  'TLT': 90,
};

// Store to maintain portfolio state across calls
const portfolioStore: Record<string, PortfolioHolding[]> = {};

export class InvestmentService {
  /**
   * Fetch real-time prices from API
   */
  private async fetchRealTimePrices(symbols: string[]): Promise<void> {
    try {
      // Separate crypto and non-crypto symbols
      const cryptoSymbols = symbols.filter(s => ['BTC', 'ETH', 'SOL'].includes(s));
      const stockSymbols = symbols.filter(s => !['BTC', 'ETH', 'SOL'].includes(s));

      // Fetch crypto prices
      if (cryptoSymbols.length > 0) {
        const cryptoResponse = await fetch(
          `/api/prices/crypto?symbols=${cryptoSymbols.join(',')}`
        );
        if (cryptoResponse.ok) {
          const cryptoData = await cryptoResponse.json();
          for (const [symbol, data] of Object.entries(cryptoData.prices)) {
            priceCache[symbol] = {
              price: (data as any).price,
              change24h: (data as any).change24h,
              timestamp: Date.now(),
            };
          }
        }
      }

      // Fetch stock/ETF/bond prices
      if (stockSymbols.length > 0) {
        const stockResponse = await fetch(
          `/api/prices/stocks?symbols=${stockSymbols.join(',')}`
        );
        if (stockResponse.ok) {
          const stockData = await stockResponse.json();
          for (const [symbol, data] of Object.entries(stockData.prices)) {
            priceCache[symbol] = {
              price: (data as any).price,
              change24h: (data as any).change24h,
              timestamp: Date.now(),
            };
          }
        }
      }
    } catch (error) {
      console.error('Error fetching real-time prices:', error);
    }
  }

  /**
   * Get current market price for an asset (real-time or cached)
   */
  private async getCurrentPrice(symbol: string): Promise<number> {
    // Check cache first
    const cached = priceCache[symbol];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.price;
    }

    // Fetch fresh data
    await this.fetchRealTimePrices([symbol]);
    
    // Return cached data if available, otherwise fallback
    return priceCache[symbol]?.price || FALLBACK_PRICES[symbol] || 100;
  }

  /**
   * Get 24h change for an asset (real-time or cached)
   */
  private async get24hChange(symbol: string): Promise<{ change24h: number; changePercentage: number }> {
    // Check cache first
    const cached = priceCache[symbol];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return { 
        change24h: cached.change24h,
        changePercentage: cached.change24h
      };
    }

    // Fetch fresh data
    await this.fetchRealTimePrices([symbol]);
    
    // Return cached data if available, otherwise generate fallback
    if (priceCache[symbol]) {
      return {
        change24h: priceCache[symbol].change24h,
        changePercentage: priceCache[symbol].change24h,
      };
    }
    
    // Fallback to simulated data
    const currentPrice = FALLBACK_PRICES[symbol] || 100;
    const changePercentage = (Math.random() - 0.5) * 10;
    return { 
      change24h: changePercentage,
      changePercentage 
    };
  }

  /**
   * Get user's investment portfolio
   * 
   * @param userId - User identifier
   * @returns Promise resolving to portfolio details
   */
  async getPortfolio(userId: string): Promise<Portfolio> {
    console.log(`Fetching portfolio for user: ${userId}`);
    
    // Initialize portfolio if it doesn't exist
    if (!portfolioStore[userId]) {
      portfolioStore[userId] = [
        {
          asset: {
            id: 'btc',
            symbol: 'BTC',
            name: 'Bitcoin',
            type: 'crypto',
            currentPrice: 96327.12,
            change24h: 2.5,
            changePercentage: 2.5,
          },
          quantity: 0.5,
          averageCost: 94000,
          currentValue: 48163.56,
          totalReturn: 1163.56,
          returnPercentage: 2.48,
        },
        {
          asset: {
            id: 'eth',
            symbol: 'ETH',
            name: 'Ethereum',
            type: 'crypto',
            currentPrice: 3500,
            change24h: -1.2,
            changePercentage: -1.2,
          },
          quantity: 2,
          averageCost: 3400,
          currentValue: 7000,
          totalReturn: 200,
          returnPercentage: 2.94,
        },
      ];
    }

    // Get all unique symbols from holdings
    const symbols = portfolioStore[userId].map(h => h.asset.symbol);
    
    // Fetch latest prices for all symbols
    await this.fetchRealTimePrices(symbols);

    // Update holdings with current prices
    const mockHoldings: PortfolioHolding[] = await Promise.all(
      portfolioStore[userId].map(async (holding) => {
        const currentPrice = await this.getCurrentPrice(holding.asset.symbol);
        const { change24h, changePercentage } = await this.get24hChange(holding.asset.symbol);
        const currentValue = currentPrice * holding.quantity;
        const totalCost = holding.averageCost * holding.quantity;
        const totalReturn = currentValue - totalCost;
        const returnPercentage = (totalReturn / totalCost) * 100;

        return {
          ...holding,
          asset: {
            ...holding.asset,
            currentPrice,
            change24h,
            changePercentage,
          },
          currentValue,
          totalReturn,
          returnPercentage,
        };
      })
    );

    const totalValue = mockHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalCost = mockHoldings.reduce((sum, h) => sum + (h.averageCost * h.quantity), 0);
    const totalReturn = totalValue - totalCost;

    return {
      userId,
      totalValue,
      totalCost,
      totalReturn,
      returnPercentage: (totalReturn / totalCost) * 100,
      holdings: mockHoldings,
      lastUpdated: new Date(),
    };
  }

  /**
   * Get available assets for trading
   * 
   * @returns Promise resolving to array of assets
   */
  async getAvailableAssets(): Promise<Asset[]> {
    console.log('Fetching available assets');
    
    const assetDefinitions: { id: string; symbol: string; name: string; type: AssetType }[] = [
      // Crypto assets
      { id: 'btc', symbol: 'BTC', name: 'Bitcoin', type: 'crypto' },
      { id: 'eth', symbol: 'ETH', name: 'Ethereum', type: 'crypto' },
      { id: 'sol', symbol: 'SOL', name: 'Solana', type: 'crypto' },
      // Stock assets
      { id: 'aapl', symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
      { id: 'googl', symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock' },
      { id: 'msft', symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock' },
      // ETF assets
      { id: 'spy', symbol: 'SPY', name: 'S&P 500 ETF', type: 'etf' },
      { id: 'qqq', symbol: 'QQQ', name: 'Nasdaq 100 ETF', type: 'etf' },
      { id: 'vti', symbol: 'VTI', name: 'Total Stock Market ETF', type: 'etf' },
      // Bond assets
      { id: 'agg', symbol: 'AGG', name: 'Core Bond ETF', type: 'bond' },
      { id: 'bnd', symbol: 'BND', name: 'Total Bond Market ETF', type: 'bond' },
      { id: 'tlt', symbol: 'TLT', name: '20+ Year Treasury Bond ETF', type: 'bond' },
    ];

    // Fetch real-time prices for all assets
    const symbols = assetDefinitions.map(a => a.symbol);
    await this.fetchRealTimePrices(symbols);

    return await Promise.all(
      assetDefinitions.map(async (asset) => {
        const currentPrice = await this.getCurrentPrice(asset.symbol);
        const { change24h, changePercentage } = await this.get24hChange(asset.symbol);
        return {
          ...asset,
          currentPrice,
          change24h,
          changePercentage,
        };
      })
    );
  }

  /**
   * Execute a trade (buy or sell)
   * 
   * @param request - Trade request details
   * @returns Promise resolving to trade result
   */
  async executeTrade(request: TradeRequest): Promise<Trade> {
    console.log(`Executing ${request.type} trade for ${request.quantity} ${request.assetSymbol}`);
    
    const assets = await this.getAvailableAssets();
    const asset = assets.find(a => a.symbol === request.assetSymbol);
    const price = request.price || asset?.currentPrice || 0;

    // Update portfolio store
    if (!portfolioStore[request.userId]) {
      portfolioStore[request.userId] = [];
    }

    if (request.type === 'buy') {
      // Find existing holding
      const existingHolding = portfolioStore[request.userId].find(
        h => h.asset.symbol === request.assetSymbol
      );

      if (existingHolding && asset) {
        // Update existing holding
        const totalCost = (existingHolding.averageCost * existingHolding.quantity) + (price * request.quantity);
        const totalQuantity = existingHolding.quantity + request.quantity;
        existingHolding.quantity = totalQuantity;
        existingHolding.averageCost = totalCost / totalQuantity;
      } else if (asset) {
        // Add new holding
        portfolioStore[request.userId].push({
          asset: {
            ...asset,
            currentPrice: price,
          },
          quantity: request.quantity,
          averageCost: price,
          currentValue: price * request.quantity,
          totalReturn: 0,
          returnPercentage: 0,
        });
      }
    } else if (request.type === 'sell') {
      // Find existing holding
      const existingHolding = portfolioStore[request.userId].find(
        h => h.asset.symbol === request.assetSymbol
      );

      if (existingHolding) {
        existingHolding.quantity -= request.quantity;
        // Remove holding if quantity is 0 or negative
        if (existingHolding.quantity <= 0) {
          portfolioStore[request.userId] = portfolioStore[request.userId].filter(
            h => h.asset.symbol !== request.assetSymbol
          );
        }
      }
    }

    const trade: Trade = {
      id: `trade_${Date.now()}`,
      userId: request.userId,
      assetSymbol: request.assetSymbol,
      type: request.type,
      quantity: request.quantity,
      price,
      total: price * request.quantity,
      status: 'completed',
      timestamp: new Date(),
    };

    return trade;
  }

  /**
   * Get trade history
   * 
   * @param userId - User identifier
   * @param limit - Number of trades to retrieve
   * @returns Promise resolving to trade history
   */
  async getTradeHistory(userId: string, limit: number = 20): Promise<Trade[]> {
    console.log(`Fetching trade history for user: ${userId}`);
    
    return [
      {
        id: 'trade_1',
        userId,
        assetSymbol: 'BTC',
        type: 'buy',
        quantity: 0.5,
        price: 42000,
        total: 21000,
        status: 'completed',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'trade_2',
        userId,
        assetSymbol: 'ETH',
        type: 'buy',
        quantity: 2,
        price: 2800,
        total: 5600,
        status: 'completed',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    ];
  }
}

export const investmentService = new InvestmentService();
