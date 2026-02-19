/**
 * Product Detail Component
 */

"use client";

import { useRouter } from "next/navigation";
import { Box, Heading, Button, Spinner, Badge } from "@chakra-ui/react";
import { useProduct } from "@/features/products/hooks/useProducts";

interface ProductDetailProps {
  id: number;
}

export function ProductDetailPage({ id }: ProductDetailProps) {
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading) {
    return (
      <Box className="flex justify-center py-12">
        <Spinner className="h-8 w-8 text-blue-600" />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-600">Failed to load product</p>
      </Box>
    );
  }

  return (
    <Box className="space-y-6">
      <Button
        onClick={() => router.back()}
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        ← Back to Products
      </Button>

      <Box className="grid gap-8 md:grid-cols-2">
        {/* Images */}
        <Box>
          <Box className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </Box>
          <Box className="mt-4 grid grid-cols-4 gap-2">
            {product.images.slice(0, 4).map((img, idx) => (
              <Box key={idx} className="aspect-square overflow-hidden rounded-md bg-gray-100">
                <img
                  src={img}
                  alt={`${product.title} ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Details */}
        <Box className="space-y-6">
          <Box>
            <Heading className="mb-2 text-3xl font-bold text-gray-900">{product.title}</Heading>
            <Box className="flex items-center gap-2">
              <Badge className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                {product.category}
              </Badge>
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
            </Box>
          </Box>

          <Box>
            <Box className="mb-2 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <span className="text-xl text-gray-500 line-through">
                  ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                </span>
              )}
            </Box>
            {product.discountPercentage > 0 && (
              <Badge className="rounded bg-green-100 px-2 py-1 text-sm font-semibold text-green-800">
                {product.discountPercentage.toFixed(0)}% OFF
              </Badge>
            )}
          </Box>

          <Box>
            <p className="text-gray-700">{product.description}</p>
          </Box>

          <Box className="space-y-2 border-t border-gray-200 pt-4">
            <Box className="flex justify-between text-sm">
              <span className="text-gray-600">Brand:</span>
              <span className="font-medium text-gray-900">{product.brand}</span>
            </Box>
            <Box className="flex justify-between text-sm">
              <span className="text-gray-600">SKU:</span>
              <span className="font-medium text-gray-900">{product.sku}</span>
            </Box>
            <Box className="flex justify-between text-sm">
              <span className="text-gray-600">Stock:</span>
              <span
                className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
              </span>
            </Box>
            <Box className="flex justify-between text-sm">
              <span className="text-gray-600">Availability:</span>
              <span className="font-medium text-gray-900">{product.availabilityStatus}</span>
            </Box>
          </Box>

          <Box className="space-y-2 border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              <strong>Warranty:</strong> {product.warrantyInformation}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Shipping:</strong> {product.shippingInformation}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Return Policy:</strong> {product.returnPolicy}
            </p>
          </Box>

          {product.tags.length > 0 && (
            <Box className="flex flex-wrap gap-2">
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
