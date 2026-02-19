/**
 * Product Service
 * Business logic layer for product operations
 * Depends on IProductRepository abstraction (Dependency Inversion)
 */

import { IProductRepository } from "@/infrastructure/repositories/product.repository.interface";
import { Product, ProductFilters } from "@/domain/product/product.model";
import { Category } from "@/domain/product/category.model";
import { PaginatedResponse } from "@/types/common";

export class ProductService {
  constructor(private repository: IProductRepository) {}

  /**
   * Retrieves paginated products with optional filtering
   */
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    if (filters?.category && filters.category.trim() !== "") {
      const result = await this.repository.getProductsByCategory(
        filters.category,
        filters.limit,
        filters.skip
      );

      if (filters.sortBy && result.items.length > 0) {
        const sortedItems = this.sortProducts(result.items, filters.sortBy, filters.order);
        return {
          ...result,
          items: sortedItems,
        };
      }

      return result;
    }

    return this.repository.getProducts(filters);
  }

  /**
   * Sorts products array by specified field and order
   */
  private sortProducts(
    products: Product[],
    sortBy: keyof Product,
    order: "asc" | "desc" = "asc"
  ): Product[] {
    return [...products].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === undefined || bValue === undefined) {
        return 0;
      }

      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      }

      return order === "desc" ? -comparison : comparison;
    });
  }

  /**
   * Retrieves product by ID
   */
  async getProductById(id: number): Promise<Product> {
    return this.repository.getProductById(id);
  }

  /**
   * Searches products by query string
   */
  async searchProducts(
    query: string,
    limit?: number,
    skip?: number
  ): Promise<PaginatedResponse<Product>> {
    if (!query.trim()) {
      return this.getProducts({ limit, skip });
    }

    return this.repository.searchProducts(query.trim(), limit, skip);
  }

  /**
   * Retrieves products by category
   */
  async getProductsByCategory(
    category: string,
    limit?: number,
    skip?: number
  ): Promise<PaginatedResponse<Product>> {
    return this.repository.getProductsByCategory(category, limit, skip);
  }

  /**
   * Retrieves all available categories
   */
  async getCategories(): Promise<Category[]> {
    return this.repository.getCategories();
  }

  /**
   * Filters products by price range (client-side filtering)
   */
  filterByPriceRange(products: Product[], minPrice?: number, maxPrice?: number): Product[] {
    return products.filter((product) => {
      if (minPrice !== undefined && product.price < minPrice) {
        return false;
      }

      if (maxPrice !== undefined && product.price > maxPrice) {
        return false;
      }

      return true;
    });
  }
}
