import type { BaseResponse } from '../base';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

type AnalyseRawMaterialCompositionProps = {
  include_carbon_factors: boolean;
  include_sustainability_metrics: boolean;
  search_depth: string;
};

export type AnalyseRawMaterialComposition = {
  material_composition: MaterialComposition;
  data_sources: DataSource[];
  raw_material_composition_id: string;
  usage: Usage;
  timestamp: string;
};

export type MaterialComposition = {
  total_weight: number;
  total_weight_unit: string;
  materials: Material[];
  summary: Summary;
};

export type Material = {
  material_name: string;
  weight: number;
  weight_unit: string;
  percentage: number;
  carbon_factor: number;
  carbon_factor_unit: string;
  carbon_emissions: number;
  material_type: string;
  source: string;
  sustainability_notes: string;
};

export type Summary = {
  total_carbon_footprint: number;
  carbon_footprint_unit: string;
  primary_materials: string[];
  recyclability_score: number;
  sustainability_rating: string;
};

export type DataSource = {
  source_title: string;
  source_url: string;
  source_description: string;
};

export type Usage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

export const analyseRawMaterialCompositionFn = async (productSpecificationID: string, analysis_options: AnalyseRawMaterialCompositionProps, claudeStream: boolean = true) => {
  const options = {
    ...analysis_options,
    include_carbon_factors: true,
    include_sustainability_metrics: true,
    search_depth: 'detailed',
  };

  const response = await axios.post<BaseResponse<AnalyseRawMaterialComposition>>(API_ENDPOINTS.AI.ANALYSE_RAW_MATERIAL_COMPOSITIONL, {
    productSpecificationID,
    analysis_options: options,
    claudeStream,
  });
  return response.data.data;
};

export const useAnalyseRawMaterialComposition = () => {
  const { isPending, error, mutateAsync: analyseRawMaterialComposition } = useMutation({
    mutationFn: ({ productSpecificationID, analysis_options, claudeStream }: {
      productSpecificationID: string;
      analysis_options: AnalyseRawMaterialCompositionProps;
      claudeStream?: boolean;
    }) => analyseRawMaterialCompositionFn(productSpecificationID, analysis_options, claudeStream),
  });
  return { isPending, error, analyseRawMaterialComposition };
};
