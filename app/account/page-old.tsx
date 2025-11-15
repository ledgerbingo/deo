'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Wallet, Send, ArrowDownLeft, ArrowUpRight, Copy, ExternalLink, DollarSign, Clock, CheckCircle, XCircle, Filter } from 'lucide-react'
import { Button, Badge, Modal, Input } from '@/components/ui'
import { accountService } from '@/modules/account/service'
import type { Transaction, BalanceInfo } from '@/modules/account/types'

export default function AccountPage() {
  const [balance, setBalance] = useState<BalanceInfo | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [sendAmount, setSendAmount] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'send' | 'receive'>('all')

  const walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8'

  useEffect(() => {
    loadAccountData()
  }, [])

  const loadAccountData = async () => {
    setIsLoading(true)
    try {
      const balanceData = await accountService.getBalance(walletAddress)
      const history = await accountService.getTransactionHistory(walletAddress, 1, 20)
      
      setBalance(balanceData)
      setTransactions(history.transactions)
    } catch (error) {
      console.error('Error loading account data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendTransaction = async () => {
    if (!sendAmount || !recipientAddress) return
    
    try {
      const tx = await accountService.sendTransaction({
        from: walletAddress,
        to: recipientAddress,
        amount: parseFloat(sendAmount),
        currency: 'USDC'
      })
      
      setTransactions([tx, ...transactions])
      setShowSendModal(false)
      setSendAmount('')
      setRecipientAddress('')
      loadAccountData()
    } catch (error) {
      console.error('Error sending transaction:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const filteredTransactions = transactions.filter(tx => 
    filterType === 'all' || tx.type === filterType
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">DEO Finance</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/card" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Cards
              </Link>
              <Link href="/investment" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Invest
              </Link>
              <Link href="/settings" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Settings
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account</h1>
          <p className="text-gray-600 mt-2">Manage your USDC wallet and transactions on Circle ARC blockchain</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-xl shadow-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-blue-200 text-sm mb-1">Total Balance</p>
                <h2 className="text-5xl font-bold">${balance?.balance.toFixed(2) || '0.00'}</h2>
                <p className="text-blue-200 text-sm mt-1 flex items-center gap-2">
                  USDC
                  <Badge variant="info" size="sm" className="bg-white/20 text-white border-0">Stablecoin</Badge>
                </p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Wallet className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-blue-200 text-sm mb-2">Wallet Address</p>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                <p className="font-mono text-sm flex-1">
                  {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                </p>
                <button 
                  onClick={() => copyToClipboard(walletAddress)}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <a 
                  href={`https://arc-testnet-explorer.circle.com/address/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => setShowSendModal(true)}
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
              >
                <Send className="h-5 w-5 mr-2" />
                Send
              </Button>
              <Button
                onClick={() => setShowReceiveModal(true)}
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
              >
                <ArrowDownLeft className="h-5 w-5 mr-2" />
                Receive
              </Button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Transaction History</h3>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="all">All Transactions</option>
                <option value="send">Sent</option>
                <option value="receive">Received</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-2">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition-colors">
                  <div className="flex items-center flex-1">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      tx.type === 'receive' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {tx.type === 'receive' ? (
                        <ArrowDownLeft className="h-6 w-6 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {tx.type === 'receive' ? 'Received' : 'Sent'}
                        </p>
                        {getStatusIcon(tx.status)}
                      </div>
                      <p className="text-sm text-gray-500 font-mono">
                        {tx.type === 'receive' && tx.from ? `From: ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}` : ''}
                        {tx.type === 'send' && tx.to ? `To: ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : ''}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-lg ${
                      tx.type === 'receive' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {tx.type === 'receive' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">{tx.currency}</p>
                    {tx.fee && (
                      <p className="text-xs text-gray-400">Fee: ${tx.fee.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-2">Circle ARC Blockchain</h4>
            <p className="text-sm text-gray-600">
              All transactions are processed on Circle's ARC testnet for fast, secure, and low-cost transfers.
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-2">USDC Stablecoin</h4>
            <p className="text-sm text-gray-600">
              Your balance is in USDC, a stablecoin backed 1:1 by US dollar reserves, ensuring stable value.
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-2">Account Abstraction</h4>
            <p className="text-sm text-gray-600">
              Enjoy gas-less transactions and enhanced security with smart contract wallet features.
            </p>
          </div>
        </div>
      </main>

      {/* Send Modal */}
      <Modal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        title="Send USDC"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Address
            </label>
            <Input
              type="text"
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (USDC)
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
            />
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Available Balance:</span>
              <span className="font-semibold">${balance?.balance.toFixed(2) || '0.00'} USDC</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Network Fee:</span>
              <span className="font-semibold">$0.01 USDC</span>
            </div>
          </div>
          <Button
            onClick={handleSendTransaction}
            variant="primary"
            fullWidth
            disabled={!sendAmount || !recipientAddress}
          >
            Send Transaction
          </Button>
        </div>
      </Modal>

      {/* Receive Modal */}
      <Modal
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
        title="Receive USDC"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Share your wallet address to receive USDC from others.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-2">Your Wallet Address</p>
            <p className="font-mono text-sm break-all mb-4">{walletAddress}</p>
            <Button
              onClick={() => copyToClipboard(walletAddress)}
              variant="secondary"
              fullWidth
            >
              <Copy className="h-5 w-5 mr-2" />
              Copy Address
            </Button>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              ℹ️ Only send USDC on Circle ARC testnet to this address. Sending other tokens may result in loss of funds.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
