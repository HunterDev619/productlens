import type { BaseResponse } from '@/services/base';
import type { Reference } from '@/services/types';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type AdminReferenceDetailResponse = BaseResponse<Reference>;

export const getReferenceDetail = async (id: string): Promise<AdminReferenceDetailResponse> => {
  const response = await axios.get<AdminReferenceDetailResponse>(API_ENDPOINTS.ADMIN.REFERENCES.DETAIL.replace('{id}', id));
  return response.data;
};

export const useGetReference = (id: string) => {
  return useQuery({
    queryKey: ['admin-references-detail', id],
    queryFn: () => getReferenceDetail(id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    enabled: !!id,
  });
};
