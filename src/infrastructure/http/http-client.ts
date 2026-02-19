/**
 * HTTP Client
 * Generic HTTP client abstraction for making API requests
 */

import { ApiError } from "@/types/common";
import { config } from "@/config/app.config";

export interface HttpClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * HTTP client for making API requests
 * Provides a clean abstraction over fetch API
 */
export class HttpClient {
  constructor(
    private baseUrl: string,
    private timeout: number = config.api.timeout,
    private defaultHeaders: Record<string, string> = { "Content-Type": "application/json" }
  ) {}

  static setupFromConfig(clientConfig: HttpClientConfig): HttpClient {
    return new HttpClient(clientConfig.baseUrl, clientConfig.timeout || config.api.timeout, {
      "Content-Type": "application/json",
      ...clientConfig.headers,
    });
  }

  /**
   * Performs GET request
   */
  async get<T>(url: string, requestConfig?: RequestConfig): Promise<T> {
    return this.request<T>("GET", url, undefined, requestConfig);
  }

  /**
   * Performs POST request
   */
  async post<T>(url: string, data?: unknown, requestConfig?: RequestConfig): Promise<T> {
    return this.request<T>("POST", url, data, requestConfig);
  }

  /**
   * Performs PUT request
   */
  async put<T>(url: string, data?: unknown, requestConfig?: RequestConfig): Promise<T> {
    return this.request<T>("PUT", url, data, requestConfig);
  }

  /**
   * Performs DELETE request
   */
  async delete<T>(url: string, requestConfig?: RequestConfig): Promise<T> {
    return this.request<T>("DELETE", url, undefined, requestConfig);
  }

  /**
   * Generic request method
   */
  private async request<T>(
    method: string,
    url: string,
    data?: unknown,
    requestConfig?: RequestConfig
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method,
        headers: {
          ...this.defaultHeaders,
          ...requestConfig?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: ApiError = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };

        try {
          const errorData = await response.json();
          error.message = errorData.message || error.message;
        } catch {
          // Use default error message if response body is not JSON
        }

        throw error;
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw {
            message: "Request timeout",
            code: "TIMEOUT",
          } as ApiError;
        }
      }

      throw error;
    }
  }
}
