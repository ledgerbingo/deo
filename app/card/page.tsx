'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CreditCard, Plus, Lock, Unlock, X, DollarSign, Calendar, Shield, TrendingUp, ShoppingBag, Filter, AlertCircle } from 'lucide-react'
import { Button, Badge, Modal, Input, Navigation } from '@/components/ui'
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
      {/* Navigation */}
      <Navigation />

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
                        <div className="flex gap-2">
                          <Badge variant={card.type === 'virtual' ? 'info' : 'success'} size="sm" className="bg-white/20 text-white border-0">
                            {card.type === 'virtual' ? 'Virtual' : 'Physical'}
                          </Badge>
                          {card.isDemo && (
                            <Badge variant="warning" size="sm" className="bg-yellow-500/90 text-white border-0">
                              Demo
                            </Badge>
                          )}
                        </div>
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
                  {card.isDemo && (
                    <div className="mb-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-yellow-800">
                          This is a demo card for testing purposes. Real transactions cannot be made with this card.
                        </p>
                      </div>
                    </div>
                  )}
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

        {/* Powered by Stripe Issuing Badge */}
        <div className="mt-8 pb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
            <svg className="h-4 w-4" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg" width="60" height="25">
              <path fill="#635bff" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z"></path>
            </svg>
            <span className="text-xs text-gray-600 font-medium">Powered by Stripe Issuing</span>
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
