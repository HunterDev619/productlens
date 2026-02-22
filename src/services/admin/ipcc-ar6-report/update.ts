import type { UpdateIpccReportDTO } from '@/schemas/admin/ipcc-ar6-reports';
import type { BaseResponse } from '@/services/base';
import type { IpccAr6Report } from '@/services/types';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type AdminUpdateIpccReportBody = UpdateIpccReportDTO;

export type AdminUpdateIpccReportResponse = BaseResponse<IpccAr6Report>;

export const adminUpdateIpccReportFn = async (id: string, body: AdminUpdateIpccReportBody): Promise<AdminUpdateIpccReportResponse> => {
  const response = await axios.patch<AdminUpdateIpccReportResponse>(API_ENDPOINTS.ADMIN.IPCC_AR6_REPORTS.UPDATE.replace('{id}', id), body);
  return response.data;
};

export const useAdminUpdateIpccReportMutation = (id: string) => {
  const {
    error,
    isPending,
    mutateAsync: adminUpdateIpccReport,
  } = useMutation({
    mutationFn: (body: AdminUpdateIpccReportBody) => adminUpdateIpccReportFn(id, body),
  });

  return {
    error,
    loading: isPending,
    mutateAsync: adminUpdateIpccReport,
  };
};
