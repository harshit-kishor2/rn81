import apiClient from '@app/api/api-client';

export const productApi = {
  getProducts: async (page = 1, limit = 20): Promise<ProductListResponse> => {
    const response = await apiClient.get<ProductListResponse>(`/products?page=${page}&limit=${limit}`);
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<CreateProductRequest>): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  searchProducts: async (query: string): Promise<ProductListResponse> => {
    const response = await apiClient.get<ProductListResponse>(`/products/search?q=${query}`);
    return response.data;
  },
};
