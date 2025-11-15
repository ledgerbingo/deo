'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Plus, Search, Filter } from 'lucide-react'
import { Button, Badge, Modal, Input, Navigation } from '@/components/ui'
import { investmentService } from '@/modules/investment/service'
import type { Portfolio, Asset, Trade } from '@/modules/investment/types'

export default function InvestmentPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [quantity, setQuantity] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  const userId = 'user_123'

  useEffect(() => {
    loadInvestmentData()
  }, [])

  const loadInvestmentData = async () => {
    setIsLoading(true)
    try {
      const portfolioData = await investmentService.getPortfolio(userId)
      const assets = await investmentService.getAvailableAssets()
      const tradeHistory = await investmentService.getTradeHistory(userId, 20)
      
      setPortfolio(portfolioData)
      setAvailableAssets(assets)
      setTrades(tradeHistory)
    } catch (error) {
      console.error('Error loading investment data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrade = async () => {
    if (!selectedAsset || !quantity) return
    
    try {
      const trade = await investmentService.executeTrade({
        userId,
        assetSymbol: selectedAsset.symbol,
        type: tradeType,
        quantity: parseFloat(quantity),
        price: selectedAsset.currentPrice
      })
      
      setTrades([trade, ...trades])
      setShowTradeModal(false)
      setQuantity('')
      setSelectedAsset(null)
      loadInvestmentData()
    } catch (error) {
      console.error('Error executing trade:', error)
    }
  }

  const openTradeModal = (asset: Asset, type: 'buy' | 'sell') => {
    setSelectedAsset(asset)
    setTradeType(type)
    setShowTradeModal(true)
  }

  const filteredAssets = availableAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || asset.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Investment Portfolio</h1>
          <p className="text-gray-600 mt-2">Manage your crypto and traditional asset investments</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-4">Loading portfolio...</p>
          </div>
        ) : (
          <>
            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-2xl p-6 text-white col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-blue-200 text-sm mb-1">Total Portfolio Value</p>
                    <h2 className="text-4xl font-bold">${portfolio?.totalValue.toLocaleString() || '0'}</h2>
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <PieChart className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(portfolio?.returnPercentage || 0) >= 0 ? (
                    <ArrowUpRight className="h-5 w-5 text-green-300" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-red-300" />
                  )}
                  <span className={`text-lg font-semibold ${
                    (portfolio?.returnPercentage || 0) >= 0 ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {portfolio?.returnPercentage.toFixed(2) || '0'}%
                  </span>
                  <span className="text-blue-200 text-sm">
                    (${portfolio?.totalReturn.toLocaleString() || '0'})
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Total Cost</p>
                  <TrendingDown className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">${portfolio?.totalCost.toLocaleString() || '0'}</p>
                <p className="text-sm text-gray-500 mt-1">Initial investment</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Holdings</p>
                  <PieChart className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{portfolio?.holdings.length || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Different assets</p>
              </div>
            </div>

            {/* Holdings */}
            {portfolio && portfolio.holdings.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Holdings</h3>
                <div className="space-y-4">
                  {portfolio.holdings.map((holding) => (
                    <div key={holding.asset.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition-colors">
                      <div className="flex items-center flex-1">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {holding.asset.symbol.slice(0, 2)}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{holding.asset.name}</p>
                            <Badge variant="default" size="sm">{holding.asset.symbol}</Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {holding.quantity} units @ ${holding.averageCost.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-semibold text-gray-900">${holding.currentValue.toLocaleString()}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {holding.returnPercentage >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`text-sm font-medium ${
                            holding.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {holding.returnPercentage.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openTradeModal(holding.asset, 'buy')}
                          variant="success"
                          size="sm"
                        >
                          Buy
                        </Button>
                        <Button
                          onClick={() => openTradeModal(holding.asset, 'sell')}
                          variant="secondary"
                          size="sm"
                        >
                          Sell
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Assets */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Available Assets</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search assets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="crypto">Crypto</option>
                      <option value="stock">Stocks</option>
                      <option value="etf">ETFs</option>
                      <option value="bond">Bonds</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAssets.map((asset) => (
                  <div key={asset.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{asset.symbol}</p>
                        <p className="text-sm text-gray-500">{asset.name}</p>
                      </div>
                      <Badge variant="default" size="sm">{asset.type}</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-2xl font-bold text-gray-900">${asset.currentPrice.toFixed(2)}</p>
                      <div className={`flex items-center gap-1 ${
                        asset.changePercentage >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {asset.changePercentage >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">{asset.changePercentage.toFixed(2)}%</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => openTradeModal(asset, 'buy')}
                      variant="primary"
                      size="sm"
                      fullWidth
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Buy {asset.symbol}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Trades */}
            {trades.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Trades</h3>
                <div className="space-y-4">
                  {trades.slice(0, 10).map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center flex-1">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          trade.type === 'buy' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {trade.type === 'buy' ? (
                            <ArrowUpRight className="h-5 w-5 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {trade.type === 'buy' ? 'Bought' : 'Sold'} {trade.assetSymbol}
                            </p>
                            <Badge 
                              variant={trade.status === 'completed' ? 'success' : trade.status === 'failed' ? 'danger' : 'warning'}
                              size="sm"
                            >
                              {trade.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {trade.quantity} units @ ${trade.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">{new Date(trade.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">${trade.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <TrendingUp className="h-8 w-8 text-blue-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Diversified Assets</h4>
            <p className="text-sm text-gray-600">
              Invest in crypto, stocks, ETFs, and bonds all in one place.
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-6">
            <DollarSign className="h-8 w-8 text-green-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Low Fees</h4>
            <p className="text-sm text-gray-600">
              Trade with minimal fees and no hidden charges.
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-6">
            <PieChart className="h-8 w-8 text-purple-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Real-time Tracking</h4>
            <p className="text-sm text-gray-600">
              Monitor your portfolio performance in real-time with detailed analytics.
            </p>
          </div>
        </div>
      </main>

      {/* Trade Modal */}
      <Modal
        isOpen={showTradeModal}
        onClose={() => setShowTradeModal(false)}
        title={`${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedAsset?.symbol || ''}`}
      >
        {selectedAsset && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Asset</span>
                <span className="font-semibold">{selectedAsset.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Price</span>
                <span className="font-semibold">${selectedAsset.currentPrice.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <Input
                type="number"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            {quantity && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold">
                    ${(parseFloat(quantity) * selectedAsset.currentPrice).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transaction Fee:</span>
                  <span className="font-semibold">$0.00</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleTrade}
              variant={tradeType === 'buy' ? 'success' : 'secondary'}
              fullWidth
              disabled={!quantity || parseFloat(quantity) <= 0}
            >
              {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedAsset.symbol}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
