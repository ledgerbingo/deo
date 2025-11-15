/**
 * Onboarding Service
 * 
 * Manages the user onboarding process including KYC and service introduction.
 */

import { OnboardingProgress, OnboardingStep, ServiceIntroduction, KYCData, KYCStatus } from './types';

export class OnboardingService {
  /**
   * Get user's onboarding progress
   * 
   * @param userId - User identifier
   * @returns Promise resolving to onboarding progress
   */
  async getProgress(userId: string): Promise<OnboardingProgress> {
    const steps: OnboardingStep[] = [
      {
        id: 'welcome',
        title: 'Welcome to DEO Finance',
        description: 'Learn about our platform',
        completed: true,
        required: true,
      },
      {
        id: 'kyc',
        title: 'Identity Verification',
        description: 'Complete KYC verification',
        completed: false,
        required: true,
      },
      {
        id: 'wallet',
        title: 'Create Wallet',
        description: 'Set up your USDC wallet',
        completed: false,
        required: true,
      },
      {
        id: 'services',
        title: 'Explore Services',
        description: 'Discover all features',
        completed: false,
        required: false,
      },
    ];

    return {
      userId,
      currentStep: 1,
      totalSteps: steps.length,
      steps,
    };
  }

  /**
   * Get service introduction content
   * 
   * @returns Array of service introductions
   */
  getServiceIntroductions(): ServiceIntroduction[] {
    return [
      {
        feature: 'wallet',
        title: 'USDC Wallet',
        description: 'Secure digital wallet with USDC stablecoin support on Circle ARC blockchain',
        icon: 'wallet',
      },
      {
        feature: 'card',
        title: 'DEO Card',
        description: 'Virtual and physical cards powered by Stripe for everyday spending',
        icon: 'credit-card',
      },
      {
        feature: 'investment',
        title: 'Investment Portfolio',
        description: 'Manage and grow your investments with our portfolio tools',
        icon: 'trending-up',
      },
      {
        feature: 'exchange',
        title: 'Currency Exchange',
        description: 'Exchange between multiple currencies at competitive rates',
        icon: 'repeat',
      },
    ];
  }

  /**
   * Complete an onboarding step
   * 
   * @param userId - User identifier
   * @param stepId - Step identifier to complete
   * @returns Promise resolving to updated progress
   */
  async completeStep(userId: string, stepId: string): Promise<OnboardingProgress> {
    console.log(`Completing step ${stepId} for user ${userId}`);
    // In production, this would update the database
    return this.getProgress(userId);
  }

  /**
   * Start KYC verification process
   * 
   * @param userId - User identifier
   * @returns Promise resolving to KYC session information
   */
  async startKYC(userId: string): Promise<{ sessionId: string; url: string }> {
    try {
      const response = await fetch('/api/stripe/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: userId }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to start KYC');
      }

      return {
        sessionId: data.sessionId,
        url: data.url || '',
      };
    } catch (error) {
      console.error('Error starting KYC:', error);
      throw error;
    }
  }

  /**
   * Get KYC verification status
   * 
   * @param userId - User identifier
   * @returns Promise resolving to KYC data
   */
  async getKYCStatus(userId: string): Promise<KYCData> {
    try {
      // This would need a sessionId in production - for now return not_started
      // You'd typically store the sessionId associated with the userId
      return {
        userId,
        status: 'not_started' as KYCStatus,
      };
    } catch (error) {
      console.error('Error fetching KYC status:', error);
      return {
        userId,
        status: 'not_started' as KYCStatus,
      };
    }
  }

  /**
   * Get KYC status by session ID
   * 
   * @param sessionId - Stripe verification session ID
   * @returns Promise resolving to KYC data
   */
  async getKYCStatusBySession(sessionId: string): Promise<{ status: string; verified: boolean }> {
    try {
      const response = await fetch(`/api/stripe/kyc?sessionId=${sessionId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get KYC status');
      }

      return {
        status: data.status,
        verified: data.verified,
      };
    } catch (error) {
      console.error('Error fetching KYC status:', error);
      throw error;
    }
  }
}

export const onboardingService = new OnboardingService();
