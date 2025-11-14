/**
 * Support Module Types
 * 
 * Defines types for customer support operations.
 */

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'account' | 'wallet' | 'card' | 'transaction' | 'kyc' | 'other';

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  sender: 'user' | 'support';
  message: string;
  timestamp: Date;
  attachments?: string[];
}

export interface CreateTicketRequest {
  userId: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority?: TicketPriority;
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}
