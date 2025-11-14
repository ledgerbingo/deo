/**
 * Exchange Module Types
 * 
 * Defines types for currency exchange operations.
 */

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'USDC' | 'BTC' | 'ETH';

export interface ExchangeRate {
  from: Currency;
  to: Currency;
  rate: number;
  lastUpdated: Date;
}

export interface ExchangeRequest {
  userId: string;
  fromCurrency: Currency;
  toCurrency: Currency;
  amount: number;
}

export interface Exchange {
  id: string;
  userId: string;
  fromCurrency: Currency;
  toCurrency: Currency;
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}

export interface CurrencyPair {
  from: Currency;
  to: Currency;
  rate: number;
  available: boolean;
}
