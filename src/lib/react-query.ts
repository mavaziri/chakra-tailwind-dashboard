/**
 * React Query Configuration
 * Centralizes React Query setup and default options
 */

import { QueryClient } from "@tanstack/react-query";

const FIVE_MINUTES = 1000 * 60 * 5;
const ONE_MINUTE = 1000 * 60;

/**
 * Creates a configured React Query client instance
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: ONE_MINUTE,
        gcTime: FIVE_MINUTES,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

/**
 * Query keys factory for consistent cache management
 */
export const queryKeys = {
  auth: {
    session: ["auth", "session"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (filters?: unknown) => ["users", "list", filters] as const,
    detail: (id: number) => ["users", "detail", id] as const,
    search: (query: string) => ["users", "search", query] as const,
  },
  products: {
    all: ["products"] as const,
    list: (filters?: unknown) => ["products", "list", filters] as const,
    detail: (id: number) => ["products", "detail", id] as const,
    search: (query: string) => ["products", "search", query] as const,
    categories: ["products", "categories"] as const,
    byCategory: (category: string) => ["products", "category", category] as const,
  },
  games: {
    all: ["games"] as const,
    list: (filters?: unknown) => ["games", "list", filters] as const,
    detail: (id: number | string) => ["games", "detail", id] as const,
    genres: ["games", "genres"] as const,
    platforms: ["games", "platforms"] as const,
  },
} as const;
