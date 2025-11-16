'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Wallet, Send, ArrowDownLeft, ArrowUpRight, Copy, ExternalLink, DollarSign, Clock, CheckCircle, XCircle, Filter, RefreshCw, Plus, Edit2, Trash2 } from 'lucide-react'
import { Button, Badge, Modal, Input, Navigation } from '@/components/ui'
import { useWallet } from '@/lib/context/WalletContext'
import CircleWalletSection from '@/components/wallet/CircleWalletSection'

interface WalletInfo {
  address: string
  nativeBalance: string
  usdcBalance: string
  transactionCount: number
}

interface Transaction {
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

interface TransactionReceipt {
  hash: string
  from: string
  to: string | null
  blockNumber: number
  blockHash: string
  timestamp: number
  status: string
  gasUsed: string
  gasPrice: string
  value: string
  data: string
}

export default function AccountPage() {
  const { activeWallet, wallets, createWallet, updateWallet, setActiveWallet } = useWallet()
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [txReceipt, setTxReceipt] = useState<TransactionReceipt | null>(null)
  const [sendAmount, setSendAmount] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'send' | 'receive'>('all')
  const [error, setError] = useState<string | null>(null)
  const [editingWalletName, setEditingWalletName] = useState('')
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [txStatus, setTxStatus] = useState<'pending' | 'success' | 'failed' | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [txError, setTxError] = useState<string | null>(null)

  const walletAddress = activeWallet?.address || ''

  useEffect(() => {
    if (walletAddress) {
      loadWalletData()
    }
  }, [walletAddress])

  const loadWalletData = async () => {
    if (!walletAddress) return
    
    setIsLoading(true)
    setError(null)
    try {
      // Fetch wallet info
      const walletResponse = await fetch(`/api/wallet/create?address=${walletAddress}`)
      const walletData = await walletResponse.json()
      
      if (walletData.success) {
        setWalletInfo(walletData.wallet)
        
        // Show demo mode notification if applicable
        if (walletData.isDemoMode) {
          console.info('Demo mode:', walletData.message)
        }
      } else {
        throw new Error(walletData.error || 'Failed to load wallet')
      }

      // Fetch transaction history
      const txResponse = await fetch(`/api/wallet/transactions?address=${walletAddress}&limit=50`)
      const txData = await txResponse.json()
      
      if (txData.success) {
        setTransactions(txData.transactions || [])
      }
    } catch (error) {
      console.error('Error loading wallet data:', error)
      setError(error instanceof Error ? error.message : 'Failed to load wallet data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadWalletData()
    setIsRefreshing(false)
  }

  const handleViewReceipt = async (tx: Transaction) => {
    setSelectedTx(tx)
    setShowReceiptModal(true)
    
    try {
      const response = await fetch(`/api/wallet/receipt?hash=${tx.hash}`)
      const data = await response.json()
      
      if (data.success) {
        setTxReceipt(data.receipt)
      }
    } catch (error) {
      console.error('Error loading receipt:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
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

  const handleCreateNewWallet = async () => {
    if (wallets.length >= 5) {
      alert('Maximum of 5 wallets reached')
      return
    }
    
    setIsCreatingWallet(true)
    try {
      await createWallet()
      setShowManageModal(false)
    } catch (error) {
      alert('Failed to create wallet')
    } finally {
      setIsCreatingWallet(false)
    }
  }

  const handleEditWallet = () => {
    if (activeWallet && editingWalletName.trim()) {
      updateWallet(activeWallet.id, { name: editingWalletName.trim() })
      setShowEditModal(false)
      setEditingWalletName('')
    }
  }

  const handleSwitchWallet = (walletId: string) => {
    setActiveWallet(walletId)
    setShowManageModal(false)
  }

  const handleSendClick = () => {
    // Reset form
    setRecipientAddress('')
    setSendAmount('')
    setError(null)
    setShowSendModal(true)
  }

  const validateSendForm = (): boolean => {
    if (!recipientAddress || !recipientAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError('Please enter a valid Ethereum address')
      return false
    }
    
    const amount = parseFloat(sendAmount)
    if (!sendAmount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than 0')
      return false
    }
    
    const balance = parseFloat(walletInfo?.usdcBalance || '0')
    if (amount > balance) {
      setError(`Insufficient balance. You have ${balance.toFixed(2)} USDC`)
      return false
    }
    
    if (!activeWallet?.mnemonic && !activeWallet?.privateKey) {
      setError('No private key or mnemonic found for this wallet')
      return false
    }
    
    return true
  }

  const handleConfirmSend = () => {
    setError(null)
    
    if (!validateSendForm()) {
      return
    }
    
    setShowSendModal(false)
    setShowConfirmModal(true)
  }

  const handleExecuteSend = async () => {
    if (!activeWallet) return
    
    setIsSending(true)
    setTxStatus('pending')
    setTxHash(null)
    setTxError(null)
    setShowConfirmModal(false)
    setShowStatusModal(true)
    
    try {
      // Derive private key from mnemonic if needed
      let privateKey = activeWallet.privateKey
      
      if (!privateKey && activeWallet.mnemonic) {
        // Import ethers to derive private key from mnemonic
        const { ethers } = await import('ethers')
        const wallet = ethers.Wallet.fromPhrase(activeWallet.mnemonic)
        privateKey = wallet.privateKey
      }
      
      if (!privateKey) {
        throw new Error('No private key available')
      }
      
      const response = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: activeWallet.address,
          to: recipientAddress,
          amount: sendAmount,
          privateKey: privateKey,
        }),
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Transfer failed')
      }
      
      setTxHash(data.transaction.hash)
      setTxStatus('success')
      
      // Refresh wallet data after successful transfer
      setTimeout(() => {
        loadWalletData()
      }, 2000)
    } catch (err) {
      console.error('Transfer error:', err)
      setTxError(err instanceof Error ? err.message : 'Transfer failed')
      setTxStatus('failed')
    } finally {
      setIsSending(false)
    }
  }

  const handleCloseSendModal = () => {
    setShowSendModal(false)
    setRecipientAddress('')
    setSendAmount('')
    setError(null)
  }

  const handleCloseStatusModal = () => {
    setShowStatusModal(false)
    setTxStatus(null)
    setTxHash(null)
    setTxError(null)
    setRecipientAddress('')
    setSendAmount('')
  }

  // Show create wallet prompt if no wallet
  if (!activeWallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-6">
                <Wallet className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Your Wallet</h2>
              <p className="text-gray-600 mb-8">
                Get started by creating your first smart wallet. You can create up to 5 wallets.
              </p>
              <Button
                onClick={handleCreateNewWallet}
                disabled={isCreatingWallet}
                variant="primary"
                fullWidth
                className="bg-purple-600 hover:bg-purple-700 py-4 text-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                {isCreatingWallet ? 'Creating...' : 'Create Wallet'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ARC Smart Wallet</h1>
            <p className="text-gray-600 mt-2">Manage your USDC wallet on Circle ARC blockchain</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowManageModal(true)}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Wallet className="h-4 w-4" />
              Manage Wallets ({wallets.length}/5)
            </Button>
            <Button
              onClick={handleRefresh}
              variant="secondary"
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Balance Card */}
        <div className={`bg-gradient-to-br ${activeWallet?.color || 'from-blue-600 to-purple-700'} rounded-xl shadow-2xl p-8 text-white mb-8 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-white/70 text-sm mb-1">{activeWallet?.name}</p>
                <p className="text-white/70 text-sm mb-1">USDC Balance</p>
                {isLoading ? (
                  <div className="h-12 w-48 bg-white/20 rounded animate-pulse"></div>
                ) : (
                  <>
                    <h2 className="text-5xl font-bold">${walletInfo?.usdcBalance || '0.00'}</h2>
                    <p className="text-white/70 text-sm mt-1 flex items-center gap-2">
                      USDC on ARC Testnet
                      <Badge variant="info" size="sm" className="bg-white/20 text-white border-0">Circle</Badge>
                    </p>
                  </>
                )}
              </div>
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Wallet className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-white/70 text-sm mb-2">Wallet Address</p>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                <p className="font-mono text-sm flex-1">
                  {walletAddress}
                </p>
                <button 
                  onClick={() => copyToClipboard(walletAddress)}
                  className="text-white hover:text-white/70 transition-colors"
                  title="Copy address"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <a 
                  href={`https://testnet.arcscan.app/address/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/70 transition-colors"
                  title="View on explorer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {!isLoading && walletInfo && (
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-white/70 text-xs mb-1">Native Balance</p>
                  <p className="font-semibold">{parseFloat(walletInfo.nativeBalance).toFixed(4)} ETH</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-white/70 text-xs mb-1">Transactions</p>
                  <p className="font-semibold">{walletInfo.transactionCount}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleSendClick}
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                disabled={isLoading}
              >
                <Send className="h-5 w-5 mr-2" />
                Send / Withdraw
              </Button>
              <Button
                onClick={() => setShowReceiveModal(true)}
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
              >
                <ArrowDownLeft className="h-5 w-5 mr-2" />
                Receive / Deposit
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
              <p className="text-gray-500 mt-2">Loading transactions from blockchain...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {filteredTransactions.map((tx) => (
                <div 
                  key={tx.hash} 
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  onClick={() => handleViewReceipt(tx)}
                >
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
                        {tx.type === 'receive' ? `From: ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}` : `To: ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(tx.timestamp * 1000).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-lg ${
                      tx.type === 'receive' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {tx.type === 'receive' ? '+' : '-'}{tx.amount}
                    </p>
                    <p className="text-sm text-gray-500">{tx.currency}</p>
                    {tx.fee && parseFloat(tx.fee) > 0 && (
                      <p className="text-xs text-gray-400">Fee: {parseFloat(tx.fee).toFixed(6)} ETH</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found</p>
              <p className="text-sm text-gray-400 mt-2">Transactions will appear here when you send or receive USDC</p>
            </div>
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
            <h4 className="font-semibold text-gray-900 mb-2">Smart Wallet Features</h4>
            <p className="text-sm text-gray-600">
              Enjoy enhanced security, transaction batching, and seamless blockchain interactions.
            </p>
          </div>
        </div>

        {/* Circle Wallet Section - Added separately below existing wallet */}
        <CircleWalletSection />
      </main>

      {/* Receive Modal */}
      <Modal
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
        title="Receive / Deposit USDC"
      >
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Share your wallet address to receive USDC on the ARC testnet
            </p>
            
            {/* QR Code Placeholder */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 mb-4">
              <div className="bg-white p-6 rounded-lg shadow-inner inline-block">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">QR Code</p>
                    <p className="text-xs text-gray-400">Coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Wallet Address
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
              <p className="font-mono text-sm break-all text-gray-900">{walletAddress}</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              <strong>⚠️ Important:</strong> Only send USDC on the Circle ARC testnet to this address. Sending tokens on other networks may result in permanent loss.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => copyToClipboard(walletAddress)}
              variant="primary"
              fullWidth
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Address
            </Button>
            <Button
              onClick={() => window.open(`https://testnet.arcscan.app/address/${walletAddress}`, '_blank')}
              variant="secondary"
              fullWidth
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Send Modal */}
      <Modal
        isOpen={showSendModal}
        onClose={handleCloseSendModal}
        title="Send / Withdraw USDC"
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
              onChange={(e) => {
                setRecipientAddress(e.target.value)
                setError(null)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (USDC)
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={sendAmount}
                onChange={(e) => {
                  setSendAmount(e.target.value)
                  setError(null)
                }}
              />
              {walletInfo && (
                <div className="mt-1 text-sm text-gray-500">
                  Available: {parseFloat(walletInfo.usdcBalance).toFixed(2)} USDC
                </div>
              )}
            </div>
            
            {/* Quick Amount Buttons */}
            {walletInfo && parseFloat(walletInfo.usdcBalance) > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Quick amounts:</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '10', value: '10' },
                    { label: '50', value: '50' },
                    { label: '100', value: '100' },
                    { label: 'Max', value: walletInfo.usdcBalance }
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={() => {
                        const val = parseFloat(btn.value)
                        const balance = parseFloat(walletInfo.usdcBalance)
                        if (val <= balance) {
                          setSendAmount(btn.value)
                          setError(null)
                        } else {
                          setSendAmount(balance.toFixed(2))
                          setError(null)
                        }
                      }}
                      className="px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      {btn.label === 'Max' ? 'Max' : `$${btn.label}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Transactions are sent using the private key stored in your browser. Make sure you trust this device.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleCloseSendModal}
              variant="secondary"
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSend}
              variant="primary"
              fullWidth
              disabled={!recipientAddress || !sendAmount}
            >
              Review Transaction
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Transaction"
      >
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gray-900">
                {sendAmount} USDC
              </div>
              <p className="text-sm text-gray-600 mt-1">Will be sent to</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-500 uppercase mb-1">Recipient</p>
              <p className="font-mono text-sm break-all">{recipientAddress}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase mb-1">From</p>
              <p className="font-mono text-sm break-all">{walletAddress}</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              <strong>⚠️ Warning:</strong> This transaction cannot be reversed. Please verify the recipient address before proceeding.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setShowConfirmModal(false)}
              variant="secondary"
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={handleExecuteSend}
              variant="primary"
              fullWidth
              className="bg-purple-600 hover:bg-purple-700"
            >
              Confirm & Send
            </Button>
          </div>
        </div>
      </Modal>

      {/* Transaction Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={txStatus === 'pending' ? undefined : handleCloseStatusModal}
        dismissable={txStatus !== 'pending'}
        title={
          txStatus === 'pending' ? 'Processing Transaction' :
          txStatus === 'success' ? 'Transaction Successful' :
          'Transaction Failed'
        }
      >
        <div className="space-y-4">
          {txStatus === 'pending' && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
              <p className="text-gray-700 font-medium">Sending transaction...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait while we process your transfer</p>
            </div>
          )}
          
          {txStatus === 'success' && txHash && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">Transfer Complete!</p>
              <p className="text-gray-600 mb-4">
                {sendAmount} USDC has been sent successfully
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-500 uppercase mb-2">Transaction Hash</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm break-all flex-1">{txHash}</p>
                  <button
                    onClick={() => copyToClipboard(txHash)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(`https://testnet.arcscan.app/tx/${txHash}`, '_blank')}
                  variant="secondary"
                  fullWidth
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
                <Button
                  onClick={handleCloseStatusModal}
                  variant="primary"
                  fullWidth
                >
                  Done
                </Button>
              </div>
            </div>
          )}
          
          {txStatus === 'failed' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">Transaction Failed</p>
              <p className="text-gray-600 mb-4">
                {txError || 'An error occurred while processing your transfer'}
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 text-sm">
                  {txError || 'Please check your balance and try again'}
                </p>
              </div>
              
              <Button
                onClick={handleCloseStatusModal}
                variant="primary"
                fullWidth
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Transaction Receipt Modal */}
      <Modal
        isOpen={showReceiptModal}
        onClose={() => {
          setShowReceiptModal(false)
          setSelectedTx(null)
          setTxReceipt(null)
        }}
        title="Transaction Receipt"
      >
        {selectedTx && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase">Transaction Hash</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono text-sm break-all flex-1">{selectedTx.hash}</p>
                  <button
                    onClick={() => copyToClipboard(selectedTx.hash)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedTx.status)}
                    <span className="capitalize font-medium">{selectedTx.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Block</p>
                  <p className="font-medium mt-1">#{selectedTx.blockNumber}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">From</p>
                <p className="font-mono text-sm mt-1 break-all">{selectedTx.from}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">To</p>
                <p className="font-mono text-sm mt-1 break-all">{selectedTx.to}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Amount</p>
                  <p className="font-semibold text-lg mt-1">{selectedTx.amount} {selectedTx.currency}</p>
                </div>
                {selectedTx.fee && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Gas Fee</p>
                    <p className="font-medium mt-1">{parseFloat(selectedTx.fee).toFixed(6)} ETH</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Timestamp</p>
                <p className="font-medium mt-1">{new Date(selectedTx.timestamp * 1000).toLocaleString()}</p>
              </div>
            </div>

            <Button
              onClick={() => window.open(`https://testnet.arcscan.app/tx/${selectedTx.hash}`, '_blank')}
              variant="primary"
              fullWidth
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on ARC Explorer
            </Button>
          </div>
        )}
      </Modal>

      {/* Wallet Management Modal */}
      <Modal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        title="Manage Wallets"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You can create up to 5 smart wallets. Switch between them or create a new one.
          </p>
          
          <div className="space-y-2">
            {wallets.map((wallet, index) => (
              <div
                key={wallet.id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  activeWallet?.id === wallet.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${wallet.color} flex items-center justify-center flex-shrink-0`}>
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{wallet.name}</p>
                      {activeWallet?.id === wallet.id && (
                        <Badge variant="success" size="sm">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 font-mono truncate">
                      {wallet.address}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingWalletName(wallet.name)
                      setShowManageModal(false)
                      setShowEditModal(true)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit wallet name"
                  >
                    <Edit2 className="h-4 w-4 text-gray-600" />
                  </button>
                  {activeWallet?.id !== wallet.id && (
                    <Button
                      onClick={() => handleSwitchWallet(wallet.id)}
                      variant="secondary"
                      size="sm"
                    >
                      Switch
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {wallets.length < 5 && (
            <Button
              onClick={handleCreateNewWallet}
              disabled={isCreatingWallet}
              variant="primary"
              fullWidth
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreatingWallet ? 'Creating...' : 'Create New Wallet'}
            </Button>
          )}
        </div>
      </Modal>

      {/* Edit Wallet Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingWalletName('')
        }}
        title="Edit Wallet Name"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wallet Name
            </label>
            <Input
              type="text"
              placeholder="My Wallet"
              value={editingWalletName}
              onChange={(e) => setEditingWalletName(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleEditWallet}
              variant="primary"
              fullWidth
              disabled={!editingWalletName.trim()}
            >
              Save Changes
            </Button>
            <Button
              onClick={() => {
                setShowEditModal(false)
                setEditingWalletName('')
                setShowManageModal(true)
              }}
              variant="secondary"
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
