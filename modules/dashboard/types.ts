/**
 * Dashboard Module Types
 * 
 * Defines types for dashboard overview and aggregated data.
 */

export interface DashboardOverview {
  userId: string;
  account: AccountSummary;
  card: CardSummary;
  investment: InvestmentSummary;
  notifications: NotificationsSummary;
  recentActivity: Activity[];
  quickActions: QuickAction[];
}

export interface AccountSummary {
  balance: number;
  currency: string;
  walletAddress: string;
  recentTransactions: number;
  pendingTransactions: number;
}

export interface CardSummary {
  hasCard: boolean;
  cardCount: number;
  activeCards: number;
  monthlySpending: number;
  availableLimit: number;
}

export interface InvestmentSummary {
  totalValue: number;
  totalReturn: number;
  returnPercentage: number;
  holdingsCount: number;
  topPerformer?: string;
}

export interface NotificationsSummary {
  unreadCount: number;
  urgentCount: number;
  recentNotifications: number;
}

export interface Activity {
  id: string;
  type: 'transaction' | 'card' | 'trade' | 'exchange' | 'kyc' | 'other';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  actionUrl: string;
  enabled: boolean;
  requiresKYC?: boolean;
}

export interface ServiceStatus {
  service: string;
  status: 'operational' | 'degraded' | 'down';
  lastChecked: Date;
}
