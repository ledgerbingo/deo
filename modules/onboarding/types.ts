/**
 * Onboarding Module Types
 * 
 * Defines types for user onboarding, KYC verification, and service introduction.
 */

export type KYCStatus = 'not_started' | 'in_progress' | 'verified' | 'rejected';

export interface KYCData {
  userId: string;
  status: KYCStatus;
  sessionId?: string;
  verifiedAt?: Date;
  documents?: KYCDocument[];
}

export interface KYCDocument {
  type: 'passport' | 'drivers_license' | 'id_card';
  uploaded: boolean;
  verified: boolean;
  uploadedAt?: Date;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

export interface OnboardingProgress {
  userId: string;
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
  completedAt?: Date;
}

export interface ServiceIntroduction {
  feature: string;
  title: string;
  description: string;
  icon: string;
}
