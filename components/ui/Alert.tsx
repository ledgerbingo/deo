'use client'

import React from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  children: React.ReactNode
  onClose?: () => void
  className?: string
}

export function Alert({ 
  variant = 'info', 
  title, 
  children, 
  onClose,
  className = '' 
}: AlertProps) {
  const variants = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-600',
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600',
    },
  }

  const config = variants[variant]
  const Icon = config.icon

  return (
    <div 
      className={`
        ${config.bg} border rounded-lg p-4
        animate-in fade-in slide-in-from-top-2 duration-300
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 ${config.iconColor} flex-shrink-0`} />
        <div className="flex-1">
          {title && (
            <h4 className={`font-semibold ${config.text} mb-1`}>{title}</h4>
          )}
          <div className={`text-sm ${config.text}`}>{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors ${config.iconColor}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
