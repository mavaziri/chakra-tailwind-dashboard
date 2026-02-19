/**
 * usePagination Hook
 * Manages pagination state and helpers
 */

import { useState, useCallback, useMemo } from "react";

export interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export interface UsePaginationParams {
  total: number;
}

export interface UsePaginationReturn {
  page: number;
  limit: number;
  skip: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setLimit: (limit: number) => void;
  reset: () => void;
}

/**
 * Hook for managing pagination state
 * @param params - Runtime parameters (total items)
 * @param options - Initial configuration
 */
export function usePagination(
  params: UsePaginationParams,
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const { total } = params;
  const { initialPage = 1, initialLimit = 30 } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);

  const skip = useMemo(() => (page - 1) * limit, [page, limit]);

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const hasNextPage = useMemo(() => page < totalPages, [page, totalPages]);

  const hasPreviousPage = useMemo(() => page > 1, [page]);

  const goToPage = useCallback(
    (newPage: number) => {
      const validPage = Math.max(1, Math.min(newPage, totalPages || 1));
      setPage(validPage);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setPage((prev) => prev - 1);
    }
  }, [hasPreviousPage]);

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit);

    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);

    setLimitState(initialLimit);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    skip,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    setLimit,
    reset,
  };
}
