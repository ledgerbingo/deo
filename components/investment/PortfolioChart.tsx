'use client'

import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

interface PortfolioChartProps {
  userId: string
  totalValue: number
  totalReturn: number
  returnPercentage: number
}

interface ChartDataPoint {
  timestamp: number
  date: string
  value: number
}

const TIME_PERIODS = [
  { label: '1W', value: '7' },
  { label: '1M', value: '30' },
  { label: '3M', value: '90' },
  { label: '6M', value: '180' },
  { label: '1Y', value: '365' },
] as const

export function PortfolioChart({ userId, totalValue, totalReturn, returnPercentage }: PortfolioChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  const isPositive = returnPercentage >= 0

  useEffect(() => {
    loadChartData()
  }, [userId, selectedPeriod])

  const loadChartData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/portfolio/history?userId=${userId}&period=${selectedPeriod}`)
      const data = await response.json()
      
      if (data.data) {
        setChartData(data.data)
      }
    } catch (error) {
      console.error('Error loading portfolio chart data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatValue = (value: number) => {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const displayValue = hoveredValue !== null ? hoveredValue : totalValue
  const displayDate = hoveredDate || 'Current'

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Portfolio Performance</h3>
          <button
            onClick={loadChartData}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {/* Value Display */}
        <div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {formatValue(displayValue)}
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
                {isPositive ? '+' : ''}{returnPercentage.toFixed(2)}%
              </span>
            </div>
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{formatValue(totalReturn)}
            </span>
            <span className="text-sm text-gray-500">• {displayDate}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
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
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
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
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                onMouseMove={(e: any) => {
                  if (e.activePayload && e.activePayload[0]) {
                    setHoveredValue(e.activePayload[0].payload.value)
                    setHoveredDate(formatDate(e.activePayload[0].payload.date))
                  }
                }}
                onMouseLeave={() => {
                  setHoveredValue(null)
                  setHoveredDate(null)
                }}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
                  domain={['dataMin - 1000', 'dataMax + 1000']}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
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
                  dataKey="value"
                  stroke={isPositive ? '#10b981' : '#ef4444'}
                  strokeWidth={2.5}
                  fill="url(#portfolioGradient)"
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
