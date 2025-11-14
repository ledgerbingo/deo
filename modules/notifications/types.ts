/**
 * Notifications Module Types
 * 
 * Defines types for notification operations.
 */

export type NotificationType = 
  | 'transaction'
  | 'security'
  | 'kyc'
  | 'card'
  | 'system'
  | 'marketing'
  | 'alert';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  readAt?: Date;
}

export interface NotificationPreferences {
  userId: string;
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  types: {
    transaction: boolean;
    security: boolean;
    kyc: boolean;
    card: boolean;
    system: boolean;
    marketing: boolean;
  };
}

export interface CreateNotificationRequest {
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}
