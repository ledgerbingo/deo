import type { Metadata } from 'next'
import './globals.css'
import { WalletProvider } from '@/lib/context/WalletContext'

export const metadata: Metadata = {
  title: 'DEO Finance - USDC Stablecoin Services on ARC Blockchain',
  description: 'Comprehensive financial service on Circle\'s ARC blockchain with USDC and Stripe integration',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
