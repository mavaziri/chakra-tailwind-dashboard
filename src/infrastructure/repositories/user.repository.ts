/**
 * User Repository Implementation
 * Handles user data API calls
 */

import { IUserRepository } from "./user.repository.interface";
import { User, UserFilters } from "@/domain/user/user.model";
import { PaginatedResponse } from "@/types/common";
import { HttpClient } from "@/infrastructure/http/http-client";
import { UserMapper } from "@/infrastructure/mappers/user.mapper";
import { DummyJsonUsersResponse, DummyJsonUserResponse } from "@/types/api/dummyjson.types";

export class UserRepository implements IUserRepository {
  constructor(private httpClient: HttpClient) {}

  async getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();

    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }

    if (filters?.skip) {
      params.append("skip", filters.skip.toString());
    }

    if (filters?.sortBy) {
      params.append("sortBy", filters.sortBy);
    }

    if (filters?.order) {
      params.append("order", filters.order);
    }

    const queryString = params.toString();
    const url = `/users${queryString ? `?${queryString}` : ""}`;

    const response = await this.httpClient.get<DummyJsonUsersResponse>(url);

    return UserMapper.toPaginatedDomain(response);
  }

  async getUserById(id: number): Promise<User> {
    const response = await this.httpClient.get<DummyJsonUserResponse>(`/users/${id}`);

    return UserMapper.toDomain(response);
  }

  async searchUsers(
    query: string,
    limit?: number,
    skip?: number
  ): Promise<PaginatedResponse<User>> {
    const trimmedQuery = query.trim();

    // Check if search contains multiple words (potential full name search)
    const isMultiWordSearch = trimmedQuery.includes(" ");

    if (isMultiWordSearch) {
      const params = new URLSearchParams();
      params.append("limit", "100"); // Fetch larger set for client-side filtering
      params.append("skip", "0");

      const response = await this.httpClient.get<DummyJsonUsersResponse>(
        `/users?${params.toString()}`
      );

      const queryLower = trimmedQuery.toLowerCase();
      const filteredUsers = response.users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

        return fullName.includes(queryLower);
      });

      // Apply pagination to filtered results
      const startIndex = skip || 0;
      const endIndex = startIndex + (limit || 30);
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      return {
        items: paginatedUsers.map((user) => UserMapper.toDomain(user)),
        total: filteredUsers.length,
        skip: startIndex,
        limit: limit || 30,
      };
    }

    // Single-word search: use API search endpoint
    const params = new URLSearchParams();
    params.append("q", trimmedQuery);

    if (limit) {
      params.append("limit", limit.toString());
    }

    if (skip) {
      params.append("skip", skip.toString());
    }

    const response = await this.httpClient.get<DummyJsonUsersResponse>(
      `/users/search?${params.toString()}`
    );

    return UserMapper.toPaginatedDomain(response);
  }
}
