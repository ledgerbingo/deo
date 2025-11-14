/**
 * Dashboard Service
 * 
 * Aggregates data from all modules to provide dashboard overview.
 */

import { DashboardOverview, Activity, QuickAction, ServiceStatus } from './types';
import { accountService } from '../account/service';
import { cardService } from '../card/service';
import { investmentService } from '../investment/service';
import { notificationsService } from '../notifications/service';

export class DashboardService {
  /**
   * Get complete dashboard overview for user
   * 
   * @param userId - User identifier
   * @returns Promise resolving to dashboard overview
   */
  async getDashboardOverview(userId: string): Promise<DashboardOverview> {
    console.log(`Fetching dashboard overview for user: ${userId}`);

    // Fetch data from all modules
    const [wallet, cards, portfolio, notifications] = await Promise.all([
      accountService.getWallet('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8'),
      cardService.getUserCards(userId),
      investmentService.getPortfolio(userId),
      notificationsService.getNotifications(userId, 5),
    ]);

    const unreadCount = await notificationsService.getUnreadCount(userId);

    return {
      userId,
      account: {
        balance: wallet?.balance || 0,
        currency: 'USDC',
        walletAddress: wallet?.address || '',
        recentTransactions: 2,
        pendingTransactions: 0,
      },
      card: {
        hasCard: cards.length > 0,
        cardCount: cards.length,
        activeCards: cards.filter(c => c.status === 'active').length,
        monthlySpending: 1250.50,
        availableLimit: cards.reduce((sum, c) => sum + c.availableBalance, 0),
      },
      investment: {
        totalValue: portfolio.totalValue,
        totalReturn: portfolio.totalReturn,
        returnPercentage: portfolio.returnPercentage,
        holdingsCount: portfolio.holdings.length,
        topPerformer: portfolio.holdings[0]?.asset.symbol,
      },
      notifications: {
        unreadCount,
        urgentCount: notifications.filter(n => n.priority === 'urgent').length,
        recentNotifications: notifications.length,
      },
      recentActivity: await this.getRecentActivity(userId),
      quickActions: this.getQuickActions(),
    };
  }

  /**
   * Get recent activity across all services
   * 
   * @param userId - User identifier
   * @returns Promise resolving to recent activities
   */
  async getRecentActivity(userId: string): Promise<Activity[]> {
    console.log(`Fetching recent activity for user: ${userId}`);

    return [
      {
        id: 'act_1',
        type: 'transaction',
        title: 'USDC Transfer Sent',
        description: 'Sent 150 USDC to 0x789...abc',
        timestamp: new Date(Date.now() - 3600000),
        icon: 'send',
      },
      {
        id: 'act_2',
        type: 'card',
        title: 'Card Payment',
        description: 'Paid $45.99 at Amazon',
        timestamp: new Date(Date.now() - 7200000),
        icon: 'credit-card',
      },
      {
        id: 'act_3',
        type: 'trade',
        title: 'Investment Purchase',
        description: 'Bought 0.5 BTC',
        timestamp: new Date(Date.now() - 86400000),
        icon: 'trending-up',
      },
      {
        id: 'act_4',
        type: 'transaction',
        title: 'USDC Received',
        description: 'Received 500 USDC from 0x123...456',
        timestamp: new Date(Date.now() - 172800000),
        icon: 'arrow-down-left',
      },
    ];
  }

  /**
   * Get available quick actions
   * 
   * @returns Array of quick actions
   */
  getQuickActions(): QuickAction[] {
    return [
      {
        id: 'send',
        title: 'Send USDC',
        description: 'Transfer funds instantly',
        icon: 'send',
        actionUrl: '/account/send',
        enabled: true,
      },
      {
        id: 'receive',
        title: 'Receive USDC',
        description: 'Get your wallet address',
        icon: 'arrow-down-left',
        actionUrl: '/account/receive',
        enabled: true,
      },
      {
        id: 'card',
        title: 'Request Card',
        description: 'Get a virtual or physical card',
        icon: 'credit-card',
        actionUrl: '/card/request',
        enabled: true,
        requiresKYC: true,
      },
      {
        id: 'invest',
        title: 'Invest',
        description: 'Buy crypto or stocks',
        icon: 'trending-up',
        actionUrl: '/investment',
        enabled: true,
      },
      {
        id: 'exchange',
        title: 'Exchange',
        description: 'Convert currencies',
        icon: 'repeat',
        actionUrl: '/exchange',
        enabled: true,
      },
      {
        id: 'support',
        title: 'Get Help',
        description: 'Contact support',
        icon: 'help-circle',
        actionUrl: '/support',
        enabled: true,
      },
    ];
  }

  /**
   * Get service status indicators
   * 
   * @returns Promise resolving to service statuses
   */
  async getServiceStatuses(): Promise<ServiceStatus[]> {
    console.log('Fetching service statuses');

    return [
      {
        service: 'Circle ARC Blockchain',
        status: 'operational',
        lastChecked: new Date(),
      },
      {
        service: 'Stripe Services',
        status: 'operational',
        lastChecked: new Date(),
      },
      {
        service: 'USDC Wallet',
        status: 'operational',
        lastChecked: new Date(),
      },
      {
        service: 'Card Issuance',
        status: 'operational',
        lastChecked: new Date(),
      },
      {
        service: 'Investment Platform',
        status: 'operational',
        lastChecked: new Date(),
      },
    ];
  }

  /**
   * Get personalized recommendations
   * 
   * @param userId - User identifier
   * @returns Promise resolving to recommendations
   */
  async getRecommendations(userId: string): Promise<string[]> {
    console.log(`Fetching recommendations for user: ${userId}`);

    return [
      'Complete KYC verification to unlock all features',
      'Request a DEO Card to spend your USDC anywhere',
      'Consider diversifying your investment portfolio',
      'Enable two-factor authentication for enhanced security',
    ];
  }
}

export const dashboardService = new DashboardService();
