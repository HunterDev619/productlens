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
  battery_model?: string;
  manufacturer_name?: string;
  battery_category?: string;
  carbon_footprint_class?: string;
  carbon_footprint_total?: number;
};

const normalizeBatteryPassport = (record: ApiBatteryPassportRecord): UiBatteryPassport => {
  const payload = record.data ?? {};
  const identification = (payload.identification ?? {}) as Record<string, unknown>;
  const carbon = (payload.carbon ?? {}) as Record<string, unknown>;
  const technical = (payload.technical ?? {}) as Record<string, unknown>;
  const sustainability = (payload.sustainability ?? {}) as Record<string, unknown>;

  const passport_id = record.passportId ?? payload.passport_id;
  const status = record.status ?? payload.status;

  return {
    id: record.id,
    passport_id,
    status,
    identification,
    carbon,
    technical,
    sustainability,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
    battery_model: (identification.battery_model as string | undefined),
    manufacturer_name: (identification.manufacturer as string | undefined) ?? (identification.manufacturer_name as string | undefined),
    battery_category: (identification.application as string | undefined) ?? (identification.battery_category as string | undefined) ?? (record.category as string | undefined),
    carbon_footprint_class: (identification.carbon_footprint_class as string | undefined) ?? (carbon.footprint_class as string | undefined),
    carbon_footprint_total: (identification.carbon_footprint_total as number | undefined) ?? (carbon.footprint_total_kgco2e as number | undefined),
  };
};

export type ListBatteryPassportsParams = {
  status?: 'draft' | 'submitted' | 'approved' | 'rejected';
  category?: string;
  limit?: number;
  offset?: number;
};

export type ListBatteryPassportsResponse = BaseResponse<{ passports: UiBatteryPassport[] }>;

export const listBatteryPassports = async (params: ListBatteryPassportsParams = {}) => {
  const response = await axios.get<BaseResponse<{ passports: ApiBatteryPassportRecord[] }>>(API_ENDPOINTS.BATTERY_PASSPORTS.LIST, { params });
  const passports = (response.data.data?.passports ?? []).map(normalizeBatteryPassport);
  return {
    ...response.data,
    data: {
      passports,
    },
  } satisfies ListBatteryPassportsResponse;
};
