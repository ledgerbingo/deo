'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Plus, Search, Filter, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Button, Badge, Modal, Input, Navigation, Alert } from '@/components/ui'
import { investmentService } from '@/modules/investment/service'
import type { Portfolio, Asset, Trade } from '@/modules/investment/types'

export default function InvestmentPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [quantity, setQuantity] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [tradeStatus, setTradeStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [isExecutingTrade, setIsExecutingTrade] = useState(false)

  const userId = 'user_123'

  useEffect(() => {
    loadInvestmentData()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshPrices()
    }, 30000)
    
    return () => clearInterval(interval)
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
      setTradeStatus({ type: 'error', message: 'Failed to load investment data' })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshPrices = async () => {
    setIsRefreshing(true)
    try {
      const portfolioData = await investmentService.getPortfolio(userId)
      const assets = await investmentService.getAvailableAssets()
      
      setPortfolio(portfolioData)
      setAvailableAssets(assets)
    } catch (error) {
      console.error('Error refreshing prices:', error)
    } finally {
      setTimeout(() => setIsRefreshing(false), 500)
    }
  }

  const handleTrade = async () => {
    if (!selectedAsset || !quantity) return
    
    const quantityNum = parseFloat(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setTradeStatus({ type: 'error', message: 'Please enter a valid quantity' })
      return
    }

    // Validate sell quantity
    if (tradeType === 'sell' && portfolio) {
      const holding = portfolio.holdings.find(h => h.asset.symbol === selectedAsset.symbol)
      if (!holding || holding.quantity < quantityNum) {
        setTradeStatus({ type: 'error', message: 'Insufficient holdings to sell' })
        return
      }
    }

    setIsExecutingTrade(true)
    try {
      const trade = await investmentService.executeTrade({
        userId,
        assetSymbol: selectedAsset.symbol,
        type: tradeType,
        quantity: quantityNum,
        price: selectedAsset.currentPrice
      })
      
      setTrades([trade, ...trades])
      setShowTradeModal(false)
      setQuantity('')
      setSelectedAsset(null)
      setTradeStatus({ 
        type: 'success', 
        message: `Successfully ${tradeType === 'buy' ? 'bought' : 'sold'} ${quantityNum} ${selectedAsset.symbol}` 
      })
      
      // Refresh portfolio data to show updated holdings
      await loadInvestmentData()
    } catch (error) {
      console.error('Error executing trade:', error)
      setTradeStatus({ type: 'error', message: 'Failed to execute trade. Please try again.' })
    } finally {
      setIsExecutingTrade(false)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header with Refresh Button */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Investment Portfolio</h1>
            <p className="text-gray-600 mt-2">Manage your crypto and traditional asset investments</p>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {portfolio?.lastUpdated.toLocaleTimeString() || 'Loading...'}
            </p>
          </div>
          <Button
            onClick={refreshPrices}
            variant="secondary"
            disabled={isRefreshing || isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Prices
          </Button>
        </div>

        {/* Status Messages */}
        {tradeStatus && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <Alert
              variant={tradeStatus.type === 'success' ? 'success' : 'error'}
              onClose={() => setTradeStatus(null)}
            >
              {tradeStatus.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span className="ml-2">{tradeStatus.message}</span>
            </Alert>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-4">Loading portfolio...</p>
          </div>
        ) : (
          <>
            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl shadow-2xl p-6 text-white col-span-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-blue-200 text-sm mb-1">Total Portfolio Value</p>
                      <h2 className="text-4xl font-bold tracking-tight">${portfolio?.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</h2>
                    </div>
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
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
                      {(portfolio?.returnPercentage || 0) >= 0 ? '+' : ''}{portfolio?.returnPercentage.toFixed(2) || '0.00'}%
                    </span>
                    <span className="text-blue-200 text-sm">
                      ({(portfolio?.totalReturn || 0) >= 0 ? '+' : ''}${portfolio?.totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'})
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm font-medium">Total Cost</p>
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">${portfolio?.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
                <p className="text-sm text-gray-500 mt-1">Initial investment</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm font-medium">Holdings</p>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <PieChart className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{portfolio?.holdings.length || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Different assets</p>
              </div>
            </div>

            {/* Holdings */}
            {portfolio && portfolio.holdings.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Holdings</h3>
                <div className="space-y-3">
                  {portfolio.holdings.map((holding) => (
                    <div key={holding.asset.id} className="group flex items-center justify-between border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-md transition-all duration-200 bg-gradient-to-r hover:from-blue-50/50">
                      <div className="flex items-center flex-1">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
                          {holding.asset.symbol.slice(0, 2)}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 text-lg">{holding.asset.name}</p>
                            <Badge variant="default" size="sm">{holding.asset.symbol}</Badge>
                            <Badge variant="info" size="sm">{holding.asset.type}</Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-sm text-gray-500">
                              {holding.quantity} units @ ${holding.averageCost.toFixed(2)}
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                              Current: ${holding.asset.currentPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-semibold text-gray-900 text-lg">${holding.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {holding.returnPercentage >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`text-sm font-medium ${
                            holding.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {holding.returnPercentage >= 0 ? '+' : ''}{holding.returnPercentage.toFixed(2)}%
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
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Available Assets</h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search assets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none bg-white transition-all"
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
                  <div key={asset.id} className="group border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-gradient-to-br hover:from-blue-50/30">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">{asset.symbol}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{asset.name}</p>
                      </div>
                      <Badge variant="default" size="sm">{asset.type}</Badge>
                    </div>
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">${asset.currentPrice.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 mt-1">Current price</p>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                        asset.changePercentage >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {asset.changePercentage >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="text-sm font-semibold">{asset.changePercentage >= 0 ? '+' : ''}{asset.changePercentage.toFixed(2)}%</span>
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
              
              {filteredAssets.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No assets found matching your search criteria</p>
                </div>
              )}
            </div>

            {/* Recent Trades */}
            {trades.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Trades</h3>
                <div className="space-y-3">
                  {trades.slice(0, 10).map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all">
                      <div className="flex items-center flex-1">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          trade.type === 'buy' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {trade.type === 'buy' ? (
                            <ArrowUpRight className="h-6 w-6 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">
                              {trade.type === 'buy' ? 'Bought' : 'Sold'} {trade.assetSymbol}
                            </p>
                            <Badge 
                              variant={trade.status === 'completed' ? 'success' : trade.status === 'failed' ? 'danger' : 'warning'}
                              size="sm"
                            >
                              {trade.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {trade.quantity} units @ ${trade.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{new Date(trade.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900 text-lg">${trade.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="p-3 bg-blue-600 rounded-xl w-fit mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 text-lg">Diversified Assets</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Invest in crypto, stocks, ETFs, and bonds all in one place.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="p-3 bg-green-600 rounded-xl w-fit mb-4">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 text-lg">Low Fees</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Trade with minimal fees and no hidden charges.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="p-3 bg-purple-600 rounded-xl w-fit mb-4">
              <PieChart className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 text-lg">Real-time Tracking</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Monitor your portfolio performance in real-time with detailed analytics.
            </p>
          </div>
        </div>
      </main>

      {/* Trade Modal */}
      <Modal
        isOpen={showTradeModal}
        onClose={() => {
          setShowTradeModal(false)
          setQuantity('')
          setTradeStatus(null)
        }}
        title={`${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedAsset?.symbol || ''}`}
      >
        {selectedAsset && (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {selectedAsset.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{selectedAsset.name}</p>
                  <p className="text-sm text-gray-500">{selectedAsset.symbol} • {selectedAsset.type}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <span className="text-gray-600 text-sm">Current Price</span>
                  <p className="font-bold text-gray-900 text-xl mt-1">${selectedAsset.currentPrice.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="text-gray-600 text-sm">24h Change</span>
                  <p className={`font-bold text-xl mt-1 ${
                    selectedAsset.changePercentage >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedAsset.changePercentage >= 0 ? '+' : ''}{selectedAsset.changePercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              {tradeType === 'sell' && portfolio && (
                <div className="mt-3 bg-white rounded-lg p-3">
                  <span className="text-gray-600 text-sm">Available to Sell</span>
                  <p className="font-bold text-gray-900 text-xl mt-1">
                    {portfolio.holdings.find(h => h.asset.symbol === selectedAsset.symbol)?.quantity || 0} units
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                step="0.01"
              />
              {tradeType === 'sell' && portfolio && quantity && (
                <p className="text-xs text-gray-500 mt-1">
                  Available: {portfolio.holdings.find(h => h.asset.symbol === selectedAsset.symbol)?.quantity || 0} units
                </p>
              )}
            </div>

            {quantity && parseFloat(quantity) > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 space-y-3 border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <span className="font-bold text-gray-900">{parseFloat(quantity).toFixed(4)} {selectedAsset.symbol}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Price per unit:</span>
                  <span className="font-bold text-gray-900">${selectedAsset.currentPrice.toFixed(2)}</span>
                </div>
                <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total Amount:</span>
                  <span className="font-bold text-gray-900 text-xl">
                    ${(parseFloat(quantity) * selectedAsset.currentPrice).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Transaction Fee:</span>
                  <span className="font-semibold text-green-600">$0.00</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleTrade}
              variant={tradeType === 'buy' ? 'success' : 'secondary'}
              fullWidth
              disabled={!quantity || parseFloat(quantity) <= 0 || isExecutingTrade}
            >
              {isExecutingTrade ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedAsset.symbol}
                </>
              )}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
