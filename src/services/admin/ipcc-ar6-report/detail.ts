import type { BaseResponse } from '@/services/base';
import type { IpccAr6Report } from '@/services/types';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type AdminIpccAr6ReportDetailResponse = BaseResponse<IpccAr6Report>;

export const getAdminIpccAr6ReportDetail = async (id: string): Promise<AdminIpccAr6ReportDetailResponse> => {
  const response = await axios.get<AdminIpccAr6ReportDetailResponse>(API_ENDPOINTS.IPCC_AR6_REPORTS.DETAIL.replace('{id}', id));
  return response.data;
};

export const useAdminGetIpccAr6ReportDetail = (id: string) => {
  return useQuery({
    queryKey: ['admin-ipcc-ar6-report-detail', id],
    queryFn: () => getAdminIpccAr6ReportDetail(id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
};
