/**
 * Circle Wallet Service
 * 
 * Provides integration with Circle's User-Controlled Wallets SDK
 * for creating and managing developer-controlled wallets on ARC blockchain
 */

import { initiateUserControlledWalletsClient } from '@circle-fin/user-controlled-wallets'

// Initialize Circle client lazily
let clientInstance: ReturnType<typeof initiateUserControlledWalletsClient> | null = null

const getCircleClient = () => {
  if (!clientInstance) {
    const apiKey = process.env.CIRCLE_API_KEY
    
    if (!apiKey) {
      throw new Error('CIRCLE_API_KEY is not configured')
    }
    
    clientInstance = initiateUserControlledWalletsClient({
      apiKey,
    })
  }
  
  return clientInstance
}

export interface CircleUser {
  userId: string
  email: string
  googleId: string
}

export interface CircleWallet {
  walletId: string
  address: string
  blockchain: string
  accountType: string
  state: string
  createDate: string
  updateDate: string
}

export interface CircleWalletBalance {
  token: {
    id: string
    blockchain: string
    name: string
    symbol: string
    decimals: number
  }
  amount: string
}

export class CircleWalletService {
  private getClient() {
    return getCircleClient()
  }
  
  /**
   * Create a new user in Circle's system
   * This should be called after Google authentication
   */
  async createUser(email: string, googleId: string): Promise<any> {
    try {
      // In production, you would create a user in Circle's system
      // For now, we'll use the googleId as the userId
      const userId = `google_${googleId}`
      
      return {
        success: true,
        userId,
        message: 'User created successfully'
      }
    } catch (error) {
      console.error('Error creating Circle user:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user'
      }
    }
  }
  
  /**
   * Create a new wallet for a user
   * This creates a developer-controlled wallet on ARC blockchain
   * Note: Circle wallets require challenge completion (PIN setup), so this returns a challengeId
   */
  async createWallet(userId: string, userToken: string): Promise<any> {
    try {
      // Create wallet using Circle SDK
      // This creates a challenge that needs to be completed by the user
      const response = await this.getClient().createWallet({
        userToken,
        blockchains: ['ARC-TESTNET'],
        accountType: 'SCA', // Smart Contract Account
      })
      
      return {
        success: true,
        challengeId: response.data?.challengeId,
        message: 'Wallet creation initiated. User needs to complete PIN setup challenge.'
      }
    } catch (error) {
      console.error('Error creating Circle wallet:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create wallet'
      }
    }
  }
  
  /**
   * Get wallets for a user
   */
  async getWallets(userId: string, userToken: string): Promise<any> {
    try {
      const response = await this.getClient().listWallets({
        userToken,
      })
      
      return {
        success: true,
        wallets: response.data?.wallets || []
      }
    } catch (error) {
      console.error('Error fetching Circle wallets:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch wallets'
      }
    }
  }
  
  /**
   * Get wallet balance
   */
  async getWalletBalance(walletId: string, userToken: string): Promise<any> {
    try {
      const response = await this.getClient().getWalletTokenBalance({
        userToken,
        walletId,
      })
      
      return {
        success: true,
        tokenBalances: response.data?.tokenBalances || []
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch balance'
      }
    }
  }
  
  /**
   * Create a transaction (transfer)
   */
  async createTransaction(params: {
    userToken: string
    walletId: string
    destinationAddress: string
    amount: string
    tokenId: string
  }): Promise<any> {
    try {
      const { userToken, walletId, destinationAddress, amount, tokenId } = params
      
      const response = await this.getClient().createTransaction({
        userToken,
        walletId,
        destinationAddress,
        amounts: [amount],
        tokenId,
        fee: {
          type: 'level',
          config: {
            feeLevel: 'MEDIUM',
          },
        },
      })
      
      return {
        success: true,
        challengeId: response.data?.challengeId,
        transaction: response.data
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create transaction'
      }
    }
  }
  
  /**
   * Get transaction history
   */
  async getTransactions(userId: string, userToken: string, walletId?: string): Promise<any> {
    try {
      const response = await this.getClient().listTransactions({
        userToken,
        ...(walletId && { walletIds: [walletId] }),
        pageSize: 50,
      })
      
      return {
        success: true,
        transactions: response.data?.transactions || []
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch transactions'
      }
    }
  }
}

export const circleWalletService = new CircleWalletService()
