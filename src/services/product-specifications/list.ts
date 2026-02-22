import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { axios } from '@/libs/axios';

type PaginationParams = {
  page?: number;
  limit?: number;
  q?: string;
  category?: string; // Added category for filtering
};

export type ProductSpecification = {
  trackingId: string;
  analysisId: string;
  productSpecificationId: string;
  productName: string;
  productGeneralName?: string;
  manufacturer: string;
  marketPrice: number | number[] | string;
  totalWeight?: string;
  totalWeightUnit?: string;
  categoryName: string | string[];
  verificationStatus?: string;
  confidenceScore?: string;
  imageUrl?: string;
  imageId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type ProductSpecificationsResponse = {
  records: ProductSpecification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const getProductSpecificationsList = async (params: PaginationParams = {}): Promise<ProductSpecificationsResponse> => {
  const { page = 1, limit = 20, q, category } = params;
  const requestParams: Record<string, string | number> = { page, limit };

  if (q && q.trim()) {
    requestParams.q = q.trim();
  }

  if (category && category.trim()) {
    requestParams.category = category.trim(); // Add category to request params
  }

  const response = await axios.get(API_ENDPOINTS.USER_ANALYSES.LIST, {
    params: requestParams,
  });
  return response.data.data;
};

export const useGetProductSpecificationsList = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: ['product-specifications-list', params.page, params.limit, params.q, params.category], // Include category in query key
    queryFn: () => getProductSpecificationsList(params),
  });
};
