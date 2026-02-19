/**
 * Product domain model
 * Clean representation of a product entity
 */
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
  thumbnail: string;
  images: string[];
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

/**
 * Product query filters
 */
export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  skip?: number;
  sortBy?: keyof Product;
  order?: "asc" | "desc";
}
