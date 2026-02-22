import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

type CradleToGraveLifecycleAnalysisProps = {
  claudeStream: boolean;
  analysisOptions: AnalysisOptions;
  productSpecificationID: string;
  image_file: File;
};

type AnalysisOptions = {
  include_geographic_mapping?: boolean;
  include_timeline_analysis?: boolean;
  include_equivalency_comparisons?: boolean;
  include_supply_chain_mapping?: boolean;
  equivalency_categories?: string[];
};

const CradleToGraveLifecycleAnalysisFn = async (data: CradleToGraveLifecycleAnalysisProps) => {
  const formData = new FormData();

  const option = {
    ...data.analysisOptions,
    include_geographic_mapping: true,
  };

  formData.append('productSpecificationID', data.productSpecificationID);
  formData.append('analysis_options', JSON.stringify(option));
  formData.append('image_file', data.image_file);

  const response = await axios.post(API_ENDPOINTS.AI.CRADLE_TO_GRAVE_LIFECYCLE_ANALYSIS, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const useCradleToGraveLifecycleAnalysis = () => {
  const { isPending, error, mutateAsync: cradleToGraveLifecycleAnalysis } = useMutation({
    mutationFn: (data: CradleToGraveLifecycleAnalysisProps) => CradleToGraveLifecycleAnalysisFn(data),
  });
  return { isPending, error, cradleToGraveLifecycleAnalysis };
};
