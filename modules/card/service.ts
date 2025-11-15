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
          spendingLimit: request.spendingLimit || 5000,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        // If Stripe issuing fails, create a demo card
        console.warn('Stripe card issuance failed, creating demo card:', data.error);
        const demoCard = this.createDemoCard(request);
        this.addDemoCard(demoCard);
        return demoCard;
      }

      const cardData = data.card;
      return {
        id: cardData.id,
        userId: request.userId,
        type: cardData.type,
        status: cardData.status === 'inactive' ? 'frozen' : cardData.status,
        last4: cardData.last4,
        brand: cardData.brand,
        expiryMonth: cardData.exp_month,
        expiryYear: cardData.exp_year,
        spendingLimit: cardData.spending_limit || request.spendingLimit || 5000,
        availableBalance: cardData.spending_limit || request.spendingLimit || 5000,
        createdAt: new Date(),
        isDemo: false,
      };
    } catch (error) {
      console.error('Error issuing card, falling back to demo card:', error);
      // Fallback to demo card on any error
      const demoCard = this.createDemoCard(request);
      this.addDemoCard(demoCard);
      return demoCard;
    }
  }

  /**
   * Create a demo card when Stripe issuing fails
   * 
   * @param request - Card issuance request
   * @returns Demo card
   */
  private createDemoCard(request: CardRequest): Card {
    const now = new Date();
    const expiryYear = now.getFullYear() + 3;
    const expiryMonth = 12;
    
    // Generate a random last 4 digits for the demo card
    const last4 = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Create a deterministic ID based on user and timestamp
    const demoId = `demo_${request.userId}_${Date.now()}`;
    
    return {
      id: demoId,
      userId: request.userId,
      type: request.type,
      status: 'active',
      last4: last4,
      brand: 'visa',
      expiryMonth: expiryMonth,
      expiryYear: expiryYear,
      spendingLimit: request.spendingLimit || 5000,
      availableBalance: request.spendingLimit || 5000,
      createdAt: now,
      isDemo: true,
    };
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
        console.warn('Failed to get cards from Stripe:', data.error);
        // Return demo cards from localStorage if Stripe fails
        return this.getDemoCards(userId);
      }

      const stripeCards = (data.cards || []).map((cardData: any) => ({
        id: cardData.id,
        userId,
        type: cardData.type,
        status: cardData.status === 'inactive' ? 'frozen' : cardData.status === 'canceled' ? 'cancelled' : cardData.status,
        last4: cardData.last4,
        brand: cardData.brand,
        expiryMonth: cardData.exp_month,
        expiryYear: cardData.exp_year,
        spendingLimit: cardData.spending_limit || 5000,
        availableBalance: cardData.spending_limit || 5000,
        createdAt: new Date(),
        isDemo: false,
      }));
      
      // Combine Stripe cards with demo cards
      const demoCards = this.getDemoCards(userId);
      return [...stripeCards, ...demoCards];
    } catch (error) {
      console.error('Error fetching user cards, returning demo cards:', error);
      // Return demo cards on error for graceful degradation
      return this.getDemoCards(userId);
    }
  }

  /**
   * Get demo cards from localStorage
   * 
   * @param userId - User identifier
   * @returns Array of demo cards
   */
  private getDemoCards(userId: string): Card[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(`demoCards_${userId}`);
    if (!stored) return [];
    
    try {
      const cards = JSON.parse(stored);
      return cards.map((card: any) => ({
        ...card,
        createdAt: new Date(card.createdAt),
      }));
    } catch (error) {
      console.error('Error parsing demo cards:', error);
      return [];
    }
  }

  /**
   * Save demo cards to localStorage
   * 
   * @param userId - User identifier
   * @param cards - Array of demo cards
   */
  private saveDemoCards(userId: string, cards: Card[]): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(`demoCards_${userId}`, JSON.stringify(cards));
  }

  /**
   * Add a demo card to localStorage
   * 
   * @param card - Demo card to add
   */
  private addDemoCard(card: Card): void {
    const demoCards = this.getDemoCards(card.userId);
    demoCards.push(card);
    this.saveDemoCards(card.userId, demoCards);
  }

  /**
   * Update demo card in localStorage
   * 
   * @param cardId - Card identifier
   * @param updates - Partial card updates
   */
  private updateDemoCard(cardId: string, userId: string, updates: Partial<Card>): Card | null {
    const demoCards = this.getDemoCards(userId);
    const index = demoCards.findIndex(c => c.id === cardId);
    
    if (index === -1) return null;
    
    demoCards[index] = { ...demoCards[index], ...updates };
    this.saveDemoCards(userId, demoCards);
    
    return demoCards[index];
  }

  /**
   * Remove demo card from localStorage
   * 
   * @param cardId - Card identifier
   * @param userId - User identifier
   */
  private removeDemoCard(cardId: string, userId: string): void {
    const demoCards = this.getDemoCards(userId);
    const filtered = demoCards.filter(c => c.id !== cardId);
    this.saveDemoCards(userId, filtered);
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
    // Check if it's a demo card
    if (cardId.startsWith('demo_')) {
      const userId = cardId.split('_')[1]; // Extract userId from demo card ID
      const updated = this.updateDemoCard(cardId, userId, { status: 'frozen' });
      if (!updated) throw new Error('Demo card not found');
      return updated;
    }
    
    try {
      const response = await fetch('/api/stripe/card', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId,
          action: 'freeze',
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to freeze card');
      }
      
      return this.updateCardStatus(cardId, 'frozen');
    } catch (error) {
      console.error('Error freezing card:', error);
      throw error;
    }
  }

  /**
   * Unfreeze a card
   * 
   * @param cardId - Card identifier
   * @returns Promise resolving to updated card
   */
  async unfreezeCard(cardId: string): Promise<Card> {
    // Check if it's a demo card
    if (cardId.startsWith('demo_')) {
      const userId = cardId.split('_')[1]; // Extract userId from demo card ID
      const updated = this.updateDemoCard(cardId, userId, { status: 'active' });
      if (!updated) throw new Error('Demo card not found');
      return updated;
    }
    
    try {
      const response = await fetch('/api/stripe/card', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId,
          action: 'unfreeze',
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to unfreeze card');
      }
      
      return this.updateCardStatus(cardId, 'active');
    } catch (error) {
      console.error('Error unfreezing card:', error);
      throw error;
    }
  }

  /**
   * Cancel a card permanently
   * 
   * @param cardId - Card identifier
   * @returns Promise resolving to cancelled card
   */
  async cancelCard(cardId: string): Promise<Card> {
    // Check if it's a demo card
    if (cardId.startsWith('demo_')) {
      const userId = cardId.split('_')[1]; // Extract userId from demo card ID
      const updated = this.updateDemoCard(cardId, userId, { status: 'cancelled' });
      if (!updated) throw new Error('Demo card not found');
      return updated;
    }
    
    try {
      const response = await fetch('/api/stripe/card', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId,
          action: 'cancel',
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to cancel card');
      }
      
      return this.updateCardStatus(cardId, 'cancelled');
    } catch (error) {
      console.error('Error cancelling card:', error);
      throw error;
    }
  }
}

export const cardService = new CardService();
