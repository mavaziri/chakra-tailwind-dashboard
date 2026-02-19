/**
 * Auth Context
 * Provides authentication state and actions across the app
 */

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthSession, LoginCredentials } from "@/domain/auth/auth.model";
import { ServiceFactory } from "@/services/service.factory";

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const authService = ServiceFactory.getAuthService();

  // Load session on mount
  useEffect(() => {
    const loadSession = () => {
      const currentSession = authService.getCurrentSession();

      setSession(currentSession);

      setIsLoading(false);
    };

    loadSession();
  }, [authService]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);
      try {
        const newSession = await authService.login(credentials);
        setSession(newSession);
      } finally {
        setIsLoading(false);
      }
    },
    [authService]
  );

  const logout = useCallback(() => {
    authService.logout();

    setSession(null);
  }, [authService]);

  const refreshSession = useCallback(async () => {
    try {
      const newSession = await authService.refreshSession();
      setSession(newSession);
    } catch (error) {
      // If refresh fails, logout
      logout();
      throw error;
    }
  }, [authService, logout]);

  const value: AuthContextValue = {
    session,
    isAuthenticated: authService.isAuthenticated(),
    isLoading,
    login,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
