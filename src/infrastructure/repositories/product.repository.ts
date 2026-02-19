/**
 * Product Repository Implementation
 * Handles product data API calls
 */

import { IProductRepository } from "./product.repository.interface";
import { Product, ProductFilters } from "@/domain/product/product.model";
import { Category } from "@/domain/product/category.model";
import { PaginatedResponse } from "@/types/common";
import { HttpClient } from "@/infrastructure/http/http-client";
import { ProductMapper } from "@/infrastructure/mappers/product.mapper";
import { CategoryMapper } from "@/infrastructure/mappers/category.mapper";
import {
  DummyJsonProductsResponse,
  DummyJsonProductResponse,
  DummyJsonCategoryResponse,
} from "@/types/api/dummyjson.types";

export class ProductRepository implements IProductRepository {
  constructor(private httpClient: HttpClient) {}

  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
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
    const url = `/products${queryString ? `?${queryString}` : ""}`;

    const response = await this.httpClient.get<DummyJsonProductsResponse>(url);

    return ProductMapper.toPaginatedDomain(response);
  }

  async getProductById(id: number): Promise<Product> {
    const response = await this.httpClient.get<DummyJsonProductResponse>(`/products/${id}`);

    return ProductMapper.toDomain(response);
  }

  async searchProducts(
    query: string,
    limit?: number,
    skip?: number
  ): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    params.append("q", query);
    if (limit) {
      params.append("limit", limit.toString());
    }

    if (skip) {
      params.append("skip", skip.toString());
    }

    const response = await this.httpClient.get<DummyJsonProductsResponse>(
      `/products/search?${params.toString()}`
    );

    return ProductMapper.toPaginatedDomain(response);
  }

  async getProductsByCategory(
    category: string,
    limit?: number,
    skip?: number
  ): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    if (limit) {
      params.append("limit", limit.toString());
    }

    if (skip) {
      params.append("skip", skip.toString());
    }

    const queryString = params.toString();
    const url = `/products/category/${category}${queryString ? `?${queryString}` : ""}`;

    const response = await this.httpClient.get<DummyJsonProductsResponse>(url);

    return ProductMapper.toPaginatedDomain(response);
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.httpClient.get<DummyJsonCategoryResponse[]>("/products/categories");

    return CategoryMapper.toDomainList(response);
  }
}
