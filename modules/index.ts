/**
 * DEO Finance Modules
 * 
 * Central export point for all feature modules.
 * This provides a clean, organized interface for AI agents to access all services.
 */

// Auth Module
export * from './auth/types';
export { authService } from './auth/service';

// Onboarding Module
export * from './onboarding/types';
export { onboardingService } from './onboarding/service';

// Account Module
export * from './account/types';
export { accountService } from './account/service';

// Card Module
export * from './card/types';
export { cardService } from './card/service';

// Investment Module
export * from './investment/types';
export { investmentService } from './investment/service';

// Exchange Module
export * from './exchange/types';
export { exchangeService } from './exchange/service';

// Settings Module
export * from './settings/types';
export { settingsService } from './settings/service';

// Support Module
export * from './support/types';
export { supportService } from './support/service';

// Notifications Module
export * from './notifications/types';
export { notificationsService } from './notifications/service';

// Dashboard Module
export * from './dashboard/types';
export { dashboardService } from './dashboard/service';
