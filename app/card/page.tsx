'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CreditCard, Plus, Lock, Unlock, X, DollarSign, Calendar, Shield, TrendingUp, ShoppingBag, Filter } from 'lucide-react'
import { Button, Badge, Modal, Input } from '@/components/ui'
import { cardService } from '@/modules/card/service'
import type { Card, CardTransaction } from '@/modules/card/types'

export default function CardPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [transactions, setTransactions] = useState<CardTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewCardModal, setShowNewCardModal] = useState(false)
  const [selectedCardType, setSelectedCardType] = useState<'virtual' | 'physical'>('virtual')
  const [spendingLimit, setSpendingLimit] = useState('5000')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const userId = 'user_123'

  useEffect(() => {
    loadCardData()
  }, [])

  const loadCardData = async () => {
    setIsLoading(true)
    try {
      const userCards = await cardService.getUserCards(userId)
      setCards(userCards)
      
      if (userCards.length > 0) {
        const cardTransactions = await cardService.getCardTransactions(userCards[0].id, 20)
        setTransactions(cardTransactions)
      }
    } catch (error) {
      console.error('Error loading card data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleIssueCard = async () => {
    try {
      const newCard = await cardService.issueCard({
        userId,
        type: selectedCardType,
        spendingLimit: parseFloat(spendingLimit)
      })
      
      setCards([...cards, newCard])
      setShowNewCardModal(false)
      setSpendingLimit('5000')
    } catch (error) {
      console.error('Error issuing card:', error)
    }
  }

  const handleFreezeCard = async (cardId: string) => {
    try {
      await cardService.freezeCard(cardId)
      loadCardData()
    } catch (error) {
      console.error('Error freezing card:', error)
    }
  }

  const handleUnfreezeCard = async (cardId: string) => {
    try {
      await cardService.unfreezeCard(cardId)
      loadCardData()
    } catch (error) {
      console.error('Error unfreezing card:', error)
    }
  }

  const handleCancelCard = async (cardId: string) => {
    if (confirm('Are you sure you want to cancel this card? This action cannot be undone.')) {
      try {
        await cardService.cancelCard(cardId)
        loadCardData()
      } catch (error) {
        console.error('Error cancelling card:', error)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'frozen':
        return <Badge variant="warning">Frozen</Badge>
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>
      default:
        return <Badge variant="default">Inactive</Badge>
    }
  }

  const filteredTransactions = transactions.filter(tx => 
    filterCategory === 'all' || tx.category === filterCategory
  )

  const categories = Array.from(new Set(transactions.map(tx => tx.category)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 rounded-full nubank-gradient flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">DEO</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/account" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                Account
              </Link>
              <Link href="/investment" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                Invest
              </Link>
              <Link href="/settings" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                Settings
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cards</h1>
            <p className="text-gray-600 mt-1">Manage your virtual and physical cards</p>
          </div>
          <Button onClick={() => setShowNewCardModal(true)} className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500">
            <Plus className="h-5 w-5 mr-2" />
            Request New Card
          </Button>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-500 mt-4">Loading cards...</p>
          </div>
        ) : cards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cards.map((card) => (
              <div key={card.id} className="relative">
                {/* Card Display */}
                <div className={`relative h-56 rounded-3xl shadow-xl p-6 text-white overflow-hidden ${
                  card.status === 'active' 
                    ? 'nubank-gradient'
                    : 'bg-gradient-to-br from-gray-500 to-gray-700'
                }`}>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-black opacity-10 rounded-full -ml-16 -mb-16"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs opacity-80 mb-1">DEO Card</p>
                        <Badge variant={card.type === 'virtual' ? 'info' : 'success'} size="sm" className="bg-white/20 text-white border-0">
                          {card.type === 'virtual' ? 'Virtual' : 'Physical'}
                        </Badge>
                      </div>
                      <CreditCard className="h-8 w-8 opacity-80" />
                    </div>

                    <div>
                      <p className="text-2xl font-mono tracking-widest mb-4">
                        •••• •••• •••• {card.last4}
                      </p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs opacity-80 mb-1">Expires</p>
                          <p className="font-mono">{String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-80 mb-1">Available</p>
                          <p className="font-semibold">${card.availableBalance.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Controls */}
                <div className="mt-4 bg-white rounded-3xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    {getStatusBadge(card.status)}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Spending Limit</span>
                    <span className="text-sm font-semibold text-gray-900">${card.spendingLimit.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {card.status === 'active' ? (
                      <Button
                        onClick={() => handleFreezeCard(card.id)}
                        variant="secondary"
                        size="sm"
                        fullWidth
                        className="rounded-xl"
                      >
                        <Lock className="h-4 w-4 mr-1" />
                        Freeze
                      </Button>
                    ) : card.status === 'frozen' ? (
                      <Button
                        onClick={() => handleUnfreezeCard(card.id)}
                        variant="success"
                        size="sm"
                        fullWidth
                        className="rounded-xl"
                      >
                        <Unlock className="h-4 w-4 mr-1" />
                        Unfreeze
                      </Button>
                    ) : null}
                    {card.status !== 'cancelled' && (
                      <Button
                        onClick={() => handleCancelCard(card.id)}
                        variant="danger"
                        size="sm"
                        fullWidth
                        className="rounded-xl"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl shadow-md">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Cards Yet</h3>
            <p className="text-gray-600 mb-6">Request your first virtual or physical card to get started</p>
            <Button onClick={() => setShowNewCardModal(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-5 w-5 mr-2" />
              Request Card
            </Button>
          </div>
        )}

        {/* Transactions */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-3xl shadow-md p-8 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Card Transactions</h3>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 hover:bg-gray-50 -mx-4 px-4 py-3 rounded-xl transition-colors">
                  <div className="flex items-center flex-1">
                    <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{tx.merchant}</p>
                        <Badge 
                          variant={tx.status === 'approved' ? 'success' : tx.status === 'declined' ? 'danger' : 'warning'}
                          size="sm"
                        >
                          {tx.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{tx.category}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      tx.status === 'declined' ? 'text-gray-400 line-through' : 'text-gray-900'
                    }`}>
                      ${tx.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">{tx.currency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Secure Payments</h4>
            <p className="text-sm text-gray-600">
              All transactions are protected with advanced fraud detection and 3D Secure authentication.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Instant Issuance</h4>
            <p className="text-sm text-gray-600">
              Virtual cards are available instantly. Physical cards ship within 5-7 business days.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Spending Controls</h4>
            <p className="text-sm text-gray-600">
              Set daily, weekly, or monthly limits. Control where and how your card can be used.
            </p>
          </div>
        </div>
      </main>

      {/* New Card Modal */}
      <Modal
        isOpen={showNewCardModal}
        onClose={() => setShowNewCardModal(false)}
        title="Request New Card"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Card Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedCardType('virtual')}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  selectedCardType === 'virtual'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="h-6 w-6 mb-2 text-purple-600" />
                <p className="font-semibold text-gray-900">Virtual</p>
                <p className="text-xs text-gray-600 mt-1">Instant delivery</p>
              </button>
              <button
                onClick={() => setSelectedCardType('physical')}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  selectedCardType === 'physical'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="h-6 w-6 mb-2 text-green-600" />
                <p className="font-semibold text-gray-900">Physical</p>
                <p className="text-xs text-gray-600 mt-1">Ships in 5-7 days</p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Spending Limit
            </label>
            <Input
              type="number"
              placeholder="5000"
              value={spendingLimit}
              onChange={(e) => setSpendingLimit(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              You can adjust this limit anytime from card settings
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-sm text-purple-900">
              <Calendar className="h-4 w-4 inline mr-2" />
              {selectedCardType === 'virtual' 
                ? 'Your virtual card will be available immediately after issuance.'
                : 'Your physical card will be shipped to your registered address within 5-7 business days.'}
            </p>
          </div>

          <Button
            onClick={handleIssueCard}
            className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
            fullWidth
            disabled={!spendingLimit || parseFloat(spendingLimit) <= 0}
          >
            Issue {selectedCardType === 'virtual' ? 'Virtual' : 'Physical'} Card
          </Button>
        </div>
      </Modal>
    </div>
  )
}
