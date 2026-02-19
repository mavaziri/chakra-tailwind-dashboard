/**
 * User Mapper
 * Adapts DummyJSON API responses to User domain models
 * Implements Adapter pattern for API → Domain transformation
 */

import { User } from "@/domain/user/user.model";
import { DummyJsonUserResponse } from "@/types/api/dummyjson.types";
import { PaginatedResponse } from "@/types/common";

export class UserMapper {
  /**
   * Maps DummyJSON user response to User domain model
   */
  static toDomain(response: DummyJsonUserResponse): User {
    return {
      id: response.id,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      phone: response.phone,
      username: response.username,
      birthDate: response.birthDate,
      image: response.image,
      bloodGroup: response.bloodGroup,
      height: response.height,
      weight: response.weight,
      eyeColor: response.eyeColor,
      age: response.age,
      university: response.university,
      company: response.company.name,
      role: response.role,
    };
  }

  /**
   * Maps DummyJSON users list response to paginated domain model
   */
  static toPaginatedDomain(response: {
    users: DummyJsonUserResponse[];
    total: number;
    skip: number;
    limit: number;
  }): PaginatedResponse<User> {
    return {
      items: response.users.map((user) => this.toDomain(user)),
      total: response.total,
      skip: response.skip,
      limit: response.limit,
    };
  }
}
