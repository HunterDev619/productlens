import type { BaseResponse } from '../base';
import type { ProductPart } from '../types';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { axios } from '@/libs/axios';

type FindProductSpecificationsV2PropsJson = {
  image_url: string;
  signal?: AbortSignal;
};

type FindProductSpecificationsV2PropsFormData = {
  image_file: File;
  signal?: AbortSignal;
};

export type FindProductSpecificationsV2Response = BaseResponse<{
  product_data: ProductData | null;
  product_specification_id?: string | null;
  raw_material_composition_id?: string | null;
  analysis_id?: string | null;
  image_id?: string | null;
  timestamp?: string | null;
}>;

export type ProductData = {
  product_information?: ProductInformation | null;
  product_specifications?: ProductSpecifications | null;
  material_composition?: MaterialComposition | null;
  data_sources?: DataSource[] | null;
  usage?: UsageInfo | null;
};

export type ProductInformation = {
  product_name?: string | null;
  product_general_name?: string | null;
  manufacturer?: string | null;
  sku_number?: string | null;
  origin?: string | null;
  lifespan?: number | null;
  total_weight?: number | null;
  total_weight_unit?: string | null;
  category_name?: string[] | null;
  market_price?: number[] | null;

  // nested "product_information" key
  product_information?: {
    product_name?: string | null;
    product_general_name?: string | null;
    category_name?: string[] | null;
    manufacturer?: string | null;
    origin?: string | null;
    SKU_number?: string | null;
    lifespan?: number | null;
    market_price?: number[] | null;
    total_weight?: number | null;
    total_weight_unit?: string | null;
  } | null;
};

export type ProductSpecifications = {
  list_of_parts?: ProductPart[] | null;
  dimensions?: number[] | null;
  dimensions_unit?: string | null;
  key_features?: string[] | null;
  total_capacity?: number | null;
  total_capacity_unit?: string | null;
  weight?: number | null;
  weight_unit?: string | null;
  energy_consumption?: number | null;
  energy_consumption_unit?: string | null;
};

export type MaterialComposition = {
  total_weight?: number | null;
  total_weight_unit?: string | null;

  material_composition?: {
    total_weight?: number | null;
    total_weight_unit?: string | null;
    materials?: Material[] | null;
    summary?: MaterialSummary | null;
  } | null;

  summary?: MaterialSummary | null;
  materials?: Material[] | null;
};

export type Material = {
  material_name?: string | null;
  materialName?: string | null; // handle both snake_case and camelCase
  materialType?: string | null;
  material_type?: string | null;

  weight?: number | null;
  weightUnit?: string | null;
  weight_unit?: string | null;
  percentage?: number | null;

  carbonFactor?: number | null;
  carbonFactorUnit?: string | null;
  carbon_factor?: number | null;
  carbon_factor_unit?: string | null;

  carbonEmissions?: number | null;
  carbon_emissions?: number | null;

  source?: string | null;
  sustainabilityNotes?: string | null;
  sustainability_notes?: string | null;

  recyclable?: boolean | null;
  renewable?: boolean | null;
};

export type MaterialSummary = {
  total_carbon_footprint?: number | null;
  carbon_footprint_unit?: string | null;
  recyclability_score?: number | null;
  sustainability_rating?: string | null;
  primary_materials?: string[] | null;
};

export type DataSource = {
  source_title?: string | null;
  source_url?: string | null;
  source_description?: string | null;
};

export type UsageInfo = {
  input_tokens?: number | null;
  output_tokens?: number | null;
};

const findProductSpecificationsV2Fn = async (data: FindProductSpecificationsV2PropsJson | FindProductSpecificationsV2PropsFormData): Promise<FindProductSpecificationsV2Response> => {
  const formData = new FormData();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if ('image_url' in data) {
    formData.append('image_url', data.image_url);
  } else {
    formData.append('image_file', data.image_file);
    headers['Content-Type'] = 'multipart/form-data';
  }

  const config: any = {
    headers,
  };

  // Add signal if provided
  if ('signal' in data && data.signal) {
    config.signal = data.signal;
  }

  const response = await axios.post<FindProductSpecificationsV2Response>(API_ENDPOINTS.AI.FIND_PRODUCT_SPECIFICATIONS_V2, formData, config);

  return response.data;
};

export function useFindProductSpecificationsV2() {
  const {
    error,
    isPending,
    mutateAsync: findProductSpecificationsV2,
  } = useMutation({
    mutationFn: findProductSpecificationsV2Fn,
  });

  return {
    error,
    loading: isPending,
    mutateAsync: findProductSpecificationsV2,
  };
}

export type MaterialJson = {
  material_name: string | null;
  type: string | null;
  origin: string | null;
  weight: number | null;
  percentage: number | null;
  carbon_factor: number | null;
  material_type: string | null;
  recyclable: boolean | null;
  renewable: boolean | null;
  source?: string | null; // Optional: Source of reference
};

export type ProductBody = {
  product_name: string | null;
  market_price: any; // [min_price, max_price]
  category_name: string[] | null;
  manufacturer: string | null;
  SKU_number: string | null;
  origin: string | null;
  lifespan: number | null;
  total_weight: number | null;
  key_features: string[] | null;
  total_capacity: number | null;
  total_capacity_unit: string | null;
  dimensions: any;
  dimensions_unit: string | null;
  energy_consumption: number | null;
  energy_consumption_unit: string | null;
  total_carbon_footprint: number | null;
  carbon_footprint_unit: string | null;
  materials_json: MaterialJson[];
};

const importProductDataFn = async (data: ProductBody & { signal?: AbortSignal }): Promise<FindProductSpecificationsV2Response> => {
  const { signal, ...payload } = data;
  const config: any = {};
  if (signal) {
    config.signal = signal;
  }
  const response = await axios.post<FindProductSpecificationsV2Response>(API_ENDPOINTS.AI.IMPORT_PRODUCT_DATA, payload, config);
  return response.data;
};

export function useImportProductData() {
  const {
    error,
    isPending,
    mutateAsync: importProductData,
  } = useMutation({
    mutationFn: importProductDataFn,
  });

  return {
    error,
    loading: isPending,
    mutateAsync: importProductData,
  };
};
