/**
 * Account Service
 * 
 * Provides wallet management and transaction functionality.
 */

import { Wallet, Transaction, TransactionRequest, TransactionHistory, BalanceInfo } from './types';

export class AccountService {
  /**
   * Create a new USDC wallet
   * 
   * @param userId - User identifier
   * @returns Promise resolving to new wallet
   */
  async createWallet(userId: string): Promise<Wallet> {
    try {
      const response = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create wallet');
      }

      return {
        address: data.wallet.address,
        balance: 0,
        currency: 'USDC',
        createdAt: new Date(),
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  }

  /**
   * Get wallet information
   * 
   * @param address - Wallet address
   * @returns Promise resolving to wallet details
   */
  async getWallet(address: string): Promise<Wallet | null> {
    try {
      const response = await fetch(`/api/wallet/create?address=${address}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get wallet');
      }

      return {
        address: data.wallet.address,
        balance: parseFloat(data.wallet.usdcBalance) || 0,
        currency: 'USDC',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Estimate
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Error fetching wallet:', error);
      throw error;
    }
  }

  /**
   * Get wallet balance
   * 
   * @param address - Wallet address
   * @returns Promise resolving to balance information
   */
  async getBalance(address: string): Promise<BalanceInfo> {
    try {
      const response = await fetch(`/api/wallet/balance?address=${address}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get balance');
      }

      const balance = parseFloat(data.balance.formatted) || 0;
      return {
        address,
        balance,
        currency: data.balance.symbol || 'USDC',
        usdValue: balance, // USDC is 1:1 with USD
      };
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  /**
   * Send USDC transaction
   * 
   * @param request - Transaction request details
   * @returns Promise resolving to transaction result
   */
  async sendTransaction(request: TransactionRequest): Promise<Transaction> {
    try {
      const response = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: request.from,
          to: request.to,
          amount: request.amount,
          privateKey: request.privateKey,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to send transaction');
      }

      const tx = data.transaction;
      return {
        id: tx.hash,
        type: 'send',
        amount: parseFloat(tx.amount),
        currency: request.currency || 'USDC',
        from: tx.from,
        to: tx.to,
        status: tx.status === 'success' ? 'completed' : 'failed',
        timestamp: new Date(),
        txHash: tx.hash,
        fee: 0.01, // Actual fee would be calculated from gas
      };
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  /**
   * Get transaction history
   * 
   * @param address - Wallet address
   * @param page - Page number for pagination
   * @param pageSize - Number of transactions per page
   * @returns Promise resolving to transaction history
   */
  async getTransactionHistory(
    address: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<TransactionHistory> {
    try {
      const response = await fetch(
        `/api/wallet/transactions?address=${address}&limit=${pageSize}`
      );
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get transaction history');
      }

      const transactions: Transaction[] = (data.transactions || []).map((tx: any) => ({
        id: tx.hash,
        type: tx.type,
        amount: parseFloat(tx.amount),
        currency: tx.currency || 'USDC',
        from: tx.from,
        to: tx.to,
        status: tx.status,
        timestamp: new Date(tx.timestamp * 1000),
        txHash: tx.hash,
        fee: tx.fee ? parseFloat(tx.fee) : undefined,
      }));

      return {
        wallet: address,
        transactions,
        totalCount: data.count || transactions.length,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      // Return empty array on error for graceful degradation
      return {
        wallet: address,
        transactions: [],
        totalCount: 0,
        page,
        pageSize,
      };
    }
  }

  /**
   * Get transaction by ID
   * 
   * @param txId - Transaction identifier
   * @returns Promise resolving to transaction details
   */
  async getTransaction(txId: string): Promise<Transaction | null> {
    try {
      const response = await fetch(`/api/wallet/receipt?hash=${txId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get transaction');
      }

      const receipt = data.receipt;
      return {
        id: receipt.hash,
        type: 'send', // Would need additional logic to determine type
        amount: parseFloat(receipt.value) || 0,
        currency: 'USDC',
        from: receipt.from,
        to: receipt.to || '',
        status: receipt.status === 'success' ? 'completed' : 'failed',
        timestamp: new Date(receipt.timestamp * 1000),
        txHash: receipt.hash,
        fee: parseFloat(receipt.gasUsed) * parseFloat(receipt.gasPrice) / 1e18,
      };
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }
  }
}

export const accountService = new AccountService();
