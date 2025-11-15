/**
 * Card Module Types
 * 
 * Defines types for card operations and card transactions.
 */

export type CardType = 'virtual' | 'physical';
export type CardStatus = 'active' | 'inactive' | 'frozen' | 'cancelled';

export interface Card {
  id: string;
  userId: string;
  type: CardType;
  status: CardStatus;
  last4: string;
  brand: 'visa' | 'mastercard';
  expiryMonth: number;
  expiryYear: number;
  spendingLimit: number;
  availableBalance: number;
  createdAt: Date;
  isDemo?: boolean; // Indicates if this is a demo card
}

export interface CardTransaction {
  id: string;
  cardId: string;
  amount: number;
  currency: string;
  merchant: string;
  category: string;
  status: 'approved' | 'declined' | 'pending';
  timestamp: Date;
  description?: string;
}

export interface CardRequest {
  userId: string;
  type: CardType;
  spendingLimit: number;
  cardholderName?: string;
}

export interface CardControls {
  dailyLimit: number;
  monthlyLimit: number;
  allowedCategories?: string[];
  blockedMerchants?: string[];
}
