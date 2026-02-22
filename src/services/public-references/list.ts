'use client';

import type { BaseResponse } from '@/services/base';
import type { Reference } from '@/services/types';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

const INFINITE_QUERY_LIMIT = 10000000;

type PublicReferencesResponse = {
  data: Reference[];
  pagination: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

const getPublicReferencesList = async (): Promise<PublicReferencesResponse> => {
  const response = await axios.get<BaseResponse<PublicReferencesResponse>>(API_ENDPOINTS.PUBLIC_REFERENCES.LIST, {
    params: {
      limit: INFINITE_QUERY_LIMIT,
    },
  });
  return response.data.data;
};

export const useListPublicReferences = () => {
  return useQuery({
    queryKey: ['public-references-list'],
    queryFn: getPublicReferencesList,
  });
};
