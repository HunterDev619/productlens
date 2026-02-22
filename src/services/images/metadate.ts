import type { BaseResponse } from '../base';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type ImageMetadata = any;

export const getImageMetadata = async (imageId: string) => {
  const response = await axios.get<BaseResponse<ImageMetadata>>(`${API_ENDPOINTS.IMAGES.DOWNLOAD.replace('{id}', imageId)}`);
  return response.data.data;
};

export const useGetImageMetadata = (imageId: string) => {
  return useQuery({
    queryKey: ['imageMetadata', imageId],
    queryFn: () => getImageMetadata(imageId),
    select: (data: ImageMetadata) => data.url,
    enabled: !!imageId,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 48,
  });
};
