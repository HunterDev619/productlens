'use client';

import type { BaseResponse } from '@/services/base';
import type { Category } from '@/services/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

const INFINITE_QUERY_LIMIT = 10000000;

type CategoriesResponse = {
  data: Category[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

const getAdminCategoriesList = async (): Promise<CategoriesResponse> => {
  const response = await axios.get<BaseResponse<CategoriesResponse>>(API_ENDPOINTS.ADMIN.CATEGORIES.LIST, {
    params: {
      limit: INFINITE_QUERY_LIMIT,
    },
  });
  return response.data.data;
};

export const useAdminListCategories = () => {
  return useQuery({
    queryKey: ['admin-categories-list'],
    queryFn: getAdminCategoriesList,
  });
};

export type CategoryOption = {
  label: string;
  value: string;
};

export const useAdminListCategoryOptions = () => {
  const { data, isLoading, error } = useAdminListCategories();

  const options = useMemo<CategoryOption[]>(() => {
    if (!data?.data) {
      return [];
    }
    return data.data.map(category => ({
      label: category.title,
      value: category.id,
    }));
  }, [data]);

  return {
    options,
    isLoading,
    error,
  };
};
