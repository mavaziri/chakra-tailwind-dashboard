/**
 * Common types used across the application
 */

/**
 * Represents a paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Common query parameters for list endpoints
 */
export interface QueryParams {
  limit?: number;
  skip?: number;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

/**
 * API Error structure
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Generic filter criteria
 */
export interface FilterCriteria<T> {
  field: keyof T;
  value: unknown;
  operator?: "equals" | "contains" | "greaterThan" | "lessThan" | "in";
}

/**
 * Sort configuration
 */
export interface SortConfig<T> {
  field: keyof T;
  direction: "asc" | "desc";
}
