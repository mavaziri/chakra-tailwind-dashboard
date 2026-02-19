/**
 * Auth Mapper
 * Adapts DummyJSON API responses to domain models
 * Implements Adapter pattern for API → Domain transformation
 */

import { AuthSession, AuthUser } from "@/domain/auth/auth.model";
import { DummyJsonAuthResponse } from "@/types/api/dummyjson.types";

export class AuthMapper {
  /**
   * Maps DummyJSON auth response to AuthSession domain model
   */
  static toDomain(response: DummyJsonAuthResponse, expiresInMins: number = 60): AuthSession {
    const expiresAt = Date.now() + expiresInMins * 60 * 1000;

    return {
      user: this.mapUser(response),
      token: response.token,
      refreshToken: response.refreshToken,
      expiresAt,
    };
  }

  /**
   * Maps DummyJSON auth response to AuthUser domain model
   */
  private static mapUser(response: DummyJsonAuthResponse): AuthUser {
    return {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      gender: response.gender,
      image: response.image,
    };
  }
}
