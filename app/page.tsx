'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Wallet, CreditCard, Shield, ArrowRight, DollarSign, Lock, TrendingUp } from 'lucide-react'

export default function Home() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">DEO Finance</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/dashboard" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
            <span className="block">Next-Gen Finance</span>
            <span className="block text-blue-600">Powered by USDC & ARC</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Experience comprehensive financial services on Circle's ARC blockchain. 
            USDC stablecoin wallets, Stripe-powered KYC, and instant card issuance.
          </p>
          <div className="mt-10 max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center">
                Start <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-4">
              <Wallet className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">USDC Wallet</h3>
            <p className="text-gray-600">
              Account abstraction wallet with USDC stablecoin support on Circle's ARC blockchain testnet. 
              Secure, fast, and user-friendly.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white mb-4">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Card Issuance</h3>
            <p className="text-gray-600">
              Instant virtual and physical card issuance powered by Stripe. 
              Spend your USDC anywhere with seamless conversion.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Identity</h3>
            <p className="text-gray-600">
              Complete KYC verification through Stripe Identity. 
              Fast, secure, and compliant identity verification.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Enterprise-grade security with account abstraction. 
              Your keys, your crypto, your control.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-600 text-white mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Low Fees</h3>
            <p className="text-gray-600">
              Enjoy minimal transaction fees on the ARC blockchain. 
              More value retained in your wallet.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white mb-4">
              <DollarSign className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Stable Value</h3>
            <p className="text-gray-600">
              USDC maintains a 1:1 peg with the US dollar. 
              No volatility, just stable digital currency.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-blue-600 rounded-2xl shadow-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Financial Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join DEO Finance today and experience the future of digital finance
          </p>
          <Link href="/dashboard" className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Launch Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            © 2024 DEO Finance. Built on Circle's ARC Blockchain. Powered by Stripe.
          </p>
        </div>
      </footer>
    </div>
  )
}
