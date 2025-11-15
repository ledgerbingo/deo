/**
 * Currency Icon Component
 * 
 * Displays professional currency icons with circular badges
 * Inspired by Circle StableFX design patterns
 */

import React from 'react'
import { DollarSign, Euro, PoundSterling, Coins } from 'lucide-react'

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'USDC' | 'EURC' | 'BTC' | 'ETH'

interface CurrencyIconProps {
  currency: Currency
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showBadge?: boolean
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
  xl: 'w-20 h-20 text-lg',
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
}

export function CurrencyIcon({ 
  currency, 
  size = 'md', 
  className = '',
  showBadge = true 
}: CurrencyIconProps) {
  const getCurrencyConfig = (curr: Currency) => {
    const configs = {
      USD: {
        gradient: 'from-green-400 to-green-600',
        icon: DollarSign,
        label: 'US Dollar',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
      },
      USDC: {
        gradient: 'from-blue-400 to-blue-600',
        icon: DollarSign,
        label: 'USD Coin',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
      },
      EUR: {
        gradient: 'from-indigo-400 to-indigo-600',
        icon: Euro,
        label: 'Euro',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700',
      },
      EURC: {
        gradient: 'from-purple-400 to-purple-600',
        icon: Euro,
        label: 'Euro Coin',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
      },
      GBP: {
        gradient: 'from-violet-400 to-violet-600',
        icon: PoundSterling,
        label: 'British Pound',
        bgColor: 'bg-violet-50',
        textColor: 'text-violet-700',
      },
      JPY: {
        gradient: 'from-rose-400 to-rose-600',
        icon: Coins,
        label: 'Japanese Yen',
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-700',
      },
      BTC: {
        gradient: 'from-orange-400 to-orange-600',
        icon: Coins,
        label: 'Bitcoin',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
      },
      ETH: {
        gradient: 'from-cyan-400 to-cyan-600',
        icon: Coins,
        label: 'Ethereum',
        bgColor: 'bg-cyan-50',
        textColor: 'text-cyan-700',
      },
    }
    return configs[curr]
  }

  const config = getCurrencyConfig(currency)
  const Icon = config.icon

  if (!showBadge) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg ring-2 ring-white`}>
          <Icon className={`${iconSizes[size]} text-white`} />
        </div>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg ring-2 ring-white`}>
        <Icon className={`${iconSizes[size]} text-white`} />
      </div>
      <div>
        <div className="font-bold text-gray-900">{currency}</div>
        <div className="text-xs text-gray-500">{config.label}</div>
      </div>
    </div>
  )
}

export function CurrencyBadge({ 
  currency, 
  size = 'md',
  className = '' 
}: CurrencyIconProps) {
  const config = getCurrencyConfig(currency)
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${config.bgColor} ${className}`}>
      <CurrencyIcon currency={currency} size="sm" showBadge={false} />
      <span className={`font-semibold ${config.textColor}`}>{currency}</span>
    </div>
  )
}

function getCurrencyConfig(curr: Currency) {
  const configs = {
    USD: {
      gradient: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    USDC: {
      gradient: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    EUR: {
      gradient: 'from-indigo-400 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
    },
    EURC: {
      gradient: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    GBP: {
      gradient: 'from-violet-400 to-violet-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-700',
    },
    JPY: {
      gradient: 'from-rose-400 to-rose-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-700',
    },
    BTC: {
      gradient: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    ETH: {
      gradient: 'from-cyan-400 to-cyan-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
    },
  }
  return configs[curr]
}
