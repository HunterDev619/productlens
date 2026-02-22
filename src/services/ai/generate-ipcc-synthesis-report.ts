import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { axios } from '@/libs/axios';

type GenerateIpccSynthesisReportProps = {
  productSpecificationID: string;
  materialCompositionID: string;
  claudeStream: boolean;
};

export const generateIpccSynthesisReportFn = async (data: GenerateIpccSynthesisReportProps) => {
  const response = await axios.post(API_ENDPOINTS.AI.GENERATE_IPCC_SYNTHESIS_REPORT, data);
  return response.data.data;
};

export const useGenerateIpccSynthesisReport = () => {
  const { isPending, error, mutateAsync: generateIpccSynthesisReport } = useMutation({
    mutationFn: (data: GenerateIpccSynthesisReportProps) => generateIpccSynthesisReportFn(data),
  });
  return { isPending, error, generateIpccSynthesisReport };
};
