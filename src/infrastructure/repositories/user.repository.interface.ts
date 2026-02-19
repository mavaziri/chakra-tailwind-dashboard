/**
 * User Repository Interface
 * Defines contract for user data operations
 */

import { User, UserFilters } from "@/domain/user/user.model";
import { PaginatedResponse } from "@/types/common";

export interface IUserRepository {
  /**
   * Retrieves paginated users list with optional filters
   */
  getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>>;

  /**
   * Retrieves single user by ID
   */
  getUserById(id: number): Promise<User>;

  /**
   * Searches users by query
   */
  searchUsers(query: string, limit?: number, skip?: number): Promise<PaginatedResponse<User>>;
}
