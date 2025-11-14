'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DollarSign, CheckCircle, Circle, Shield, Wallet, Sparkles, ArrowRight } from 'lucide-react'

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to DEO Finance',
      description: 'Your gateway to modern financial services',
      completed: true,
    },
    {
      id: 'kyc',
      title: 'Identity Verification',
      description: 'Complete KYC to unlock all features',
      completed: false,
    },
    {
      id: 'wallet',
      title: 'Create Wallet',
      description: 'Set up your USDC wallet',
      completed: false,
    },
    {
      id: 'explore',
      title: 'Explore Features',
      description: 'Discover what you can do',
      completed: false,
    },
  ]

  const features = [
    {
      icon: '💰',
      title: 'USDC Wallet',
      description: 'Secure digital wallet with USDC stablecoin on Circle ARC blockchain',
    },
    {
      icon: '💳',
      title: 'DEO Card',
      description: 'Virtual and physical cards for everyday spending',
    },
    {
      icon: '📈',
      title: 'Investment Portfolio',
      description: 'Grow your wealth with crypto and traditional assets',
    },
    {
      icon: '🔄',
      title: 'Currency Exchange',
      description: 'Exchange between multiple currencies at great rates',
    },
  ]

  const handleStartKYC = () => {
    alert('Redirecting to Stripe Identity for KYC verification...')
  }

  const handleCreateWallet = () => {
    alert('Creating your USDC wallet...')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">DEO Finance</span>
          </Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.completed
                        ? 'bg-green-600 text-white'
                        : currentStep === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900 text-center">
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-6 left-1/2 w-full h-1 ${
                      step.completed ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Welcome Section */}
        {currentStep === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to DEO Finance
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience the future of digital finance with USDC, blockchain technology, and modern banking services.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {features.map((feature) => (
                <div key={feature.title} className="bg-blue-50 rounded-lg p-6">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Get Started <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* KYC Step */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <Shield className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Identity Verification
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Complete your KYC verification to unlock all features of DEO Finance.
                This process is secure and powered by Stripe Identity.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">What you'll need:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Government-issued photo ID (passport, driver's license, or ID card)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>A device with a camera for document upload</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>5-10 minutes to complete the process</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCurrentStep(0)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleStartKYC}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Start Verification
              </button>
            </div>
          </div>
        )}

        {/* Wallet Step */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <Wallet className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Create Your Wallet
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Set up your USDC wallet on the Circle ARC blockchain. Your wallet will be secured with account abstraction technology.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Your wallet includes:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>USDC stablecoin support (1:1 with USD)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Low transaction fees on ARC blockchain</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Account abstraction for enhanced security</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Instant transfers and real-time balance</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleCreateWallet}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create Wallet
              </button>
            </div>
          </div>
        )}

        {/* Skip Link */}
        <div className="text-center mt-8">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            Skip onboarding and go to dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
