'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Wallet, Send, ArrowDownLeft, ArrowUpRight, Copy, ExternalLink, DollarSign, RefreshCw, Plus, LogIn } from 'lucide-react'
import { Button, Badge, Modal, Input } from '@/components/ui'

interface CircleWallet {
  walletId: string
  address: string
  blockchain: string
  accountType: string
  state: string
  createDate: string
  updateDate: string
}

interface CircleBalance {
  token: {
    id: string
    blockchain: string
    name: string
    symbol: string
    decimals: number
  }
  amount: string
}

interface CircleTransaction {
  id: string
  blockchain: string
  tokenId: string
  walletId: string
  sourceAddress: string
  destinationAddress: string
  transactionType: string
  state: string
  amounts: string[]
  createDate: string
  updateDate: string
}

export default function CircleWalletSection() {
  const { data: session, status } = useSession()
  const [wallet, setWallet] = useState<CircleWallet | null>(null)
  const [balance, setBalance] = useState<CircleBalance | null>(null)
  const [transactions, setTransactions] = useState<CircleTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  
  // For demo purposes, we'll use a mock user token
  // In production, this should be obtained from Circle's SDK after user authentication
  const mockUserToken = session?.user?.email ? `token_${session.user.email}` : null

  useEffect(() => {
    if (status === 'authenticated' && mockUserToken) {
      loadWalletData()
    }
  }, [status, mockUserToken])

  const loadWalletData = async () => {
    if (!mockUserToken) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch wallets
      const walletResponse = await fetch(`/api/circle/wallet/create?userToken=${mockUserToken}`)
      const walletData = await walletResponse.json()
      
      if (walletData.success && walletData.wallets.length > 0) {
        const firstWallet = walletData.wallets[0]
        setWallet(firstWallet)
        
        // Fetch balance
        const balanceResponse = await fetch(
          `/api/circle/wallet/balance?walletId=${firstWallet.walletId}&userToken=${mockUserToken}`
        )
        const balanceData = await balanceResponse.json()
        
        if (balanceData.success && balanceData.tokenBalances.length > 0) {
          setBalance(balanceData.tokenBalances[0])
        }
        
        // Fetch transactions
        const txResponse = await fetch(
          `/api/circle/wallet/transactions?userToken=${mockUserToken}&walletId=${firstWallet.walletId}`
        )
        const txData = await txResponse.json()
        
        if (txData.success) {
          setTransactions(txData.transactions || [])
        }
      }
    } catch (err) {
      console.error('Error loading Circle wallet data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load wallet data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateWallet = async () => {
    if (!mockUserToken) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/circle/wallet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userToken: mockUserToken,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        await loadWalletData()
      } else {
        setError(data.error || 'Failed to create wallet')
      }
    } catch (err) {
      console.error('Error creating Circle wallet:', err)
      setError(err instanceof Error ? err.message : 'Failed to create wallet')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadWalletData()
    setIsRefreshing(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  // Not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Circle Smart Wallet</h3>
          <p className="text-gray-600 mb-6">
            Sign in with Google to access your Circle developer-controlled wallet on ARC blockchain
          </p>
          <Button
            onClick={() => window.location.href = '/auth'}
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Sign in with Google
          </Button>
        </div>
      </div>
    )
  }

  // Loading authentication
  if (status === 'loading') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  // No wallet created yet
  if (!wallet && !isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Circle Smart Wallet</h3>
          <p className="text-gray-600 mb-6">
            Create your developer-controlled wallet on Circle's ARC blockchain
          </p>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          <Button
            onClick={handleCreateWallet}
            disabled={isLoading}
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            {isLoading ? 'Creating...' : 'Create Circle Wallet'}
          </Button>
          <p className="text-xs text-gray-500 mt-4">
            Signed in as: {session?.user?.email}
          </p>
        </div>
      </div>
    )
  }

  // Wallet exists
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Circle Smart Wallet</h2>
        <div className="flex gap-2">
          <Badge variant="info" size="sm" className="bg-blue-100 text-blue-800">Google Account</Badge>
          <Button
            onClick={handleRefresh}
            variant="secondary"
            size="sm"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Circle Wallet Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-2xl p-8 text-white mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-white/70 text-sm mb-1">Circle Wallet Balance</p>
              {isLoading ? (
                <div className="h-12 w-48 bg-white/20 rounded animate-pulse"></div>
              ) : (
                <>
                  <h3 className="text-5xl font-bold">
                    ${balance ? parseFloat(balance.amount).toFixed(2) : '0.00'}
                  </h3>
                  <p className="text-white/70 text-sm mt-1 flex items-center gap-2">
                    {balance?.token.symbol || 'USDC'} on ARC
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
              <p className="font-mono text-sm flex-1 truncate">
                {wallet?.address || 'Loading...'}
              </p>
              {wallet?.address && (
                <>
                  <button 
                    onClick={() => copyToClipboard(wallet.address)}
                    className="text-white hover:text-white/70 transition-colors"
                    title="Copy address"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <a 
                    href={`https://testnet.arcscan.app/address/${wallet.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/70 transition-colors"
                    title="View on explorer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-white/70 text-xs mb-1">Account Type</p>
              <p className="font-semibold">{wallet?.accountType || 'SCA'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-white/70 text-xs mb-1">Status</p>
              <p className="font-semibold capitalize">{wallet?.state || 'Active'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => setShowSendModal(true)}
              variant="ghost"
              className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
              disabled={isLoading}
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
        <h4 className="text-xl font-semibold text-gray-900 mb-4">Circle Transaction History</h4>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-2">Loading transactions...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.slice(0, 5).map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="flex items-center flex-1">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    tx.transactionType === 'INBOUND' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {tx.transactionType === 'INBOUND' ? (
                      <ArrowDownLeft className="h-6 w-6 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-medium text-gray-900 capitalize">
                      {tx.transactionType.toLowerCase()}
                    </p>
                    <p className="text-sm text-gray-500 font-mono truncate">
                      {tx.transactionType === 'INBOUND' 
                        ? `From: ${tx.sourceAddress.slice(0, 6)}...${tx.sourceAddress.slice(-4)}`
                        : `To: ${tx.destinationAddress.slice(0, 6)}...${tx.destinationAddress.slice(-4)}`
                      }
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.createDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-lg ${
                    tx.transactionType === 'INBOUND' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {tx.transactionType === 'INBOUND' ? '+' : '-'}{tx.amounts[0] || '0'}
                  </p>
                  <Badge variant={tx.state === 'COMPLETE' ? 'success' : 'warning'} size="sm">
                    {tx.state}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found</p>
            <p className="text-sm text-gray-400 mt-2">Transactions will appear here when you send or receive funds</p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-2">Circle Developer-Controlled Wallet</h4>
        <p className="text-sm text-gray-600 mb-2">
          This wallet is powered by Circle's User-Controlled Wallets SDK and is linked to your Google account.
        </p>
        <p className="text-xs text-gray-500">
          Signed in as: {session?.user?.email}
        </p>
      </div>

      {/* Receive Modal */}
      <Modal
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
        title="Receive Funds"
      >
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Share your Circle wallet address to receive funds
            </p>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-4">
              <div className="bg-white p-6 rounded-lg shadow-inner">
                <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">QR Code</p>
                <p className="text-xs text-gray-400">Coming soon</p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Circle Wallet Address
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
              <p className="font-mono text-sm break-all text-gray-900">{wallet?.address}</p>
            </div>
          </div>
          
          <Button
            onClick={() => wallet?.address && copyToClipboard(wallet.address)}
            variant="primary"
            fullWidth
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Address
          </Button>
        </div>
      </Modal>

      {/* Send Modal */}
      <Modal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        title="Send Funds"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> Send functionality requires additional Circle SDK integration and challenge completion. This feature is available in the full Circle platform.
            </p>
          </div>
          <Button
            onClick={() => setShowSendModal(false)}
            variant="secondary"
            fullWidth
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  )
}
