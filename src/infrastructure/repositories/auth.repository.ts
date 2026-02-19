/**
 * Auth Repository Implementation
 * Handles authentication API calls and session storage
 */

import { IAuthRepository } from "./auth.repository.interface";
import { AuthSession, LoginCredentials } from "@/domain/auth/auth.model";
import { HttpClient } from "@/infrastructure/http/http-client";
import { AuthMapper } from "@/infrastructure/mappers/auth.mapper";
import { DummyJsonAuthResponse } from "@/types/api/dummyjson.types";
import { config } from "@/config/app.config";
import { cookieUtils } from "@/utils/cookies";

export class AuthRepository implements IAuthRepository {
  constructor(private httpClient: HttpClient) {}

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await this.httpClient.post<DummyJsonAuthResponse>("/auth/login", {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: credentials.expiresInMins || 60,
    });

    const session = AuthMapper.toDomain(response, credentials.expiresInMins);
    this.saveSession(session);

    return session;
  }

  async refreshToken(refreshToken: string): Promise<AuthSession> {
    const response = await this.httpClient.post<DummyJsonAuthResponse>("/auth/refresh", {
      refreshToken,
      expiresInMins: 60,
    });

    const session = AuthMapper.toDomain(response, 60);
    this.saveSession(session);

    return session;
  }

  getCurrentSession(): AuthSession | null {
    if (typeof window === "undefined") {
      return null;
    }

    const token =
      cookieUtils.get(config.auth.tokenKey) || localStorage.getItem(config.auth.tokenKey);
    const refreshToken =
      cookieUtils.get(config.auth.refreshTokenKey) ||
      localStorage.getItem(config.auth.refreshTokenKey);
    const userStr = localStorage.getItem(config.auth.userKey);
    const expiresAtStr = localStorage.getItem(config.auth.expiresAtKey);

    if (!token || !refreshToken || !userStr || !expiresAtStr) {
      return null;
    }

    try {
      return {
        token,
        refreshToken,
        user: JSON.parse(userStr),
        expiresAt: parseInt(expiresAtStr, 10),
      };
    } catch {
      return null;
    }
  }

  saveSession(session: AuthSession): void {
    if (typeof window === "undefined") {
      return;
    }

    // Save to cookies for middleware access
    cookieUtils.set(config.auth.tokenKey, session.token, 7);
    cookieUtils.set(config.auth.refreshTokenKey, session.refreshToken, 7);

    // Also save to localStorage for client-side access
    localStorage.setItem(config.auth.tokenKey, session.token);
    localStorage.setItem(config.auth.refreshTokenKey, session.refreshToken);
    localStorage.setItem(config.auth.userKey, JSON.stringify(session.user));
    localStorage.setItem(config.auth.expiresAtKey, session.expiresAt.toString());
  }

  clearSession(): void {
    if (typeof window === "undefined") {
      return;
    }

    // Clear cookies
    cookieUtils.remove(config.auth.tokenKey);
    cookieUtils.remove(config.auth.refreshTokenKey);

    // Clear localStorage
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.refreshTokenKey);
    localStorage.removeItem(config.auth.userKey);
    localStorage.removeItem(config.auth.expiresAtKey);
  }

  isSessionExpired(): boolean {
    const session = this.getCurrentSession();
    if (!session) {
      return true;
    }

    return Date.now() >= session.expiresAt;
  }
}
