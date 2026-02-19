/**
 * Product Detail Page
 * Dynamic route: /products/[id]
 */

import { ProductDetailPage } from "@/features/products/ProductDetail";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  return <ProductDetailPage id={parseInt(id, 10)} />;
}
