import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

const uploadImageFn = async (image: File) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('bucket_name', 'productlens_images');

  const response = await axios.post(API_ENDPOINTS.IMAGES.UPLOAD, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const useUploadImage = () => {
  const { mutateAsync: uploadImage, isPending, error } = useMutation({
    mutationFn: uploadImageFn,
  });
  return { uploadImage, isPending, error };
};
