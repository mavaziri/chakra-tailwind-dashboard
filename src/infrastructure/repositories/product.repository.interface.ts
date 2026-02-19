/**
 * Product Repository Interface
 * Defines contract for product data operations
 */

import { Product, ProductFilters } from "@/domain/product/product.model";
import { Category } from "@/domain/product/category.model";
import { PaginatedResponse } from "@/types/common";

export interface IProductRepository {
  /**
   * Retrieves paginated products list with optional filters
   */
  getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>>;

  /**
   * Retrieves single product by ID
   */
  getProductById(id: number): Promise<Product>;

  /**
   * Searches products by query
   */
  searchProducts(query: string, limit?: number, skip?: number): Promise<PaginatedResponse<Product>>;

  /**
   * Retrieves products by category
   */
  getProductsByCategory(
    category: string,
    limit?: number,
    skip?: number
  ): Promise<PaginatedResponse<Product>>;

  /**
   * Retrieves all available categories
   */
  getCategories(): Promise<Category[]>;
}
