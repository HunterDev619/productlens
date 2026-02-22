'use client';

import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

const INFINITE_QUERY_LIMIT = 100000000000000;

export type ProductSpecificationsResponse = {
  data: ProductSpecification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ProductSpecification = {
  id: string;
  userId?: string;
  productName: string;
  productGeneralName?: string;
  manufacturer?: string;
  skuNumber?: string;
  origin?: string;
  lifespan?: number;
  totalWeight?: string;
  totalWeightUnit?: string;
  dimensions?: string[];
  dimensionsUnit?: string;
  categoryName?: string[];
  marketPrice?: string[];
  productInformation: ProductInformation;
  productSpecifications: ProductSpecifications;
  dataSources: DataSource[];
  verificationStatus: string;
  confidenceScore: string;
  createdAt: string;
  updatedAt: string;
  imageId?: string;
};

export type ProductInformation = {
  origin?: string;
  lifespan?: number;
  SKU_number?: string;
  manufacturer?: string;
  market_price?: number[];
  product_name?: string;
  category_name?: string[];
  total_weight_unit?: string;
  product_general_name?: string;
  total_weight?: number;
};

export type ProductSpecifications = {
  weight?: number;
  dimensions: number[];
  weight_unit?: string;
  key_features: string[];
  total_capacity?: number;
  dimensions_unit?: string;
  energy_consumption: any;
  total_capacity_unit?: string;
  energy_consumption_unit?: string;
};

export type DataSource = {
  source_url?: string;
  source_title?: string;
  source_description?: string;
  type?: string;
  title?: string;
  name?: string;
  description?: string;
  domain?: string;
  reliability?: string;
  url?: string;
  last_updated?: string;
};

const getAdminProductSpecificationsList = async (): Promise<ProductSpecificationsResponse> => {
  const response = await axios.get(API_ENDPOINTS.ADMIN.PRODUCT_SPECIFICATIONS.LIST, {
    params: {
      limit: INFINITE_QUERY_LIMIT,
    },
  });
  return response.data.data as ProductSpecificationsResponse;
};

export const useAdminProductSpecificationsList = () => {
  return useQuery({
    queryKey: ['admin-product-specifications-list'],
    queryFn: getAdminProductSpecificationsList,
    refetchOnMount: true,
    staleTime: 0,
  });
};
