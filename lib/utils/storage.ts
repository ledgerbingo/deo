/**
 * Local storage utility for wallet management
 */

export interface Wallet {
  id: string
  address: string
  name: string
  color: string
  createdAt: number
  privateKey?: string
  mnemonic?: string
}

const STORAGE_KEY = 'deo_wallets'
const ACTIVE_WALLET_KEY = 'deo_active_wallet'

/**
 * Get all wallets from local storage
 */
export function getWallets(): Wallet[] {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading wallets from storage:', error)
    return []
  }
}

/**
 * Save wallets to local storage
 */
export function saveWallets(wallets: Wallet[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets))
  } catch (error) {
    console.error('Error saving wallets to storage:', error)
  }
}

/**
 * Add a new wallet
 */
export function addWallet(wallet: Wallet): void {
  const wallets = getWallets()
  wallets.push(wallet)
  saveWallets(wallets)
}

/**
 * Update an existing wallet
 */
export function updateWallet(id: string, updates: Partial<Wallet>): void {
  const wallets = getWallets()
  const index = wallets.findIndex(w => w.id === id)
  
  if (index !== -1) {
    wallets[index] = { ...wallets[index], ...updates }
    saveWallets(wallets)
  }
}

/**
 * Delete a wallet
 */
export function deleteWallet(id: string): void {
  const wallets = getWallets()
  const filtered = wallets.filter(w => w.id !== id)
  saveWallets(filtered)
  
  // If deleted wallet was active, set first wallet as active
  const activeWallet = getActiveWallet()
  if (activeWallet?.id === id && filtered.length > 0) {
    setActiveWallet(filtered[0].id)
  }
}

/**
 * Get active wallet ID
 */
export function getActiveWalletId(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    return localStorage.getItem(ACTIVE_WALLET_KEY)
  } catch (error) {
    console.error('Error reading active wallet from storage:', error)
    return null
  }
}

/**
 * Set active wallet
 */
export function setActiveWallet(id: string): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(ACTIVE_WALLET_KEY, id)
  } catch (error) {
    console.error('Error saving active wallet to storage:', error)
  }
}

/**
 * Get active wallet
 */
export function getActiveWallet(): Wallet | null {
  const activeId = getActiveWalletId()
  if (!activeId) return null
  
  const wallets = getWallets()
  return wallets.find(w => w.id === activeId) || null
}

/**
 * Generate default wallet colors
 */
export const WALLET_COLORS = [
  'from-purple-600 to-blue-600',
  'from-blue-600 to-cyan-600',
  'from-green-600 to-teal-600',
  'from-orange-600 to-red-600',
  'from-pink-600 to-purple-600',
]

/**
 * Get color for wallet index
 */
export function getWalletColor(index: number): string {
  return WALLET_COLORS[index % WALLET_COLORS.length]
}
