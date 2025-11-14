/**
 * Account Module Types
 * 
 * Defines types for wallet operations and transactions.
 */

export interface Wallet {
  address: string;
  balance: number;
  currency: 'USDC';
  createdAt: Date;
  lastUpdated: Date;
}

export type TransactionType = 'send' | 'receive' | 'deposit' | 'withdrawal';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  from?: string;
  to?: string;
  status: TransactionStatus;
  timestamp: Date;
  txHash?: string;
  fee?: number;
  description?: string;
}

export interface TransactionRequest {
  from: string;
  to: string;
  amount: number;
  currency?: string;
}

export interface TransactionHistory {
  wallet: string;
  transactions: Transaction[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface BalanceInfo {
  address: string;
  balance: number;
  currency: string;
  usdValue: number;
}
