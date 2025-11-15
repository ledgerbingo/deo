'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Wallet, CreditCard, Shield, ArrowRight, DollarSign, Lock, TrendingUp, Zap, Globe, Award, Smartphone } from 'lucide-react'

export default function Home() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full nubank-gradient flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">DEO</span>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 text-sm font-medium transition-colors">
                For you
              </Link>
              <Link href="/card" className="text-gray-600 hover:text-purple-600 text-sm font-medium transition-colors">
                Cards
              </Link>
              <Link href="/exchange" className="text-gray-600 hover:text-purple-600 text-sm font-medium transition-colors">
                Services
              </Link>
              <Link href="/dashboard" className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-lg">
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              The financial service
              <span className="block text-purple-600">made for you</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Simple, secure, and 100% digital. Your USDC wallet, cards, and complete financial control in one place.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/dashboard" className="bg-purple-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-purple-700 transition-all hover:shadow-xl inline-flex items-center group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Feature 1 */}
              <div className="bg-white rounded-3xl p-8 hover-lift">
                <div className="w-14 h-14 rounded-2xl nubank-gradient flex items-center justify-center mb-6">
                  <Wallet className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">USDC Wallet</h3>
                <p className="text-gray-600 leading-relaxed">
                  Account abstraction wallet with USDC stablecoin on Circle's ARC blockchain. Secure, fast, and user-friendly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-3xl p-8 hover-lift">
                <div className="w-14 h-14 rounded-2xl nubank-gradient flex items-center justify-center mb-6">
                  <CreditCard className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Digital Cards</h3>
                <p className="text-gray-600 leading-relaxed">
                  Instant virtual and physical card issuance. Spend your USDC anywhere with seamless conversion.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-3xl p-8 hover-lift">
                <div className="w-14 h-14 rounded-2xl nubank-gradient flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Verified</h3>
                <p className="text-gray-600 leading-relaxed">
                  Complete KYC verification through Stripe Identity. Enterprise-grade security for your peace of mind.
                </p>
              </div>
            </div>

            {/* Additional Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Your Control</h4>
                <p className="text-gray-600">Your keys, your crypto, complete control</p>
              </div>

              <div className="text-center p-8">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Low Fees</h4>
                <p className="text-gray-600">Minimal transaction fees on ARC blockchain</p>
              </div>

              <div className="text-center p-8">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Stable Value</h4>
                <p className="text-gray-600">USDC maintains 1:1 peg with USD</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="nubank-gradient rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to take control of your finances?
                </h2>
                <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
                  Join thousands who already manage their money with DEO
                </p>
                <Link href="/dashboard" className="inline-flex items-center bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all hover:shadow-xl text-lg">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-10 h-10 rounded-full nubank-gradient flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">DEO</span>
            </div>
            <div className="flex space-x-8 text-sm text-gray-600">
              <Link href="/dashboard" className="hover:text-purple-600 transition-colors">About</Link>
              <Link href="/support" className="hover:text-purple-600 transition-colors">Support</Link>
              <Link href="/dashboard" className="hover:text-purple-600 transition-colors">Careers</Link>
              <Link href="/dashboard" className="hover:text-purple-600 transition-colors">Blog</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              © 2024 DEO Finance. Built on Circle's ARC Blockchain. Powered by Stripe.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
