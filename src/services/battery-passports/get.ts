import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';
import type { BaseResponse } from '@/services/base';

type ApiBatteryPassportRecord = {
  id?: string;
  userId?: string;
  passportId?: string;
  status?: string;
  data?: {
    passport_id?: string;
    status?: string;
    identification?: Record<string, unknown>;
    carbon?: Record<string, unknown>;
    technical?: Record<string, unknown>;
    sustainability?: Record<string, unknown>;
    [key: string]: unknown;
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export type UiBatteryPassport = {
  id?: string;
  passport_id?: string;
  status?: string;
  identification?: Record<string, unknown>;
  carbon?: Record<string, unknown>;
  technical?: Record<string, unknown>;
  sustainability?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

const normalizeBatteryPassport = (record: ApiBatteryPassportRecord): UiBatteryPassport => {
  const payload = record.data ?? {};
  return {
    ...payload,
    id: record.id,
    passport_id: record.passportId ?? payload.passport_id,
    status: record.status ?? payload.status,
    identification: payload.identification ?? {},
    carbon: payload.carbon ?? {},
    technical: payload.technical ?? {},
    sustainability: payload.sustainability ?? {},
    created_at: record.createdAt,
    updated_at: record.updatedAt,
  };
};

export type GetBatteryPassportResponse = BaseResponse<{ passport: UiBatteryPassport }>;

export const getBatteryPassport = async (passportId: string) => {
  const url = API_ENDPOINTS.BATTERY_PASSPORTS.DETAIL.replace('{passportId}', encodeURIComponent(passportId));
  const response = await axios.get<BaseResponse<{ passport: ApiBatteryPassportRecord | UiBatteryPassport }>>(url);
  const raw = response.data.data?.passport;
  const passport = (raw && typeof raw === 'object' && 'data' in raw)
    ? normalizeBatteryPassport(raw as ApiBatteryPassportRecord)
    : (raw as UiBatteryPassport);

  return {
    ...response.data,
    data: {
      passport,
    },
  } satisfies GetBatteryPassportResponse;
};
