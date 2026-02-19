/**
 * User Service
 * Business logic layer for user operations
 * Depends on IUserRepository abstraction (Dependency Inversion)
 */

import { IUserRepository } from "@/infrastructure/repositories/user.repository.interface";
import { User, UserFilters } from "@/domain/user/user.model";
import { PaginatedResponse } from "@/types/common";

export class UserService {
  constructor(private repository: IUserRepository) {}

  /**
   * Retrieves paginated users with optional filtering
   */
  async getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    return this.repository.getUsers(filters);
  }

  /**
   * Retrieves user by ID
   */
  async getUserById(id: number): Promise<User> {
    return this.repository.getUserById(id);
  }

  /**
   * Searches users by query string
   */
  async searchUsers(
    query: string,
    limit?: number,
    skip?: number
  ): Promise<PaginatedResponse<User>> {
    if (!query.trim()) {
      return this.getUsers({ limit, skip });
    }

    return this.repository.searchUsers(query.trim(), limit, skip);
  }
}
