'use client'

import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, X } from 'lucide-react'
import type { Asset } from '@/modules/investment/types'

interface AssetChartProps {
  asset: Asset
  onClose: () => void
}

interface ChartDataPoint {
  timestamp: number
  date: string
  price: number
}

const TIME_PERIODS = [
  { label: '1D', value: '1' },
  { label: '1W', value: '7' },
  { label: '1M', value: '30' },
  { label: '3M', value: '90' },
  { label: '1Y', value: '365' },
] as const

export function AssetChart({ asset, onClose }: AssetChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('7')
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  const isPositive = asset.changePercentage >= 0

  useEffect(() => {
    loadChartData()
  }, [asset.symbol, selectedPeriod])

  const loadChartData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/prices/chart?symbol=${asset.symbol}&period=${selectedPeriod}`)
      const data = await response.json()
      
      if (data.data) {
        setChartData(data.data)
      }
    } catch (error) {
      console.error('Error loading chart data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const displayPrice = hoveredPrice !== null ? hoveredPrice : asset.currentPrice
  const displayDate = hoveredDate || 'Now'

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {asset.symbol.slice(0, 2)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{asset.name}</h2>
                <p className="text-gray-500 text-sm">{asset.symbol} • {asset.type}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Price Display */}
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {formatPrice(displayPrice)}
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-semibold">
                  {isPositive ? '+' : ''}{asset.changePercentage.toFixed(2)}%
                </span>
              </div>
              <span className="text-sm text-gray-500">{displayDate}</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="p-6 pt-2">
          {isLoading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Time Period Selector */}
              <div className="flex gap-2 mb-6">
                {TIME_PERIODS.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedPeriod(period.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedPeriod === period.value
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>

              {/* Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    onMouseMove={(e: any) => {
                      if (e.activePayload && e.activePayload[0]) {
                        setHoveredPrice(e.activePayload[0].payload.price)
                        setHoveredDate(formatDate(e.activePayload[0].payload.date))
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredPrice(null)
                      setHoveredDate(null)
                    }}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id={`gradient-${asset.symbol}`} x1="0" y1="0" x2="0" y2="1">
                        <stop 
                          offset="0%" 
                          stopColor={isPositive ? '#10b981' : '#ef4444'} 
                          stopOpacity={0.3} 
                        />
                        <stop 
                          offset="100%" 
                          stopColor={isPositive ? '#10b981' : '#ef4444'} 
                          stopOpacity={0} 
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="timestamp"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(timestamp) => formatDate(new Date(timestamp).toISOString())}
                      stroke="#9ca3af"
                      style={{ fontSize: '12px' }}
                      tick={{ fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={['dataMin - 10', 'dataMax + 10']}
                      tickFormatter={(value) => `$${value.toFixed(0)}`}
                      stroke="#9ca3af"
                      style={{ fontSize: '12px' }}
                      tick={{ fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={() => null} // Hide default tooltip since we show data in header
                      cursor={{
                        stroke: isPositive ? '#10b981' : '#ef4444',
                        strokeWidth: 2,
                        strokeDasharray: '3 3',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={isPositive ? '#10b981' : '#ef4444'}
                      strokeWidth={2.5}
                      fill={`url(#gradient-${asset.symbol})`}
                      animationDuration={500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {/* Asset Info */}
        <div className="p-6 pt-4 bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Current Price</p>
              <p className="text-lg font-bold text-gray-900">{formatPrice(asset.currentPrice)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">24h Change</p>
              <p className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{asset.changePercentage.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Asset Type</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{asset.type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Symbol</p>
              <p className="text-lg font-semibold text-gray-900">{asset.symbol}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
