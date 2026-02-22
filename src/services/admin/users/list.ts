'use client';

import type { BaseResponse } from '@/services/base';
import type { User } from '@/services/types';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

const INFINITE_QUERY_LIMIT = 10000000;

type UsersResponse = {
  data: User[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const getAdminUsersList = async (): Promise<UsersResponse> => {
  const response = await axios.get<BaseResponse<UsersResponse>>(API_ENDPOINTS.ADMIN.USERS.LIST, {
    params: {
      limit: INFINITE_QUERY_LIMIT,
    },
  });
  return response.data.data;
};

export const useAdminUsersList = () => {
  return useQuery({
    queryKey: ['admin-users-list'],
    queryFn: getAdminUsersList,
  });
};
