import { ethers } from 'ethers'

const ARC_TESTNET_RPC = process.env.NEXT_PUBLIC_ARC_TESTNET_RPC || 'https://rpc.testnet.arc.network'
const USDC_CONTRACT_ADDRESS = '0x3600000000000000000000000000000000000000'

// ERC20 Transfer event signature
const TRANSFER_EVENT_SIGNATURE = 'Transfer(address,address,uint256)'
const TRANSFER_EVENT_TOPIC = ethers.id(TRANSFER_EVENT_SIGNATURE)

export interface TransactionDetail {
  hash: string
  from: string
  to: string
  value: string
  timestamp: number
  blockNumber: number
  status: 'success' | 'failed' | 'pending'
  type: 'send' | 'receive' | 'deposit' | 'withdrawal'
  amount: string
  currency: string
  gasUsed?: string
  gasPrice?: string
  fee?: string
}

export class WalletService {
  private provider: ethers.JsonRpcProvider
  private timeout: number = 5000 // 5 second timeout

  constructor() {
    this.provider = new ethers.JsonRpcProvider(ARC_TESTNET_RPC, undefined, {
      staticNetwork: true,
    })
  }

  /**
   * Helper to add timeout to promises
   */
  private withTimeout<T>(promise: Promise<T>, ms: number = this.timeout): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('RPC request timeout')), ms)
      ),
    ])
  }

  /**
   * Create a new wallet
   */
  async createWallet() {
    const wallet = ethers.Wallet.createRandom()
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase,
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(address: string) {
    try {
      const balance = await this.withTimeout(this.provider.getBalance(address))
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('Error getting balance:', error)
      throw error
    }
  }

  /**
   * Get USDC balance
   */
  async getUSDCBalance(address: string) {
    try {
      const usdcAbi = [
        'function balanceOf(address account) view returns (uint256)',
        'function decimals() view returns (uint8)',
      ]
      const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, usdcAbi, this.provider)
      const balance = await this.withTimeout(usdcContract.balanceOf(address))
      const decimals = await this.withTimeout(usdcContract.decimals())
      return ethers.formatUnits(balance, decimals)
    } catch (error) {
      console.error('Error getting USDC balance:', error)
      throw error
    }
  }

  /**
   * Get wallet information including balances and transaction count
   */
  async getWalletInfo(address: string) {
    try {
      const [nativeBalance, usdcBalance, transactionCount] = await Promise.all([
        this.getBalance(address),
        this.getUSDCBalance(address),
        this.withTimeout(this.provider.getTransactionCount(address))
      ])

      return {
        address,
        nativeBalance,
        usdcBalance,
        transactionCount,
      }
    } catch (error) {
      console.error('Error getting wallet info:', error)
      throw error
    }
  }

  /**
   * Get transaction history for a wallet address
   */
  async getTransactionHistory(address: string, limit: number = 20): Promise<TransactionDetail[]> {
    try {
      const usdcAbi = [
        'event Transfer(address indexed from, address indexed to, uint256 value)',
        'function decimals() view returns (uint8)',
      ]
      const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, usdcAbi, this.provider)
      
      // Get current block number
      const currentBlock = await this.provider.getBlockNumber()
      const fromBlock = Math.max(0, currentBlock - 10000) // Last ~10000 blocks

      // Get decimals
      const decimals = await usdcContract.decimals()

      // Get transfer events where address is sender or receiver
      const sentFilter = usdcContract.filters.Transfer(address, null)
      const receivedFilter = usdcContract.filters.Transfer(null, address)

      const [sentEvents, receivedEvents] = await Promise.all([
        usdcContract.queryFilter(sentFilter, fromBlock, currentBlock),
        usdcContract.queryFilter(receivedFilter, fromBlock, currentBlock)
      ])

      // Combine and sort events
      const allEvents = [...sentEvents, ...receivedEvents]
        .sort((a, b) => {
          if (b.blockNumber !== a.blockNumber) {
            return b.blockNumber - a.blockNumber
          }
          return b.index - a.index
        })
        .slice(0, limit)

      // Process events into transaction details
      const transactions: TransactionDetail[] = []
      
      for (const event of allEvents) {
        try {
          const block = await this.provider.getBlock(event.blockNumber)
          const receipt = await this.provider.getTransactionReceipt(event.transactionHash)
          
          if (!receipt || !block) continue

          // Parse event args - Transfer event has (from, to, value)
          const log = receipt.logs.find(l => l.index === event.index)
          if (!log) continue

          const parsedLog = usdcContract.interface.parseLog({
            topics: [...log.topics],
            data: log.data
          })

          if (!parsedLog) continue

          const from = parsedLog.args[0] as string
          const to = parsedLog.args[1] as string
          const value = parsedLog.args[2] as bigint

          const isSent = from.toLowerCase() === address.toLowerCase()
          const amount = ethers.formatUnits(value, decimals)
          
          const gasUsed = receipt.gasUsed.toString()
          const gasPrice = receipt.gasPrice ? receipt.gasPrice.toString() : '0'
          const fee = ethers.formatEther(receipt.gasUsed * (receipt.gasPrice || 0n))

          transactions.push({
            hash: event.transactionHash,
            from,
            to,
            value: value.toString(),
            timestamp: block.timestamp,
            blockNumber: event.blockNumber,
            status: receipt.status === 1 ? 'success' : 'failed',
            type: isSent ? 'send' : 'receive',
            amount,
            currency: 'USDC',
            gasUsed,
            gasPrice,
            fee,
          })
        } catch (err) {
          console.error('Error processing event:', err)
          continue
        }
      }

      return transactions
    } catch (error) {
      console.error('Error getting transaction history:', error)
      // Return empty array instead of throwing to allow graceful degradation
      return []
    }
  }

  /**
   * Get transaction receipt details
   */
  async getTransactionReceipt(txHash: string) {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash)
      const transaction = await this.provider.getTransaction(txHash)
      
      if (!receipt || !transaction) {
        throw new Error('Transaction not found')
      }

      const block = await this.provider.getBlock(receipt.blockNumber)
      
      return {
        hash: receipt.hash,
        from: receipt.from,
        to: receipt.to,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        timestamp: block?.timestamp || 0,
        status: receipt.status === 1 ? 'success' : 'failed',
        gasUsed: receipt.gasUsed.toString(),
        gasPrice: transaction.gasPrice?.toString() || '0',
        value: transaction.value.toString(),
        data: transaction.data,
      }
    } catch (error) {
      console.error('Error getting transaction receipt:', error)
      throw error
    }
  }

  /**
   * Transfer USDC
   */
  async transferUSDC(from: string, to: string, amount: string, privateKey: string) {
    try {
      const wallet = new ethers.Wallet(privateKey, this.provider)
      const usdcAbi = [
        'function transfer(address to, uint256 amount) returns (bool)',
        'function decimals() view returns (uint8)',
      ]
      const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, usdcAbi, wallet)
      const decimals = await usdcContract.decimals()
      const amountInWei = ethers.parseUnits(amount, decimals)
      const tx = await usdcContract.transfer(to, amountInWei)
      const receipt = await tx.wait()
      return {
        hash: receipt.hash,
        status: receipt.status === 1 ? 'success' : 'failed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      }
    } catch (error) {
      console.error('Error transferring USDC:', error)
      throw error
    }
  }
}

export const walletService = new WalletService()
