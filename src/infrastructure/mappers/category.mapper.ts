/**
 * Category Mapper
 * Adapts DummyJSON category responses to Category domain models
 */

import { Category } from "@/domain/product/category.model";
import { DummyJsonCategoryResponse } from "@/types/api/dummyjson.types";

export class CategoryMapper {
  /**
   * Maps DummyJSON category response to Category domain model
   */
  static toDomain(response: DummyJsonCategoryResponse): Category {
    return {
      slug: response.slug,
      name: response.name,
    };
  }

  /**
   * Maps array of DummyJSON category responses to Category domain models
   */
  static toDomainList(responses: DummyJsonCategoryResponse[]): Category[] {
    return responses.map((response) => this.toDomain(response));
  }
}
