import {productApi} from '@app/api/product.api';
import {firebaseService} from '@app/services/firebase';
import {logger} from '@app/services/logger';
import {useQuery, useMutation, useQueryClient, useInfiniteQuery} from '@tanstack/react-query';


// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), {filters}] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
};

// Get Products with Pagination
export const useProducts = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: productKeys.list(`page-${page}-limit-${limit}`),
    queryFn: () => productApi.getProducts(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
  });
};

// Infinite Query for Product List (for pagination/load more)
export const useInfiniteProducts = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: productKeys.lists(),
    queryFn: ({pageParam = 1}) => productApi.getProducts(pageParam, limit),
    getNextPageParam: (lastPage, pages) => {
      const currentPage = pages.length;
      const totalPages = Math.ceil(lastPage.total / limit);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    initialPageParam: 1,
  });
};

// Get Single Product
export const useProduct = (id: string, enabled = true) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProduct(id),
    enabled: !!id && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes for individual products
  });
};

// Search Products
export const useSearchProducts = (query: string, enabled = true) => {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productApi.searchProducts(query),
    enabled: !!query && query.length > 2 && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

// Create Product Mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productApi.createProduct(data),
    onSuccess: (newProduct) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({queryKey: productKeys.lists()});

      // Add the new product to the cache
      queryClient.setQueryData(productKeys.detail(newProduct.id), newProduct);

      logger.info('Product created successfully', {id: newProduct.id});
      firebaseService.logEvent('product_created', {
        product_id: newProduct.id,
        category: newProduct.category,
      });
    },
    onError: (error) => {
      logger.error('Failed to create product', error);
    },
  });
};

// Update Product Mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: Partial<CreateProductRequest>;}) =>
      productApi.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      // Update the specific product in cache
      queryClient.setQueryData(productKeys.detail(updatedProduct.id), updatedProduct);

      // Invalidate products list to reflect changes
      queryClient.invalidateQueries({queryKey: productKeys.lists()});

      logger.info('Product updated successfully', {id: updatedProduct.id});
      firebaseService.logEvent('product_updated', {product_id: updatedProduct.id});
    },
    onError: (error) => {
      logger.error('Failed to update product', error);
    },
  });
};

// Delete Product Mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({queryKey: productKeys.detail(deletedId)});

      // Invalidate lists to reflect deletion
      queryClient.invalidateQueries({queryKey: productKeys.lists()});

      logger.info('Product deleted successfully', {id: deletedId});
      firebaseService.logEvent('product_deleted', {product_id: deletedId});
    },
    onError: (error) => {
      logger.error('Failed to delete product', error);
    },
  });
};

// Optimistic Update Hook for Quick UI Updates
export const useOptimisticProductUpdate = () => {
  const queryClient = useQueryClient();

  return {
    updateProductOptimistically: (id: string, updates: Partial<Product>) => {
      queryClient.setQueryData(
        productKeys.detail(id),
        (old: Product | undefined) => {
          if (!old) return old;
          return {...old, ...updates};
        }
      );
    },
    revertProductUpdate: (id: string) => {
      queryClient.invalidateQueries({queryKey: productKeys.detail(id)});
    },
  };
};
