/**
 * Investment Service
 * 
 * Manages investment portfolios and trading operations.
 */

import { Portfolio, Asset, TradeRequest, Trade, PortfolioHolding } from './types';

export class InvestmentService {
  /**
   * Get user's investment portfolio
   * 
   * @param userId - User identifier
   * @returns Promise resolving to portfolio details
   */
  async getPortfolio(userId: string): Promise<Portfolio> {
    console.log(`Fetching portfolio for user: ${userId}`);
    
    const mockHoldings: PortfolioHolding[] = [
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
    
    return [
      {
        id: 'btc',
        symbol: 'BTC',
        name: 'Bitcoin',
        type: 'crypto',
        currentPrice: 45000,
        change24h: 1200,
        changePercentage: 2.74,
      },
      {
        id: 'eth',
        symbol: 'ETH',
        name: 'Ethereum',
        type: 'crypto',
        currentPrice: 3000,
        change24h: -50,
        changePercentage: -1.64,
      },
      {
        id: 'sol',
        symbol: 'SOL',
        name: 'Solana',
        type: 'crypto',
        currentPrice: 100,
        change24h: 5,
        changePercentage: 5.26,
      },
    ];
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

    const trade: Trade = {
      id: `trade_${Date.now()}`,
      userId: request.userId,
      assetSymbol: request.assetSymbol,
      type: request.type,
      quantity: request.quantity,
      price,
      total: price * request.quantity,
      status: 'pending',
      timestamp: new Date(),
    };

    // Simulate trade execution
    setTimeout(() => {
      trade.status = 'completed';
    }, 2000);

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
