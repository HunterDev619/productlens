import type { BaseResponse } from '../base';
import { useMutation, useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type DownloadImageResponse = {
  url: string;
  metadata: FileMetadata;
};

export type FileMetadata = {
  id: string;
  userId: string;
  bucketName: string;
  imageKey: string;
  size: number;
  etag: any;
  contentType: string;
  metadata: Metadata;
  lastModified: string;
  createdAt: string;
  updatedAt: string;
};

export type Metadata = {
  uploadedAt: string;
  originalName: string;
};

const downloadImageFn = async (imageId: string) => {
  const response = await axios.get<BaseResponse<DownloadImageResponse>>(`${API_ENDPOINTS.IMAGES.DOWNLOAD.replace('{id}', imageId)}`);
  return response.data.data;
};

export const useDownloadImageMutation = () => {
  const { mutateAsync: downloadImage, isPending, error } = useMutation({
    mutationFn: downloadImageFn,
  });
  return { downloadImage, isPending, error };
};

export const useDownloadImage = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['downloadImage', id],
    queryFn: () => downloadImageFn(id),
  });

  return { data, isLoading, error };
};
