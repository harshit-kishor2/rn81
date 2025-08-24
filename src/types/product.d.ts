interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
}
