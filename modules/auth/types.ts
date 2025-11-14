/**
 * Authentication Module Types
 * 
 * This file defines all types and interfaces for the authentication module.
 * It provides clear type definitions for AI agents to understand authentication operations.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: AuthProvider;
  createdAt: Date;
  lastLogin: Date;
}

export type AuthProvider = 'google' | 'github' | 'email';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SocialAuthConfig {
  provider: AuthProvider;
  clientId: string;
  redirectUri: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  session?: AuthSession;
}
