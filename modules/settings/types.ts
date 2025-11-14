/**
 * Settings Module Types
 * 
 * Defines types for user settings and preferences.
 */

export interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatar?: string;
  dateOfBirth?: Date;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  loginNotifications: boolean;
  lastPasswordChange: Date;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  transactionAlerts: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  dataSharing: boolean;
  analyticsEnabled: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  currency: string;
  timezone: string;
}

export interface Settings {
  userId: string;
  profile: UserProfile;
  security: SecuritySettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  app: AppSettings;
  lastUpdated: Date;
}
