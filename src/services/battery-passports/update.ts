import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';
import type { BaseResponse } from '@/services/base';
import type { BatteryPassportPayload } from '@/types/battery-passport';

export type UpdateBatteryPassportResponse = BaseResponse<{ id: string; passport_id: string; status: string; updated_at: string }>;

export const updateBatteryPassport = async (passportId: string, payload: Partial<BatteryPassportPayload>) => {
  const url = API_ENDPOINTS.BATTERY_PASSPORTS.UPDATE.replace('{passportId}', encodeURIComponent(passportId));
  const response = await axios.patch<UpdateBatteryPassportResponse>(url, payload);
  return response.data;
};
