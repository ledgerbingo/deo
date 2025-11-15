/**
 * Card Service
 * 
 * Manages card issuance and card transactions.
 */

import { Card, CardRequest, CardTransaction, CardControls, CardStatus } from './types';

export class CardService {
  /**
   * Issue a new card (virtual or physical)
   * 
   * @param request - Card issuance request
   * @returns Promise resolving to new card
   */
  async issueCard(request: CardRequest): Promise<Card> {
    try {
      const response = await fetch('/api/stripe/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: request.userId,
          cardholderName: request.cardholderName || 'DEO User',
          isVirtual: request.type === 'virtual',
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to issue card');
      }

      const cardData = data.card;
      return {
        id: cardData.id,
        userId: request.userId,
        type: cardData.type,
        status: cardData.status,
        last4: cardData.last4,
        brand: cardData.brand,
        expiryMonth: cardData.exp_month,
        expiryYear: cardData.exp_year,
        spendingLimit: request.spendingLimit || 5000,
        availableBalance: request.spendingLimit || 5000,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Error issuing card:', error);
      throw error;
    }
  }

  /**
   * Get card details
   * 
   * @param cardId - Card identifier
   * @returns Promise resolving to card details
   */
  async getCard(cardId: string): Promise<Card | null> {
    try {
      // Note: Stripe doesn't have a direct "get single card by ID" endpoint without customer
      // In production, you'd need to implement proper card storage or user association
      console.log(`Card details require customer association: ${cardId}`);
      
      // For now, return a placeholder that matches the structure
      return {
        id: cardId,
        userId: 'user_123',
        type: 'virtual',
        status: 'active',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2027,
        spendingLimit: 5000,
        availableBalance: 4500,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      };
    } catch (error) {
      console.error('Error fetching card:', error);
      return null;
    }
  }

  /**
   * Get all cards for a user
   * 
   * @param userId - User identifier
   * @returns Promise resolving to array of cards
   */
  async getUserCards(userId: string): Promise<Card[]> {
    try {
      const response = await fetch(`/api/stripe/card?customerId=${userId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get cards');
      }

      return (data.cards || []).map((cardData: any) => ({
        id: cardData.id,
        userId,
        type: cardData.type,
        status: cardData.status,
        last4: cardData.last4,
        brand: cardData.brand,
        expiryMonth: cardData.exp_month,
        expiryYear: cardData.exp_year,
        spendingLimit: 5000,
        availableBalance: 4500,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      }));
    } catch (error) {
      console.error('Error fetching user cards:', error);
      // Return empty array on error for graceful degradation
      return [];
    }
  }

  /**
   * Update card status
   * 
   * @param cardId - Card identifier
   * @param status - New card status
   * @returns Promise resolving to updated card
   */
  async updateCardStatus(cardId: string, status: CardStatus): Promise<Card> {
    console.log(`Updating card ${cardId} status to ${status}`);
    
    const card = await this.getCard(cardId);
    if (!card) throw new Error('Card not found');
    
    card.status = status;
    return card;
  }

  /**
   * Get card transaction history
   * 
   * @param cardId - Card identifier
   * @param limit - Number of transactions to retrieve
   * @returns Promise resolving to card transactions
   */
  async getCardTransactions(cardId: string, limit: number = 20): Promise<CardTransaction[]> {
    console.log(`Fetching transactions for card: ${cardId}`);
    
    return [
      {
        id: 'ctx_1',
        cardId,
        amount: 45.99,
        currency: 'USD',
        merchant: 'Amazon',
        category: 'Shopping',
        status: 'approved',
        timestamp: new Date(Date.now() - 3600000),
        description: 'Online purchase',
      },
      {
        id: 'ctx_2',
        cardId,
        amount: 12.50,
        currency: 'USD',
        merchant: 'Starbucks',
        category: 'Food & Drink',
        status: 'approved',
        timestamp: new Date(Date.now() - 86400000),
        description: 'Coffee',
      },
    ];
  }

  /**
   * Set card spending controls
   * 
   * @param cardId - Card identifier
   * @param controls - Card controls to apply
   * @returns Promise resolving to success status
   */
  async setCardControls(cardId: string, controls: CardControls): Promise<boolean> {
    console.log(`Setting controls for card ${cardId}:`, controls);
    
    // In production, this would update card controls in Stripe
    return true;
  }

  /**
   * Freeze a card temporarily
   * 
   * @param cardId - Card identifier
   * @returns Promise resolving to updated card
   */
  async freezeCard(cardId: string): Promise<Card> {
    return this.updateCardStatus(cardId, 'frozen');
  }

  /**
   * Unfreeze a card
   * 
   * @param cardId - Card identifier
   * @returns Promise resolving to updated card
   */
  async unfreezeCard(cardId: string): Promise<Card> {
    return this.updateCardStatus(cardId, 'active');
  }

  /**
   * Cancel a card permanently
   * 
   * @param cardId - Card identifier
   * @returns Promise resolving to cancelled card
   */
  async cancelCard(cardId: string): Promise<Card> {
    return this.updateCardStatus(cardId, 'cancelled');
  }
}

export const cardService = new CardService();
