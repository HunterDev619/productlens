import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';
import type { BaseResponse } from '@/services/base';

export type DeleteBatteryPassportResponse = BaseResponse<{}>;

export const deleteBatteryPassport = async (passportId: string) => {
  const url = API_ENDPOINTS.BATTERY_PASSPORTS.DELETE.replace('{passportId}', encodeURIComponent(passportId));
  const response = await axios.delete<DeleteBatteryPassportResponse>(url);
  return response.data;
};
