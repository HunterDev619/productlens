import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { toast } from '@/hooks/use-toast';
import axios from '@/libs/axios';

const deleteUserFn = async (userId: string) => {
  const response = await axios.delete(API_ENDPOINTS.ADMIN.USERS.DELETE.replace('{id}', userId));
  return response.data.data;
};

export const useDeleteUser = () => {
  const {
    mutateAsync: deleteUser,
    isPending,
    error,
  } = useMutation({
    mutationFn: deleteUserFn,
    onSuccess: () => {
      toast({
        title: 'User deleted successfully',
        description: 'The user has been deleted successfully',
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'error',
      });
    },
  });

  return {
    deleteUser,
    isPending,
    error,
  };
};
