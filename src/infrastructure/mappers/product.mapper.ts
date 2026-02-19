/**
 * Product Mapper
 * Adapts DummyJSON API responses to Product domain models
 * Implements Adapter pattern for API → Domain transformation
 */

import { Product } from "@/domain/product/product.model";
import { DummyJsonProductResponse } from "@/types/api/dummyjson.types";
import { PaginatedResponse } from "@/types/common";

export class ProductMapper {
  /**
   * Maps DummyJSON product response to Product domain model
   */
  static toDomain(response: DummyJsonProductResponse): Product {
    return {
      id: response.id,
      title: response.title,
      description: response.description,
      category: response.category,
      price: response.price,
      discountPercentage: response.discountPercentage,
      rating: response.rating,
      stock: response.stock,
      tags: response.tags,
      brand: response.brand,
      sku: response.sku,
      weight: response.weight,
      dimensions: {
        width: response.dimensions.width,
        height: response.dimensions.height,
        depth: response.dimensions.depth,
      },
      warrantyInformation: response.warrantyInformation,
      shippingInformation: response.shippingInformation,
      availabilityStatus: response.availabilityStatus,
      returnPolicy: response.returnPolicy,
      minimumOrderQuantity: response.minimumOrderQuantity,
      thumbnail: response.thumbnail,
      images: response.images,
    };
  }

  /**
   * Maps DummyJSON products list response to paginated domain model
   */
  static toPaginatedDomain(response: {
    products: DummyJsonProductResponse[];
    total: number;
    skip: number;
    limit: number;
  }): PaginatedResponse<Product> {
    return {
      items: response.products.map((product) => this.toDomain(product)),
      total: response.total,
      skip: response.skip,
      limit: response.limit,
    };
  }
}
