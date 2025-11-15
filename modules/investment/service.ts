/**
 * Investment Service
 * 
 * Manages investment portfolios and trading operations.
 * Uses dynamic demo data that simulates real market behavior.
 */

import { Portfolio, Asset, TradeRequest, Trade, PortfolioHolding, AssetType } from './types';

// Simulate realistic price fluctuations
const generatePriceVariation = (basePrice: number, volatility: number = 0.02): number => {
  const variation = (Math.random() - 0.5) * 2 * volatility;
  return basePrice * (1 + variation);
};

// Base prices for assets (simulating realistic market prices)
const BASE_PRICES: Record<string, number> = {
  'BTC': 45000,
  'ETH': 3000,
  'SOL': 100,
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
   * Get current market price for an asset (simulated with variation)
   */
  private getCurrentPrice(symbol: string): number {
    const basePrice = BASE_PRICES[symbol] || 100;
    return generatePriceVariation(basePrice, 0.015);
  }

  /**
   * Get 24h change for an asset (simulated)
   */
  private get24hChange(symbol: string): { change24h: number; changePercentage: number } {
    const currentPrice = BASE_PRICES[symbol] || 100;
    const changePercentage = (Math.random() - 0.5) * 10; // -5% to +5%
    const change24h = currentPrice * (changePercentage / 100);
    return { change24h, changePercentage };
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
            currentPrice: 45000,
            change24h: 1200,
            changePercentage: 2.74,
          },
          quantity: 0.5,
          averageCost: 42000,
          currentValue: 22500,
          totalReturn: 1500,
          returnPercentage: 7.14,
        },
        {
          asset: {
            id: 'eth',
            symbol: 'ETH',
            name: 'Ethereum',
            type: 'crypto',
            currentPrice: 3000,
            change24h: -50,
            changePercentage: -1.64,
          },
          quantity: 2,
          averageCost: 2800,
          currentValue: 6000,
          totalReturn: 400,
          returnPercentage: 7.14,
        },
      ];
    }

    // Update holdings with current prices
    const mockHoldings: PortfolioHolding[] = portfolioStore[userId].map(holding => {
      const currentPrice = this.getCurrentPrice(holding.asset.symbol);
      const { change24h, changePercentage } = this.get24hChange(holding.asset.symbol);
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
    });

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

    return assetDefinitions.map(asset => {
      const currentPrice = this.getCurrentPrice(asset.symbol);
      const { change24h, changePercentage } = this.get24hChange(asset.symbol);
      return {
        ...asset,
        currentPrice,
        change24h,
        changePercentage,
      };
    });
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
