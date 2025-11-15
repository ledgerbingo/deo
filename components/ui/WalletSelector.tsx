'use client'

import { useState } from 'react'
import { ChevronDown, Wallet as WalletIcon, Plus, Check } from 'lucide-react'
import { useWallet } from '@/lib/context/WalletContext'
import { Button } from './Button'

export default function WalletSelector() {
  const { wallets, activeWallet, setActiveWallet, createWallet } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateWallet = async () => {
    if (wallets.length >= 5) {
      alert('Maximum of 5 wallets reached')
      return
    }
    
    setIsCreating(true)
    try {
      await createWallet()
      setIsOpen(false)
    } catch (error) {
      alert('Failed to create wallet')
    } finally {
      setIsCreating(false)
    }
  }

  const handleSelectWallet = (id: string) => {
    setActiveWallet(id)
    setIsOpen(false)
  }

  if (!activeWallet && wallets.length === 0) {
    return (
      <Button
        onClick={handleCreateWallet}
        disabled={isCreating}
        variant="primary"
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        {isCreating ? 'Creating...' : 'Create Wallet'}
      </Button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
      >
        <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${activeWallet?.color || 'from-gray-400 to-gray-600'}`}></div>
        <span className="font-medium text-gray-900">{activeWallet?.name || 'Select Wallet'}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="p-2">
              <div className="text-xs text-gray-500 uppercase font-semibold px-3 py-2">
                Your Wallets ({wallets.length}/5)
              </div>
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleSelectWallet(wallet.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors ${
                    activeWallet?.id === wallet.id ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${wallet.color} flex items-center justify-center flex-shrink-0`}>
                    <WalletIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{wallet.name}</p>
                      {activeWallet?.id === wallet.id && (
                        <Check className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-mono">
                      {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            
            {wallets.length < 5 && (
              <div className="border-t border-gray-200 p-2">
                <button
                  onClick={handleCreateWallet}
                  disabled={isCreating}
                  className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-purple-600 font-medium disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  {isCreating ? 'Creating...' : 'Create New Wallet'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
