'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Repeat, DollarSign, TrendingUp, ArrowRight, RefreshCw, History, Globe, Zap, Shield, Clock } from 'lucide-react'
import { Button, Badge, Input, Navigation, CurrencyIcon, CurrencyBadge } from '@/components/ui'
import { exchangeService } from '@/modules/exchange/service'
import { STABLECOINS, CURRENCY_LIST } from '@/modules/exchange/stablecoins'
import type { Exchange, ExchangeRate, Currency } from '@/modules/exchange/types'

export default function ExchangePage() {
  const [fromCurrency, setFromCurrency] = useState<Currency>('USDC')
  const [toCurrency, setToCurrency] = useState<Currency>('EURC')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null)
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingRate, setIsLoadingRate] = useState(false)

  const userId = 'user_123'
  
  const currencies: Currency[] = CURRENCY_LIST
  const [isSwapping, setIsSwapping] = useState(false)

  useEffect(() => {
    loadExchangeHistory()
  }, [])

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      loadExchangeRate()
    }
  }, [fromCurrency, toCurrency])

  useEffect(() => {
    if (fromAmount && exchangeRate) {
      const calculated = parseFloat(fromAmount) * exchangeRate.rate
      setToAmount(calculated.toFixed(6))
    } else {
      setToAmount('')
    }
  }, [fromAmount, exchangeRate])

  const loadExchangeRate = async () => {
    setIsLoadingRate(true)
    try {
      const rate = await exchangeService.getExchangeRate(fromCurrency, toCurrency)
      setExchangeRate(rate)
    } catch (error) {
      console.error('Error loading exchange rate:', error)
    } finally {
      setIsLoadingRate(false)
    }
  }

  const loadExchangeHistory = async () => {
    try {
      const history = await exchangeService.getExchangeHistory(userId, 20)
      setExchanges(history)
    } catch (error) {
      console.error('Error loading exchange history:', error)
    }
  }

  const handleExchange = async () => {
    if (!fromAmount || !exchangeRate) return
    
    setIsLoading(true)
    try {
      const exchange = await exchangeService.executeExchange({
        userId,
        fromCurrency,
        toCurrency,
        amount: parseFloat(fromAmount)
      })
      
      setExchanges([exchange, ...exchanges])
      setFromAmount('')
      setToAmount('')
      alert('Exchange completed successfully!')
    } catch (error) {
      console.error('Error executing exchange:', error)
      alert('Exchange failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const swapCurrencies = () => {
    setIsSwapping(true)
    setTimeout(() => {
      const tempCurrency = fromCurrency
      setFromCurrency(toCurrency)
      setToCurrency(tempCurrency)
      setIsSwapping(false)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header with enhanced styling */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            Powered by Circle StableFX
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Currency Exchange
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exchange currencies instantly with institutional-grade technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Exchange Form - Enhanced */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Exchange Currency</h2>
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live Rates
                </div>
              </div>
              
              {/* From Currency with enhanced design */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  From
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <CurrencyIcon currency={fromCurrency} size="sm" showBadge={false} />
                  </div>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="pl-20 pr-32 text-2xl font-semibold h-16"
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value as Currency)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button - Enhanced with animation */}
              <div className="flex justify-center my-6">
                <button
                  onClick={swapCurrencies}
                  className={`p-4 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${
                    isSwapping ? 'rotate-180' : ''
                  }`}
                  style={{ transition: 'transform 0.3s ease-in-out' }}
                >
                  <Repeat className="h-6 w-6" />
                </button>
              </div>

              {/* To Currency with enhanced design */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  To
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <CurrencyIcon currency={toCurrency} size="sm" showBadge={false} />
                  </div>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={toAmount}
                    readOnly
                    className="pl-20 pr-32 text-2xl font-semibold h-16 bg-gray-50"
                  />
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value as Currency)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Exchange Rate Info - Enhanced */}
              {exchangeRate && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-100">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Exchange Rate</span>
                    </div>
                    <button
                      onClick={loadExchangeRate}
                      className="text-blue-600 hover:text-blue-700 transition-colors p-1 hover:bg-blue-100 rounded-lg"
                      disabled={isLoadingRate}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoadingRate ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CurrencyBadge currency={fromCurrency} size="sm" />
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <CurrencyBadge currency={toCurrency} size="sm" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    1 {fromCurrency} = {exchangeRate.rate.toFixed(6)} {toCurrency}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(exchangeRate.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
              )}

              {/* Exchange Summary - Enhanced */}
              {fromAmount && (
                <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-5 mb-6 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Transaction Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">You send:</span>
                      <span className="font-bold text-gray-900">{fromAmount} {fromCurrency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">You receive:</span>
                      <span className="font-bold text-gray-900">{toAmount} {toCurrency}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2"></div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Exchange Fee:</span>
                      <span className="font-semibold text-green-600">$0.00 (No fee)</span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleExchange}
                variant="primary"
                fullWidth
                disabled={!fromAmount || !exchangeRate || isLoading}
                className="h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Processing Exchange...
                  </>
                ) : (
                  <>
                    <Repeat className="h-5 w-5 mr-2" />
                    Exchange Now
                  </>
                )}
              </Button>
            </div>

            {/* Info Cards - Enhanced with better visuals */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                <Globe className="h-10 w-10 mb-3 opacity-90" />
                <h4 className="font-bold text-lg mb-2">Circle StableFX</h4>
                <p className="text-sm text-blue-100">
                  Institutional-grade FX engine for instant currency exchanges
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                <Zap className="h-10 w-10 mb-3 opacity-90" />
                <h4 className="font-bold text-lg mb-2">Instant Settlement</h4>
                <p className="text-sm text-green-100">
                  24/7 real-time settlement with zero hidden fees
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
                <Shield className="h-10 w-10 mb-3 opacity-90" />
                <h4 className="font-bold text-lg mb-2">Secure & Reliable</h4>
                <p className="text-sm text-purple-100">
                  Bank-grade security with best-in-class liquidity
                </p>
              </div>
            </div>
          </div>

          {/* Exchange History - Enhanced */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <History className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Recent Exchanges</h3>
              </div>

              {exchanges.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {exchanges.map((exchange) => (
                    <div key={exchange.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-gray-50 to-white">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <CurrencyIcon currency={exchange.fromCurrency} size="sm" showBadge={false} />
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <CurrencyIcon currency={exchange.toCurrency} size="sm" showBadge={false} />
                        </div>
                        <Badge 
                          variant={exchange.status === 'completed' ? 'success' : exchange.status === 'failed' ? 'danger' : 'warning'}
                          size="sm"
                        >
                          {exchange.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">From:</span>
                          <span className="font-semibold text-gray-900">{exchange.fromAmount.toFixed(2)} {exchange.fromCurrency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">To:</span>
                          <span className="font-semibold text-gray-900">{exchange.toAmount.toFixed(6)} {exchange.toCurrency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rate:</span>
                          <span className="text-gray-900">{exchange.rate.toFixed(6)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                        {new Date(exchange.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Repeat className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">No exchange history yet</p>
                  <p className="text-gray-400 text-xs mt-1">Your transactions will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Supported Currencies - Enhanced with Circle StableFX stablecoins */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Circle StableFX Supported Stablecoins</h3>
            <p className="text-gray-600">Institutional-grade onchain FX engine supporting stablecoins from trusted issuers worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {currencies.map(currency => {
              const info = STABLECOINS[currency];
              return (
                <div key={currency} className="group">
                  <div className="flex flex-col p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer h-full">
                    <div className="flex items-center justify-center mb-4">
                      <CurrencyIcon currency={currency} size="lg" showBadge={false} />
                    </div>
                    <div className="text-center mb-3">
                      <p className="font-bold text-xl text-gray-900 mb-1">{currency}</p>
                      <p className="text-xs text-gray-600 font-medium mb-2">{info.name}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-3 space-y-2 text-xs">
                      <div>
                        <p className="text-gray-500 uppercase tracking-wide font-semibold mb-1">Issuer</p>
                        <p className="text-gray-900 font-medium">{info.issuer}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 uppercase tracking-wide font-semibold mb-1">Currency</p>
                        <p className="text-gray-900 font-medium">{info.fiatCurrency} ({info.fiatSymbol})</p>
                      </div>
                      <div>
                        <p className="text-gray-500 uppercase tracking-wide font-semibold mb-1">Country</p>
                        <p className="text-gray-900 font-medium">{info.country}</p>
                      </div>
                    </div>
                    <div className="mt-auto pt-3">
                      <div className="flex items-center justify-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1.5 rounded-full">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Available 24/7</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
