import type { BaseResponse } from '@/services/base';
import type { Reference } from '@/services/types';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type PublicReferenceDetailResponse = BaseResponse<Reference>;

export const getPublicReferenceDetail = async (id: string): Promise<PublicReferenceDetailResponse> => {
  const response = await axios.get<PublicReferenceDetailResponse>(API_ENDPOINTS.PUBLIC_REFERENCES.DETAIL.replace('{id}', id));
  return response.data;
};

export const useGetPublicReference = (id: string) => {
  return useQuery({
    queryKey: ['public-references-detail', id],
    queryFn: () => getPublicReferenceDetail(id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    enabled: !!id,
  });
};
