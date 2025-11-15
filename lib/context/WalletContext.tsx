'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Wallet, getWallets, getActiveWallet, setActiveWallet as setActiveWalletStorage, addWallet, updateWallet as updateWalletStorage, deleteWallet as deleteWalletStorage, getWalletColor } from '@/lib/utils/storage'

interface WalletContextType {
  wallets: Wallet[]
  activeWallet: Wallet | null
  isLoading: boolean
  setActiveWallet: (id: string) => void
  createWallet: (name?: string) => Promise<Wallet>
  updateWallet: (id: string, updates: Partial<Wallet>) => void
  deleteWallet: (id: string) => void
  refreshWallets: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [activeWallet, setActiveWalletState] = useState<Wallet | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load wallets from storage on mount
  useEffect(() => {
    loadWallets()
  }, [])

  const loadWallets = () => {
    const storedWallets = getWallets()
    setWallets(storedWallets)
    
    let active = getActiveWallet()
    
    // If no active wallet but wallets exist, set first as active
    if (!active && storedWallets.length > 0) {
      active = storedWallets[0]
      setActiveWalletStorage(active.id)
    }
    
    setActiveWalletState(active)
    setIsLoading(false)
  }

  const handleSetActiveWallet = (id: string) => {
    const wallet = wallets.find(w => w.id === id)
    if (wallet) {
      setActiveWalletStorage(id)
      setActiveWalletState(wallet)
    }
  }

  const createWallet = async (name?: string): Promise<Wallet> => {
    try {
      // Call API to create wallet
      const response = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'demo-user' })
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error('Failed to create wallet')
      }
      
      const walletIndex = wallets.length
      const newWallet: Wallet = {
        id: Math.random().toString(36).substring(2, 15),
        address: data.wallet.address,
        name: name || `Wallet ${walletIndex + 1}`,
        color: getWalletColor(walletIndex),
        createdAt: Date.now(),
        mnemonic: data.wallet.mnemonic,
      }
      
      addWallet(newWallet)
      
      // Refresh wallets
      loadWallets()
      
      // Set as active if it's the first wallet
      if (wallets.length === 0) {
        handleSetActiveWallet(newWallet.id)
      }
      
      return newWallet
    } catch (error) {
      console.error('Error creating wallet:', error)
      throw error
    }
  }

  const handleUpdateWallet = (id: string, updates: Partial<Wallet>) => {
    updateWalletStorage(id, updates)
    loadWallets()
  }

  const handleDeleteWallet = (id: string) => {
    deleteWalletStorage(id)
    loadWallets()
  }

  const refreshWallets = () => {
    loadWallets()
  }

  return (
    <WalletContext.Provider
      value={{
        wallets,
        activeWallet,
        isLoading,
        setActiveWallet: handleSetActiveWallet,
        createWallet,
        updateWallet: handleUpdateWallet,
        deleteWallet: handleDeleteWallet,
        refreshWallets,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
