'use client'

import { useState, useEffect } from 'react'
import { Wallet, CreditCard, Send, ArrowUpRight, ArrowDownLeft, DollarSign, Shield, RefreshCw, TrendingUp, Repeat, Bell, Settings, HelpCircle } from 'lucide-react'
import Link from 'next/link'

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
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [isKYCVerified, setIsKYCVerified] = useState<boolean>(false)
  const [hasCard, setHasCard] = useState<boolean>(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [unreadNotifications, setUnreadNotifications] = useState<number>(3)

  useEffect(() => {
    // Simulate loading wallet data
    setTimeout(() => {
      setWalletAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8')
      setBalance(1250.50)
      setIsKYCVerified(false)
      setHasCard(false)
      setTransactions([
        {
          id: '1',
          type: 'receive',
          amount: 500,
          currency: 'USDC',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed',
          from: '0x123...456'
        },
        {
          id: '2',
          type: 'send',
          amount: 150,
          currency: 'USDC',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          status: 'completed',
          to: '0x789...abc'
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">DEO Finance</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/investment" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                <TrendingUp className="h-5 w-5 inline mr-1" />
                Invest
              </Link>
              <Link href="/exchange" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                <Repeat className="h-5 w-5 inline mr-1" />
                Exchange
              </Link>
              <Link href="/support" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                <HelpCircle className="h-5 w-5 inline" />
              </Link>
              <Link href="/settings" className="relative">
                <Bell className="h-6 w-6 text-gray-700 hover:text-blue-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
              <Link href="/settings">
                <Settings className="h-6 w-6 text-gray-700 hover:text-blue-600" />
              </Link>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                U
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to DEO Finance</h1>
          <p className="text-gray-600 mt-2">Manage your USDC wallet and comprehensive financial services</p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">$28,500</p>
                <p className="text-sm text-green-600">+7.14%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Spending</p>
                <p className="text-2xl font-bold text-gray-900">$1,250</p>
                <p className="text-sm text-gray-500">Via DEO Card</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exchanged</p>
                <p className="text-2xl font-bold text-gray-900">$2,500</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <Repeat className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-500">All operational</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-blue-200 text-sm mb-1">Total Balance</p>
                <h2 className="text-4xl font-bold">${balance.toFixed(2)}</h2>
                <p className="text-blue-200 text-sm mt-1">USDC</p>
              </div>
              <Wallet className="h-12 w-12 text-blue-200" />
            </div>
            
            {walletAddress ? (
              <div className="mb-6">
                <p className="text-blue-200 text-sm mb-1">Wallet Address</p>
                <p className="font-mono text-sm bg-blue-800 bg-opacity-50 px-3 py-2 rounded">
                  {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                </p>
              </div>
            ) : (
              <button
                onClick={handleCreateWallet}
                className="mb-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Create Wallet
              </button>
            )}

            <div className="flex gap-4">
              <button className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-3 rounded-lg font-medium flex items-center justify-center transition-colors">
                <Send className="h-5 w-5 mr-2" />
                Send
              </button>
              <button className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-3 rounded-lg font-medium flex items-center justify-center transition-colors">
                <ArrowDownLeft className="h-5 w-5 mr-2" />
                Receive
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* KYC Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Identity Verification</h3>
              </div>
              {isKYCVerified ? (
                <div className="text-green-600 font-medium">✓ Verified</div>
              ) : (
                <div>
                  <p className="text-gray-600 text-sm mb-4">Complete KYC to unlock all features</p>
                  <button
                    onClick={handleStartKYC}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Start Verification
                  </button>
                </div>
              )}
            </div>

            {/* Card Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">DEO Card</h3>
              </div>
              {hasCard ? (
                <div className="text-green-600 font-medium">✓ Active</div>
              ) : (
                <div>
                  <p className="text-gray-600 text-sm mb-4">Get a virtual or physical card</p>
                  <button
                    onClick={handleRequestCard}
                    disabled={!isKYCVerified}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      isKYCVerified
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isKYCVerified ? 'Request Card' : 'KYC Required'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      tx.type === 'receive' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {tx.type === 'receive' ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">
                        {tx.type === 'receive' ? 'Received' : 'Sent'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      tx.type === 'receive' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {tx.type === 'receive' ? '+' : '-'}${tx.amount} {tx.currency}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{tx.status}</p>
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
            <h4 className="font-semibold text-gray-900 mb-2">ARC Blockchain</h4>
            <p className="text-sm text-gray-600">
              Powered by Circle's ARC testnet for fast, secure transactions
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-2">USDC Stablecoin</h4>
            <p className="text-sm text-gray-600">
              Your balance is backed 1:1 by US dollar reserves
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-2">Stripe Powered</h4>
            <p className="text-sm text-gray-600">
              Identity verification and card services by Stripe
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
