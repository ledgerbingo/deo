/**
 * Investment Module Types
 * 
 * Defines types for investment portfolios and trading operations.
 */

export type AssetType = 'crypto' | 'stock' | 'bond' | 'etf';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  currentPrice: number;
  change24h: number;
  changePercentage: number;
}

export interface PortfolioHolding {
  asset: Asset;
  quantity: number;
  averageCost: number;
  currentValue: number;
  totalReturn: number;
  returnPercentage: number;
}

export interface Portfolio {
  userId: string;
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  returnPercentage: number;
  holdings: PortfolioHolding[];
  lastUpdated: Date;
}

export interface TradeRequest {
  userId: string;
  assetSymbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price?: number; // Optional for market orders
}

export interface Trade {
  id: string;
  userId: string;
  assetSymbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}
