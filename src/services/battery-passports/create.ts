import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';
import type { BaseResponse } from '@/services/base';
import type { BatteryPassportPayload } from '@/types/battery-passport';

export type CreateBatteryPassportResponse = BaseResponse<{ id: string }>;

export const createBatteryPassport = async (payload: BatteryPassportPayload) => {
  const response = await axios.post<CreateBatteryPassportResponse>(API_ENDPOINTS.BATTERY_PASSPORTS.CREATE, payload);
  return response.data;
};
