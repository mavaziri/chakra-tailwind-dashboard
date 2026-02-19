/**
 * Auth Repository Interface
 * Defines contract for authentication operations
 * Implements Repository pattern - abstracts data source
 */

import { AuthSession, LoginCredentials } from "@/domain/auth/auth.model";

export interface IAuthRepository {
  /**
   * Authenticates user with credentials
   */
  login(credentials: LoginCredentials): Promise<AuthSession>;

  /**
   * Refreshes authentication token
   */
  refreshToken(refreshToken: string): Promise<AuthSession>;

  /**
   * Retrieves current authenticated user session
   */
  getCurrentSession(): AuthSession | null;

  /**
   * Saves authentication session
   */
  saveSession(session: AuthSession): void;

  /**
   * Clears authentication session
   */
  clearSession(): void;

  /**
   * Checks if session is expired
   */
  isSessionExpired(): boolean;
}
