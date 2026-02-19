/**
 * Users React Query Hooks
 * Client-side data fetching hooks for users
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { User, UserFilters } from "@/domain/user/user.model";
import { PaginatedResponse } from "@/types/common";
import { ServiceFactory } from "@/services/service.factory";
import { queryKeys } from "@/lib/react-query";

/**
 * Hook for fetching paginated users
 */
export function useUsers(filters?: UserFilters): UseQueryResult<PaginatedResponse<User>> {
  const userService = ServiceFactory.getUserService();

  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => userService.getUsers(filters),
  });
}

/**
 * Hook for fetching single user
 */
export function useUser(id: number): UseQueryResult<User> {
  const userService = ServiceFactory.getUserService();

  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
}

/**
 * Hook for searching users
 */
export function useUserSearch(
  query: string,
  limit?: number,
  skip?: number
): UseQueryResult<PaginatedResponse<User>> {
  const userService = ServiceFactory.getUserService();

  return useQuery({
    queryKey: [...queryKeys.users.search(query), { limit, skip }],
    queryFn: () => userService.searchUsers(query, limit, skip),
    enabled: query.length > 0,
  });
}
