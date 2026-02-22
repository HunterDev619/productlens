'use client';

import type { BaseResponse } from '@/services/base';
import type { Reference } from '@/services/types';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

const INFINITE_QUERY_LIMIT = 10000000;

type ReferencesResponse = {
  data: Reference[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

const getAdminReferencesList = async (): Promise<ReferencesResponse> => {
  const response = await axios.get<BaseResponse<ReferencesResponse>>(API_ENDPOINTS.ADMIN.REFERENCES.LIST, {
    params: {
      limit: INFINITE_QUERY_LIMIT,
    },
  });
  return response.data.data;
};

export const useAdminListReferences = () => {
  return useQuery({
    queryKey: ['admin-references-list'],
    queryFn: getAdminReferencesList,
  });
};
