import type { BaseResponse } from '../base';
import type { IpccAr6Report } from '../types';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type IpccAr6ReportDetailResponse = BaseResponse<IpccAr6Report>;

export const getIpccAr6ReportDetail = async (id: string): Promise<IpccAr6ReportDetailResponse> => {
  const response = await axios.get<IpccAr6ReportDetailResponse>(API_ENDPOINTS.IPCC_AR6_REPORTS.DETAIL.replace('{id}', id));
  return response.data;
};

export const useGetIpccAr6ReportDetail = (id: string) => {
  return useQuery({
    queryKey: ['ipcc-ar6-report-detail', id],
    queryFn: () => getIpccAr6ReportDetail(id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    enabled: !!id,
  });
};
