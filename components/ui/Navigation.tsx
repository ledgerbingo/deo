'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DollarSign, Menu, X, User, CreditCard, TrendingUp, Repeat, HelpCircle, LayoutDashboard } from 'lucide-react'

const navItems = [
  { href: '/account', label: 'Account', icon: User },
  { href: '/card', label: 'Cards', icon: CreditCard },
  { href: '/investment', label: 'Invest', icon: TrendingUp },
  { href: '/exchange', label: 'Exchange', icon: Repeat },
  { href: '/support', label: 'Support', icon: HelpCircle },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="w-10 h-10 rounded-full nubank-gradient flex items-center justify-center transform transition-transform group-hover:scale-105">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900 tracking-tight">DEO</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${
                      isActive(item.href)
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex">
            <Link
              href="/dashboard"
              className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                      ${
                        isActive(item.href)
                          ? 'bg-purple-50 text-purple-700'
                          : 'text-gray-600 hover:bg-purple-50/50 hover:text-purple-600'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full bg-purple-600 text-white text-center px-6 py-3 rounded-full text-sm font-semibold hover:bg-purple-700 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
