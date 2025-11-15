import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`
        bg-gray-200 animate-pulse
        ${variants[variant]}
        ${className}
      `}
      style={style}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <Skeleton variant="text" className="w-1/3 h-6" />
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-2/3" />
      <div className="flex gap-4 mt-4">
        <Skeleton variant="rectangular" className="flex-1 h-10" />
        <Skeleton variant="rectangular" className="flex-1 h-10" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton variant="text" className="w-1/4 h-8" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rectangular" className="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton variant="rectangular" className="lg:col-span-2 h-64" />
        <Skeleton variant="rectangular" className="h-64" />
      </div>
    </div>
  )
}
