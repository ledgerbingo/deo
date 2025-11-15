/**
 * Exchange Module Types
 * 
 * Defines types for currency exchange operations.
 * Focused on Circle StableFX supported stablecoins.
 */

// Circle StableFX supported stablecoins
export type Currency = 
  | 'USDC'  // US Dollar - Circle
  | 'EURC'  // Euro - Circle
  | 'AUDF'  // Australian Dollar - Forte
  | 'BRLA'  // Brazilian Real - Avenia
  | 'JPYC'  // Japanese Yen - JPYC Inc.
  | 'KRW1'  // South Korean Won - BDACS
  | 'MXNB'  // Mexican Peso - Bitso
  | 'PHPC'  // Philippine Peso - Coins.PH
  | 'QCAD'  // Canadian Dollar - Stablecorp
  | 'ZARU'; // South African Rand - ZAR Universal Network

export interface StablecoinInfo {
  symbol: Currency;
  name: string;
  issuer: string;
  country: string;
  countryCode: string;
  fiatCurrency: string;
  fiatSymbol: string;
  icon?: string;
}

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
