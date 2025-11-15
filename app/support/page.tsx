'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DollarSign, HelpCircle, MessageCircle, Search, ArrowLeft, Book, FileText, Mail, Phone } from 'lucide-react'
import { Navigation } from '@/components/ui'

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketDescription, setTicketDescription] = useState('')
  const [ticketCategory, setTicketCategory] = useState('general')

  const faqs = [
    {
      question: 'What is DEO Finance?',
      answer: "DEO Finance is a comprehensive financial service platform built on Circle's ARC blockchain, offering USDC wallets, card issuance, investments, and more.",
      category: 'general',
    },
    {
      question: 'How long does KYC verification take?',
      answer: 'KYC verification typically takes 5-10 minutes to complete once you submit your documents.',
      category: 'kyc',
    },
    {
      question: 'What currencies are supported?',
      answer: 'We support USDC on the Circle ARC blockchain, with plans to add more currencies soon.',
      category: 'wallet',
    },
    {
      question: 'Are there any fees?',
      answer: 'We charge minimal transaction fees. USDC transfers have low gas fees, and card transactions may have standard payment processing fees.',
      category: 'fees',
    },
    {
      question: 'How do I request a DEO Card?',
      answer: 'Complete KYC verification first, then navigate to the Card section in your dashboard and click "Request Card".',
      category: 'card',
    },
    {
      question: 'Is my wallet secure?',
      answer: 'Yes, your wallet uses account abstraction technology and is secured with industry-standard encryption.',
      category: 'security',
    },
  ]

  const helpArticles = [
    {
      title: 'Getting Started with DEO Finance',
      description: 'Learn the basics of using DEO Finance platform',
      category: 'Getting Started',
      icon: '🚀',
    },
    {
      title: 'Understanding KYC Verification',
      description: 'Complete guide to the identity verification process',
      category: 'Account',
      icon: '🔐',
    },
    {
      title: 'How to Send and Receive USDC',
      description: 'Step-by-step guide for USDC transactions',
      category: 'Wallet',
      icon: '💰',
    },
    {
      title: 'Managing Your DEO Card',
      description: 'Card features, limits, and controls',
      category: 'Card',
      icon: '💳',
    },
    {
      title: 'Investment Portfolio Basics',
      description: 'Learn about portfolio management and trading',
      category: 'Investment',
      icon: '📈',
    },
    {
      title: 'Currency Exchange Guide',
      description: 'How to exchange between different currencies',
      category: 'Exchange',
      icon: '🔄',
    },
  ]

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Support ticket submitted!\nSubject: ${ticketSubject}\nWe'll get back to you within 24 hours.`)
    setTicketSubject('')
    setTicketDescription('')
  }

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-xl text-gray-600 mb-8">
            Search our knowledge base or get in touch with our support team
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">We'll respond within 24 hours</p>
            <p className="text-blue-600 font-medium">support@deofinance.com</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Phone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">Available Mon-Fri, 9am-5pm EST</p>
            <p className="text-blue-600 font-medium">1-800-DEO-HELP</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Help Articles & FAQs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Help Articles */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Book className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Help Articles</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helpArticles.map((article) => (
                  <Link
                    key={article.title}
                    href="#"
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-600 hover:shadow-md transition-all"
                  >
                    <div className="text-3xl mb-2">{article.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{article.description}</p>
                    <span className="text-xs text-blue-600 font-medium">{article.category}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <details key={index} className="border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-gray-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
              {filteredFaqs.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No FAQs found matching your search
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Submit Ticket */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit a Ticket</h2>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="account">Account</option>
                    <option value="wallet">Wallet</option>
                    <option value="card">Card</option>
                    <option value="kyc">KYC</option>
                    <option value="transaction">Transaction</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Please provide as much detail as possible"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Submit Ticket
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Response Time:</strong> We typically respond within 24 hours.
                  For urgent issues, please use live chat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
