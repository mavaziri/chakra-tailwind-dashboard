/**
 * Products List Component
 * Client component with search, filters, and pagination
 */

"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Heading, Input, Spinner } from "@chakra-ui/react";
import { useProducts, useProductSearch, useCategories } from "./hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { Select, GroupedOption } from "@/components/select";
import { Product, ProductFilters } from "@/domain/product/product.model";
import { Category } from "@/domain/product/category.model";

export function ProductsListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string[]>(["title"]);
  const [sortOrder, setSortOrder] = useState<string[]>(["asc"]);
  const [page, setPage] = useState(1);
  const [limit] = useState(30);

  const debouncedSearch = useDebounce(search, 500);
  const skip = (page - 1) * limit;

  const { data: categories } = useCategories();

  // Build filters
  const filters: ProductFilters = useMemo(
    () => ({
      limit,
      skip,
      category: selectedCategory[0],
      sortBy: sortBy[0] as keyof Product,
      order: sortOrder[0] as "asc" | "desc",
    }),
    [limit, skip, selectedCategory, sortBy, sortOrder]
  );

  const shouldSearch = debouncedSearch.trim().length > 0;
  const productsQuery = useProducts(filters);
  const searchQueryResult = useProductSearch(debouncedSearch, limit, skip);

  const query = shouldSearch ? searchQueryResult : productsQuery;
  const { data, isLoading, error } = query;

  // Calculate pagination values
  const totalPages = Math.ceil((data?.total ?? 0) / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  // Reset page when search or filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, sortBy, sortOrder]);

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  // Category options for select
  const categoryOptions: GroupedOption<string>[] = useMemo(
    () => [
      {
        options: [
          { label: "All Categories", value: "" },
          ...(categories || []).map((cat: Category) => ({
            label: cat.name,
            value: cat.slug,
          })),
        ],
      },
    ],
    [categories]
  );

  const sortOptions: GroupedOption<string>[] = [
    {
      options: [
        { label: "Title", value: "title" },
        { label: "Price", value: "price" },
        { label: "Rating", value: "rating" },
      ],
    },
  ];

  const orderOptions: GroupedOption<string>[] = [
    {
      options: [
        { label: "Ascending", value: "asc" },
        { label: "Descending", value: "desc" },
      ],
    },
  ];

  return (
    <Box className="space-y-6">
      <Heading className="text-2xl font-bold text-gray-900">Products</Heading>

      {/* Filters */}
      <Box className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Box>
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </Box>

        <Select<string>
          options={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder="Select category"
        />

        <Select<string>
          options={sortOptions}
          value={sortBy}
          onChange={setSortBy}
          placeholder="Sort by"
        />

        <Select<string>
          options={orderOptions}
          value={sortOrder}
          onChange={setSortOrder}
          placeholder="Order"
        />
      </Box>

      {/* Loading */}
      {isLoading && (
        <Box className="flex justify-center py-12">
          <Spinner className="h-8 w-8 text-blue-600" />
        </Box>
      )}

      {/* Error */}
      {error && (
        <Box className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : "Failed to load products"}
          </p>
        </Box>
      )}

      {/* Products Grid */}
      {data && !isLoading && (
        <>
          <Box className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((product: Product) => (
              <Box
                key={product.id}
                onClick={() => router.push(`/products/${product.id}`)}
                className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <Box className="aspect-square w-full overflow-hidden bg-gray-100">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </Box>
                <Box className="p-4">
                  <Heading className="mb-2 text-lg font-semibold text-gray-900">
                    {product.title}
                  </Heading>
                  <p className="mb-2 line-clamp-2 text-sm text-gray-600">{product.description}</p>
                  <Box className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <Box className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm text-gray-600">
                        {product.rating.toFixed(1)}
                      </span>
                    </Box>
                  </Box>
                  <Box className="mt-2 flex items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                      {product.category}
                    </span>
                    <span
                      className={`text-xs font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Pagination */}
          <Box className="flex items-center justify-between">
            <Box className="text-sm text-gray-700">
              Showing {skip + 1} to {Math.min(skip + limit, data.total)} of {data.total} results
            </Box>
            <Box className="flex gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={!hasPreviousPage}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={!hasNextPage}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
