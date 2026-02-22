import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { toast } from '@/hooks/use-toast';
import { axios } from '@/libs/axios';

const createAnalysisFn = async (data: any) => {
  const response = await axios.post(API_ENDPOINTS.ANALYSIS.CREATE, data);
  return response.data.data;
};

const useCreateAnalysis = () => {
  const queryClient = useQueryClient();
  
  const { isPending, error, mutateAsync: createAnalysis } = useMutation({
    mutationFn: createAnalysisFn,
    onSuccess: () => {
      // Invalidate product specifications list to show new analysis
      queryClient.invalidateQueries({ 
        queryKey: ['product-specifications-list'],
        refetchType: 'all',
      });
      
      toast({
        title: 'Analysis created successfully',
        description: 'The analysis has been created successfully',
        variant: 'success',
      });
    },
  });
  return { isPending, error, createAnalysis };
};

export default useCreateAnalysis;
