'use client'

import { useState, useEffect } from 'react'
import { Wallet, CreditCard, Send, ArrowUpRight, ArrowDownLeft, DollarSign, Shield, TrendingUp, Repeat, Bell, Settings, HelpCircle, Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Button, Badge, DashboardSkeleton, Navigation } from '@/components/ui'

interface Transaction {
  id: string
  type: 'send' | 'receive'
  amount: number
  currency: string
  timestamp: string
  status: 'completed' | 'pending'
  to?: string
  from?: string
}

export default function Dashboard() {
  const [balance, setBalance] = useState<number>(0)
  const [walletAddress, setWalletAddress] = useState<string>('0x742D35cC6634C0532925A3b844bc9E7595f0BEb8')
  const [isKYCVerified, setIsKYCVerified] = useState<boolean>(false)
  const [hasCard, setHasCard] = useState<boolean>(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [unreadNotifications, setUnreadNotifications] = useState<number>(3)

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    setIsLoading(true)
    try {
      // Fetch wallet info
      const walletResponse = await fetch(`/api/wallet/create?address=${walletAddress}`)
      const walletData = await walletResponse.json()
      
      if (walletData.success) {
        setBalance(parseFloat(walletData.wallet.usdcBalance))
        
        // Show demo mode notification if applicable
        if (walletData.isDemoMode) {
          console.info('Demo mode:', walletData.message)
        }
      }

      // Fetch transaction history
      const txResponse = await fetch(`/api/wallet/transactions?address=${walletAddress}&limit=10`)
      const txData = await txResponse.json()
      
      if (txData.success && txData.transactions) {
        const formattedTxs = txData.transactions.map((tx: any) => ({
          id: tx.hash,
          type: tx.type as 'send' | 'receive',
          amount: parseFloat(tx.amount),
          currency: tx.currency,
          timestamp: new Date(tx.timestamp * 1000).toISOString(),
          status: tx.status as 'completed' | 'pending',
          from: tx.from,
          to: tx.to
        }))
        setTransactions(formattedTxs)
      }
    } catch (error) {
      console.error('Error loading wallet data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateWallet = async () => {
    setIsLoading(true)
    // Simulate wallet creation
    setTimeout(() => {
      setWalletAddress('0x' + Math.random().toString(16).substr(2, 40))
      setIsLoading(false)
    }, 2000)
  }

  const handleStartKYC = () => {
    // In production, this would redirect to Stripe Identity
    alert('Redirecting to Stripe Identity for KYC verification...')
  }

  const handleRequestCard = () => {
    // In production, this would call Stripe API to issue a card
    alert('Card issuance initiated. You will receive your virtual card within minutes.')
  }

  if (isLoading && !walletAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardSkeleton />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hello, welcome!</h1>
          <p className="text-gray-600 mt-1">Manage your finances with simplicity</p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Portfolio</p>
                <p className="text-2xl font-bold text-gray-900">$28,500</p>
                <span className="text-xs text-green-600 font-medium">+7.14%</span>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Spending</p>
                <p className="text-2xl font-bold text-gray-900">$1,250</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Exchanged</p>
                <p className="text-2xl font-bold text-gray-900">$2,500</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Repeat className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Services</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <span className="text-xs text-green-600 font-medium">All active</span>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Balance Card - Takes 2 columns */}
          <div className="lg:col-span-2 nubank-gradient rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-purple-200 text-sm mb-2">Available Balance</p>
                  <h2 className="text-5xl font-bold mb-2">${balance.toFixed(2)}</h2>
                  <div className="flex items-center gap-2">
                    <p className="text-purple-200 text-sm">USDC on ARC Testnet</p>
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">Stablecoin</span>
                  </div>
                </div>
                <Link href="/account">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
                    <Wallet className="h-7 w-7 text-white" />
                  </div>
                </Link>
              </div>
              
              {walletAddress && (
                <div className="mb-6">
                  <p className="text-purple-200 text-sm mb-2">Wallet Address</p>
                  <a 
                    href={`https://testnet.arcscan.app/address/${walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <p className="font-mono text-sm flex-1">
                      {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                    </p>
                    <ExternalLink className="h-4 w-4 text-white" />
                  </a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Link href="/account" className="w-full">
                  <Button 
                    variant="ghost"
                    className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm w-full rounded-xl py-6"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send
                  </Button>
                </Link>
                <Link href="/account" className="w-full">
                  <Button
                    variant="ghost"
                    className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm w-full rounded-xl py-6"
                  >
                    <ArrowDownLeft className="h-5 w-5 mr-2" />
                    Receive
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions Column */}
          <div className="space-y-4">
            {/* KYC Status */}
            <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 rounded-xl mr-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Identity</h3>
              </div>
              {isKYCVerified ? (
                <Badge variant="success" className="w-full justify-center py-2 rounded-xl">✓ Verified</Badge>
              ) : (
                <div>
                  <p className="text-gray-600 text-sm mb-4">Verify to unlock all features</p>
                  <Button
                    onClick={handleStartKYC}
                    variant="primary"
                    fullWidth
                    className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 rounded-xl"
                  >
                    Verify Now
                  </Button>
                </div>
              )}
            </div>

            {/* Card Status */}
            <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 rounded-xl mr-3">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">DEO Card</h3>
              </div>
              {hasCard ? (
                <Link href="/card">
                  <Badge variant="success" className="w-full justify-center py-2 rounded-xl cursor-pointer hover:bg-green-600">
                    ✓ View Cards
                  </Badge>
                </Link>
              ) : (
                <div>
                  <p className="text-gray-600 text-sm mb-4">Get your virtual card</p>
                  <Link href="/card" className="block">
                    <Button
                      disabled={!isKYCVerified}
                      variant={isKYCVerified ? "success" : "secondary"}
                      fullWidth
                      className="rounded-xl"
                    >
                      {isKYCVerified ? 'Request Card' : 'KYC Required'}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="mt-8 bg-white rounded-3xl shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Transactions</h3>
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-4 px-4 rounded-xl transition-colors">
                  <div className="flex items-center">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                      tx.type === 'receive' ? 'bg-green-50' : 'bg-purple-50'
                    }`}>
                      {tx.type === 'receive' ? (
                        <ArrowDownLeft className="h-6 w-6 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-6 w-6 text-purple-600" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">
                        {tx.type === 'receive' ? 'Received' : 'Sent'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      tx.type === 'receive' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {tx.type === 'receive' ? '+' : '-'}${tx.amount}
                    </p>
                    <p className="text-sm text-gray-500">{tx.currency}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <ArrowUpRight className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">Your transactions will appear here</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">ARC Blockchain</h4>
            <p className="text-sm text-gray-600">
              Powered by Circle's ARC testnet for fast, secure transactions
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">USDC Stablecoin</h4>
            <p className="text-sm text-gray-600">
              Your balance is backed 1:1 by US dollar reserves
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Stripe Powered</h4>
            <p className="text-sm text-gray-600">
              Identity verification and card services by Stripe
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
