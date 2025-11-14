/**
 * Support Service
 * 
 * Manages customer support operations including tickets and help resources.
 */

import {
  SupportTicket,
  CreateTicketRequest,
  TicketMessage,
  HelpArticle,
  FAQ,
  TicketStatus,
} from './types';

export class SupportService {
  /**
   * Create a new support ticket
   * 
   * @param request - Ticket creation request
   * @returns Promise resolving to new ticket
   */
  async createTicket(request: CreateTicketRequest): Promise<SupportTicket> {
    console.log(`Creating support ticket for user: ${request.userId}`);
    
    const ticket: SupportTicket = {
      id: `ticket_${Date.now()}`,
      userId: request.userId,
      subject: request.subject,
      description: request.description,
      category: request.category,
      priority: request.priority || 'medium',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          ticketId: `ticket_${Date.now()}`,
          sender: 'user',
          message: request.description,
          timestamp: new Date(),
        },
      ],
    };

    return ticket;
  }

  /**
   * Get user's support tickets
   * 
   * @param userId - User identifier
   * @returns Promise resolving to array of tickets
   */
  async getUserTickets(userId: string): Promise<SupportTicket[]> {
    console.log(`Fetching tickets for user: ${userId}`);
    
    return [
      {
        id: 'ticket_1',
        userId,
        subject: 'Unable to complete KYC',
        description: 'I am having trouble uploading my documents for KYC verification',
        category: 'kyc',
        priority: 'high',
        status: 'in_progress',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        messages: [
          {
            id: 'msg_1',
            ticketId: 'ticket_1',
            sender: 'user',
            message: 'I am having trouble uploading my documents for KYC verification',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'msg_2',
            ticketId: 'ticket_1',
            sender: 'support',
            message: 'We are looking into this issue. Please try using a different browser.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        ],
      },
    ];
  }

  /**
   * Get ticket by ID
   * 
   * @param ticketId - Ticket identifier
   * @returns Promise resolving to ticket details
   */
  async getTicket(ticketId: string): Promise<SupportTicket | null> {
    console.log(`Fetching ticket: ${ticketId}`);
    
    const tickets = await this.getUserTickets('user_123');
    return tickets.find(t => t.id === ticketId) || null;
  }

  /**
   * Add message to ticket
   * 
   * @param ticketId - Ticket identifier
   * @param message - Message content
   * @param sender - Message sender (user or support)
   * @returns Promise resolving to new message
   */
  async addTicketMessage(
    ticketId: string,
    message: string,
    sender: 'user' | 'support'
  ): Promise<TicketMessage> {
    console.log(`Adding message to ticket ${ticketId}`);
    
    const newMessage: TicketMessage = {
      id: `msg_${Date.now()}`,
      ticketId,
      sender,
      message,
      timestamp: new Date(),
    };

    return newMessage;
  }

  /**
   * Update ticket status
   * 
   * @param ticketId - Ticket identifier
   * @param status - New ticket status
   * @returns Promise resolving to updated ticket
   */
  async updateTicketStatus(ticketId: string, status: TicketStatus): Promise<SupportTicket> {
    console.log(`Updating ticket ${ticketId} status to ${status}`);
    
    const ticket = await this.getTicket(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    
    ticket.status = status;
    ticket.updatedAt = new Date();
    
    if (status === 'resolved' || status === 'closed') {
      ticket.resolvedAt = new Date();
    }
    
    return ticket;
  }

  /**
   * Get help articles
   * 
   * @param category - Optional category filter
   * @returns Promise resolving to help articles
   */
  async getHelpArticles(category?: string): Promise<HelpArticle[]> {
    console.log(`Fetching help articles${category ? ` for category: ${category}` : ''}`);
    
    const articles: HelpArticle[] = [
      {
        id: 'article_1',
        title: 'How to create a USDC wallet',
        content: 'Step-by-step guide to creating your first USDC wallet on DEO Finance...',
        category: 'wallet',
        tags: ['wallet', 'usdc', 'getting-started'],
        views: 1250,
        helpful: 98,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'article_2',
        title: 'Understanding KYC verification',
        content: 'Learn about the KYC process and what documents you need...',
        category: 'kyc',
        tags: ['kyc', 'verification', 'identity'],
        views: 2100,
        helpful: 145,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'article_3',
        title: 'How to request a DEO Card',
        content: 'Guide to requesting virtual and physical cards...',
        category: 'card',
        tags: ['card', 'stripe', 'payment'],
        views: 890,
        helpful: 76,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ];

    return category ? articles.filter(a => a.category === category) : articles;
  }

  /**
   * Get frequently asked questions
   * 
   * @returns Promise resolving to FAQs
   */
  async getFAQs(): Promise<FAQ[]> {
    console.log('Fetching FAQs');
    
    return [
      {
        id: 'faq_1',
        question: 'What is DEO Finance?',
        answer: 'DEO Finance is a comprehensive financial service platform built on Circle\'s ARC blockchain, offering USDC wallets, card issuance, and more.',
        category: 'general',
        order: 1,
      },
      {
        id: 'faq_2',
        question: 'How long does KYC verification take?',
        answer: 'KYC verification typically takes 5-10 minutes to complete once you submit your documents.',
        category: 'kyc',
        order: 2,
      },
      {
        id: 'faq_3',
        question: 'What currencies are supported?',
        answer: 'We support USDC on the Circle ARC blockchain, with plans to add more currencies soon.',
        category: 'wallet',
        order: 3,
      },
      {
        id: 'faq_4',
        question: 'Are there any fees?',
        answer: 'We charge minimal transaction fees. USDC transfers have low gas fees, and card transactions may have standard payment processing fees.',
        category: 'fees',
        order: 4,
      },
    ];
  }

  /**
   * Search help articles
   * 
   * @param query - Search query
   * @returns Promise resolving to matching articles
   */
  async searchHelpArticles(query: string): Promise<HelpArticle[]> {
    console.log(`Searching help articles for: ${query}`);
    
    const allArticles = await this.getHelpArticles();
    const lowerQuery = query.toLowerCase();
    
    return allArticles.filter(
      article =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.content.toLowerCase().includes(lowerQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

export const supportService = new SupportService();
