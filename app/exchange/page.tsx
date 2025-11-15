'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Repeat, DollarSign, TrendingUp, ArrowRight, RefreshCw, History, Globe } from 'lucide-react'
import { Button, Badge, Input } from '@/components/ui'
import { exchangeService } from '@/modules/exchange/service'
import type { Exchange, ExchangeRate, Currency } from '@/modules/exchange/types'

export default function ExchangePage() {
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD')
  const [toCurrency, setToCurrency] = useState<Currency>('USDC')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null)
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingRate, setIsLoadingRate] = useState(false)

  const userId = 'user_123'
  
  const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'JPY', 'USDC', 'BTC', 'ETH']

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
    const tempCurrency = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(tempCurrency)
  }

  const getCurrencyFlag = (currency: Currency) => {
    const flags: Record<Currency, string> = {
      USD: '🇺🇸',
      EUR: '🇪🇺',
      GBP: '🇬🇧',
      JPY: '🇯🇵',
      USDC: '💵',
      BTC: '₿',
      ETH: 'Ξ'
    }
    return flags[currency] || '💱'
  }

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
              <Link href="/account" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Account
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
          <h1 className="text-3xl font-bold text-gray-900">Currency Exchange</h1>
          <p className="text-gray-600 mt-2">Exchange currencies instantly with Circle StableFX technology</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Exchange Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Exchange Currency</h2>
              
              {/* From Currency */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                    />
                  </div>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value as Currency)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-lg font-semibold"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>
                        {getCurrencyFlag(currency)} {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center my-4">
                <button
                  onClick={swapCurrencies}
                  className="p-3 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                >
                  <Repeat className="h-6 w-6 text-blue-600" />
                </button>
              </div>

              {/* To Currency */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={toAmount}
                      readOnly
                    />
                  </div>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value as Currency)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-lg font-semibold"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>
                        {getCurrencyFlag(currency)} {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Exchange Rate Info */}
              {exchangeRate && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Exchange Rate</span>
                    <button
                      onClick={loadExchangeRate}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                      disabled={isLoadingRate}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoadingRate ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    1 {fromCurrency} = {exchangeRate.rate.toFixed(6)} {toCurrency}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {new Date(exchangeRate.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
              )}

              {/* Exchange Fee */}
              {fromAmount && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Exchange Amount:</span>
                    <span className="font-semibold">{fromAmount} {fromCurrency}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">You'll Receive:</span>
                    <span className="font-semibold">{toAmount} {toCurrency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fee:</span>
                    <span className="font-semibold text-green-600">$0.00</span>
                  </div>
                </div>
              )}

              <Button
                onClick={handleExchange}
                variant="primary"
                fullWidth
                disabled={!fromAmount || !exchangeRate || isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Repeat className="h-5 w-5 mr-2" />
                    Exchange Now
                  </>
                )}
              </Button>
            </div>

            {/* Info Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <Globe className="h-8 w-8 text-blue-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Circle StableFX</h4>
                <p className="text-sm text-gray-600">
                  Powered by Circle's StableFX technology for instant, reliable currency exchanges.
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Real-time Rates</h4>
                <p className="text-sm text-gray-600">
                  Get the best market rates updated in real-time with zero hidden fees.
                </p>
              </div>
            </div>
          </div>

          {/* Exchange History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <History className="h-6 w-6 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Exchanges</h3>
              </div>

              {exchanges.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {exchanges.map((exchange) => (
                    <div key={exchange.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCurrencyFlag(exchange.fromCurrency)}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <span className="text-lg">{getCurrencyFlag(exchange.toCurrency)}</span>
                        </div>
                        <Badge 
                          variant={exchange.status === 'completed' ? 'success' : exchange.status === 'failed' ? 'danger' : 'warning'}
                          size="sm"
                        >
                          {exchange.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">From:</span>
                        <span className="font-semibold">{exchange.fromAmount.toFixed(2)} {exchange.fromCurrency}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">To:</span>
                        <span className="font-semibold">{exchange.toAmount.toFixed(6)} {exchange.toCurrency}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Rate:</span>
                        <span className="text-gray-900">{exchange.rate.toFixed(6)}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(exchange.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Repeat className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No exchange history yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Supported Currencies */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Currencies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {currencies.map(currency => (
              <div key={currency} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">{getCurrencyFlag(currency)}</span>
                <div>
                  <p className="font-semibold text-gray-900">{currency}</p>
                  <p className="text-xs text-gray-500">Available</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
