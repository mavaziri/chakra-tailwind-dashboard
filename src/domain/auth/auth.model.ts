/**
 * Auth domain model
 * Represents the authenticated user's session information
 */
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

/**
 * Authentication session
 */
export interface AuthSession {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresAt: number;
}
