/**
 * Auth Service
 * Business logic layer for authentication
 * Depends on IAuthRepository abstraction (Dependency Inversion)
 */

import { IAuthRepository } from "@/infrastructure/repositories/auth.repository.interface";
import { AuthSession, LoginCredentials } from "@/domain/auth/auth.model";

export class AuthService {
  constructor(private repository: IAuthRepository) {}

  /**
   * Authenticates user with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    return this.repository.login(credentials);
  }

  /**
   * Logs out current user
   */
  logout(): void {
    this.repository.clearSession();
  }

  /**
   * Retrieves current authenticated session
   */
  getCurrentSession(): AuthSession | null {
    return this.repository.getCurrentSession();
  }

  /**
   * Checks if user is authenticated
   */
  isAuthenticated(): boolean {
    const session = this.getCurrentSession();
    return session !== null && !this.repository.isSessionExpired();
  }

  /**
   * Refreshes expired session token
   */
  async refreshSession(): Promise<AuthSession> {
    const currentSession = this.getCurrentSession();
    if (!currentSession) {
      throw new Error("No active session to refresh");
    }

    return this.repository.refreshToken(currentSession.refreshToken);
  }
}
