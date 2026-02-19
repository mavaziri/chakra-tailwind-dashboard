/**
 * Application configuration
 * Centralizes all environment variables and app settings
 */

/**
 * Gets RAWG API key (server-side only)
 * Returns null if not configured (for graceful error handling)
 */
export function getRawgApiKey(): string | null {
  const key = process.env.RAWG_API_KEY;

  if (!key || key.trim() === "" || key === "your_rawg_api_key_here") {
    console.error(
      "[CONFIG ERROR] RAWG_API_KEY is not configured in environment variables. " +
        "Please add it to .env.local and restart the server. " +
        "Get your free API key from: https://rawg.io/apidocs"
    );
    return null;
  }

  return key;
}

export const config = {
  api: {
    rawg: {
      baseUrl: "https://api.rawg.io/api",
    },
    dummyJson: {
      baseUrl: process.env.NEXT_PUBLIC_DUMMYJSON_API_URL || "https://dummyjson.com",
    },
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000", 10),
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Enterprise Dashboard",
  },
  auth: {
    tokenKey: "auth_token",
    refreshTokenKey: "refresh_token",
    userKey: "auth_user",
    expiresAtKey: "auth_expires_at",
  },
  pagination: {
    defaultLimit: 30,
    defaultSkip: 0,
  },
} as const;
