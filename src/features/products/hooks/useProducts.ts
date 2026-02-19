/**
 * Products React Query Hooks
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Product, ProductFilters } from "@/domain/product/product.model";
import { Category } from "@/domain/product/category.model";
import { PaginatedResponse } from "@/types/common";
import { ServiceFactory } from "@/services/service.factory";
import { queryKeys } from "@/lib/react-query";

export function useProducts(filters?: ProductFilters): UseQueryResult<PaginatedResponse<Product>> {
  const productService = ServiceFactory.getProductService();

  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productService.getProducts(filters),
  });
}

export function useProduct(id: number): UseQueryResult<Product> {
  const productService = ServiceFactory.getProductService();

  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
}

export function useProductSearch(
  query: string,
  limit?: number,
  skip?: number
): UseQueryResult<PaginatedResponse<Product>> {
  const productService = ServiceFactory.getProductService();

  return useQuery({
    queryKey: queryKeys.products.search(query),
    queryFn: () => productService.searchProducts(query, limit, skip),
    enabled: query.length > 0,
  });
}

export function useCategories(): UseQueryResult<Category[]> {
  const productService = ServiceFactory.getProductService();

  return useQuery({
    queryKey: queryKeys.products.categories,
    queryFn: () => productService.getCategories(),
  });
}
