/**
 * HTTP Client Factory
 * Creates configured HTTP clients for different APIs
 */

import { HttpClient } from "./http-client";
import { config } from "@/config/app.config";

/**
 * Factory for creating HTTP clients
 * Implements Factory pattern for service instantiation
 */
export class HttpClientFactory {
  private static dummyJsonClient: HttpClient | null = null;
  private static internalApiClient: HttpClient | null = null;

  /**
   * Returns configured HTTP client for DummyJSON API
   */
  static getDummyJsonClient(): HttpClient {
    if (!this.dummyJsonClient) {
      this.dummyJsonClient = HttpClient.setupFromConfig({
        baseUrl: config.api.dummyJson.baseUrl,
      });
    }

    return this.dummyJsonClient;
  }

  /**
   * Returns configured HTTP client for internal API routes
   * (Used for Games, which proxy to RAWG on server-side)
   */
  static getInternalApiClient(): HttpClient {
    if (!this.internalApiClient) {
      this.internalApiClient = HttpClient.setupFromConfig({
        baseUrl: "/api",
      });
    }

    return this.internalApiClient;
  }

  /**
   * @deprecated Use getInternalApiClient() instead
   * Games are now fetched via internal API routes for security
   */
  static getRawgClient(): HttpClient {
    return this.getInternalApiClient();
  }

  /**
   * Creates authenticated HTTP client with token
   */
  static createAuthenticatedClient(baseUrl: string, token: string): HttpClient {
    return HttpClient.setupFromConfig({
      baseUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
