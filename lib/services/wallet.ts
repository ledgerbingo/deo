import { ethers } from 'ethers'

const ARC_TESTNET_RPC = process.env.NEXT_PUBLIC_ARC_TESTNET_RPC || 'https://arc-testnet-rpc.circle.com'
const USDC_CONTRACT_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'

export class WalletService {
  private provider: ethers.JsonRpcProvider

  constructor() {
    this.provider = new ethers.JsonRpcProvider(ARC_TESTNET_RPC)
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
      const balance = await this.provider.getBalance(address)
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
      const balance = await usdcContract.balanceOf(address)
      const decimals = await usdcContract.decimals()
      return ethers.formatUnits(balance, decimals)
    } catch (error) {
      console.error('Error getting USDC balance:', error)
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
      }
    } catch (error) {
      console.error('Error transferring USDC:', error)
      throw error
    }
  }
}

export const walletService = new WalletService()
