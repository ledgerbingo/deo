/**
 * Currency Icon Component
 * 
 * Displays professional currency icons with circular badges
 * Updated to support Circle StableFX stablecoins with their actual icons
 */

import React from 'react'
import { DollarSign, Euro, Coins } from 'lucide-react'
import { STABLECOINS } from '@/modules/exchange/stablecoins'
import type { Currency } from '@/modules/exchange/types'

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
      USDC: {
        gradient: 'from-blue-400 to-blue-600',
        icon: DollarSign,
        label: 'USD Coin',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
      },
      EURC: {
        gradient: 'from-purple-400 to-purple-600',
        icon: Euro,
        label: 'Euro Coin',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
      },
      AUDF: {
        gradient: 'from-emerald-400 to-emerald-600',
        icon: Coins,
        label: 'Australian Dollar Forte',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
      },
      BRLA: {
        gradient: 'from-green-400 to-green-600',
        icon: Coins,
        label: 'Brazilian Real Asset',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
      },
      JPYC: {
        gradient: 'from-rose-400 to-rose-600',
        icon: Coins,
        label: 'JPY Coin',
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-700',
      },
      KRW1: {
        gradient: 'from-indigo-400 to-indigo-600',
        icon: Coins,
        label: 'Korean Won 1',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700',
      },
      MXNB: {
        gradient: 'from-orange-400 to-orange-600',
        icon: Coins,
        label: 'Mexican Peso Bitso',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
      },
      PHPC: {
        gradient: 'from-cyan-400 to-cyan-600',
        icon: Coins,
        label: 'Philippine Peso Coin',
        bgColor: 'bg-cyan-50',
        textColor: 'text-cyan-700',
      },
      QCAD: {
        gradient: 'from-red-400 to-red-600',
        icon: Coins,
        label: 'QCAD Stablecoin',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
      },
      ZARU: {
        gradient: 'from-amber-400 to-amber-600',
        icon: Coins,
        label: 'South African Rand Universal',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
      },
    }
    return configs[curr]
  }

  const config = getCurrencyConfig(currency)
  const stablecoinInfo = STABLECOINS[currency]
  const Icon = config.icon

  // Use actual stablecoin icon if available
  if (stablecoinInfo?.icon && !showBadge) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden bg-white shadow-lg ring-2 ring-gray-100`}>
          <img 
            src={stablecoinInfo.icon} 
            alt={stablecoinInfo.name}
            className={`${sizeClasses[size]} object-contain p-1`}
            onError={(e) => {
              // Fallback to gradient icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.className = `${sizeClasses[size]} rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg ring-2 ring-white`;
                const iconElement = document.createElement('div');
                iconElement.className = `${iconSizes[size]} text-white`;
                parent.appendChild(iconElement);
              }
            }}
          />
        </div>
      </div>
    )
  }

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
      {stablecoinInfo?.icon ? (
        <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden bg-white shadow-lg ring-2 ring-gray-100`}>
          <img 
            src={stablecoinInfo.icon} 
            alt={stablecoinInfo.name}
            className={`${sizeClasses[size]} object-contain p-1`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg ring-2 ring-white`}>
          <Icon className={`${iconSizes[size]} text-white`} />
        </div>
      )}
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
    USDC: {
      gradient: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    EURC: {
      gradient: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    AUDF: {
      gradient: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    BRLA: {
      gradient: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    JPYC: {
      gradient: 'from-rose-400 to-rose-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-700',
    },
    KRW1: {
      gradient: 'from-indigo-400 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
    },
    MXNB: {
      gradient: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    PHPC: {
      gradient: 'from-cyan-400 to-cyan-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
    },
    QCAD: {
      gradient: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
    ZARU: {
      gradient: 'from-amber-400 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
  }
  return configs[curr]
}
