'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DollarSign, CheckCircle, Shield, Wallet, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button, Stepper, Badge } from '@/components/ui'

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Get started',
    },
    {
      id: 'kyc',
      title: 'Verify Identity',
      description: 'Complete KYC',
    },
    {
      id: 'wallet',
      title: 'Create Wallet',
      description: 'Setup USDC wallet',
    },
    {
      id: 'explore',
      title: 'Explore',
      description: 'Discover features',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">DEO Finance</span>
          </Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Progress Stepper */}
        <div className="mb-12">
          <Stepper 
            steps={steps} 
            currentStep={currentStep}
            onStepClick={(index) => {
              if (index < currentStep) setCurrentStep(index)
            }}
          />
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
              <Button
                onClick={() => setCurrentStep(1)}
                variant="primary"
                size="lg"
              >
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* KYC Step */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-purple-100 rounded-full mb-4">
                <Shield className="h-12 w-12 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Identity Verification
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Complete your KYC verification to unlock all features of DEO Finance.
              </p>
              <Badge variant="info" size="lg">Powered by Stripe Identity</Badge>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 mb-8 border border-purple-100">
              <h3 className="font-semibold text-gray-900 mb-4">What you'll need:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Government-issued photo ID (passport, driver's license, or ID card)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>A device with a camera for document upload</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>5-10 minutes to complete the process</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setCurrentStep(0)}
                variant="ghost"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Button>
              <Button
                onClick={handleStartKYC}
                variant="primary"
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
              >
                Start Verification
              </Button>
            </div>
          </div>
        )}

        {/* Wallet Step */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                <Wallet className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Create Your Wallet
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Set up your USDC wallet on the Circle ARC blockchain.
              </p>
              <Badge variant="info" size="lg">Account Abstraction Technology</Badge>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-4">Your wallet includes:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>USDC stablecoin support (1:1 with USD)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Low transaction fees on ARC blockchain</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Account abstraction for enhanced security</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Instant transfers and real-time balance</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setCurrentStep(1)}
                variant="ghost"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Button>
              <Button
                onClick={handleCreateWallet}
                variant="primary"
                size="lg"
              >
                Create Wallet
              </Button>
            </div>
          </div>
        )}

        {/* Skip Link */}
        <div className="text-center mt-8">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
            Skip onboarding and go to dashboard →
          </Link>
        </div>
      </main>
    </div>
  )
}
