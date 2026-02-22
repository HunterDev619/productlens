'use client';

import type { BaseResponse } from '@/services/base';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

// Local types to avoid build-time resolution issues
type UserStatistics = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  emailUsers: number;
  googleUsers: number;
  githubUsers: number;
  twoFactorEnabled: number;
  usersToday: number;
  usersThisWeek: number;
  usersThisMonth: number;
};

type UserStatisticsDetails = {
  statisticsTime: string[];
  totalUsers: number[];
  activeUsers: number[];
  inactiveUsers: number[];
  recentUsers: number[];
  twoFactorEnabled: number[];
};

type UserStatisticsOverview = {
  statistics: UserStatistics;
  statisticsDetails: UserStatisticsDetails;
};

export type UserStatisticsOverviewResponse = BaseResponse<UserStatisticsOverview>;
export type UserStatisticsOverviewParams = {
  created_time_filter?: [string, string]; // ISO datetime range (start, end)
  updated_at_filter?: [string, string]; // ISO datetime range (start, end)
  email_authenticated?: boolean; // filter users with verified email
  phone_authenticated?: boolean; // filter users with verified phone
};

async function getUserStatisticsOverview(params: UserStatisticsOverviewParams): Promise<UserStatisticsOverviewResponse> {
  const paramsObject = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined));

  const response = await axios.get<UserStatisticsOverviewResponse>(API_ENDPOINTS.ADMIN.USERS.STATISTICS, {
    params: {
      ...paramsObject,
      created_time_filter: JSON.stringify(params.created_time_filter),
      updated_at_filter: JSON.stringify(params.updated_at_filter),
    },
  });
  return response.data;
}

export const useUserStatisticsOverview = (params: UserStatisticsOverviewParams) => {
  return useQuery({
    queryKey: ['user-statistics-overview', params],
    queryFn: () => getUserStatisticsOverview(params),
    staleTime: 0, // never stale
    gcTime: 0, // never garbage collect
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
