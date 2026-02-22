import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';
import { useMutation } from '@tanstack/react-query';
import type { BaseResponse } from '../base';

type GenerateLCAAnalysisResponseV2Props = {
  productSpecificationID: string;
  materialCompositionID: string;
};

export type GenerateLCAAnalysisResponseV2Response = BaseResponse<{
  analysis?: Analysis | null;
  ipcc_report?: IPCCReport | null;
  citations?: Citation[] | null;
  ipcc_report_id?: string | null;
  lca_analysis_id?: string | null;
  usage?: UsageInfo | null;
  timestamp?: string | null;
} | null>;

/* ---------------------------- ANALYSIS SECTION ---------------------------- */
export type Analysis = {
  main_lca_analysis?: string | null;
  geographic_analysis?: GeographicAnalysis | null;
  timeline_analysis?: TimelineAnalysis | null;
  equivalency_comparisons?: EquivalencyComparisons | null;
  supply_chain_mapping?: SupplyChainMapping | null;
};

/* ----------------------- GEOGRAPHIC ANALYSIS ----------------------- */
export type GeographicAnalysis = {
  supply_chain_mapping?: GeographicSupplyChainMapping | null;
  regional_impact_intensity?: RegionalImpactIntensity | null;
  emission_hotspots?: EmissionHotspot[] | null;
};

export type GeographicSupplyChainMapping = {
  raw_materials?: RawMaterialSource[] | null;
  manufacturing_hubs?: ManufacturingHub[] | null;
  distribution_routes?: DistributionRoute[] | null;
};

export type RawMaterialSource = {
  material?: string | null;
  source_countries?: string[] | null;
  emissions_by_country?: Record<
    string,
    { co2e?: number | null; intensity?: string | null }
  > | null;
};

export type ManufacturingHub = {
  location?: string | null;
  coordinates?: [number, number] | null;
  emissions?: number | null;
  grid_carbon_intensity?: number | null;
  processes?: string[] | null;
};

export type DistributionRoute = {
  from?: string | null;
  to?: string | null;
  distance_km?: number | null;
  transport_mode?: string | null;
  emissions?: number | null;
  route_coordinates?: [number, number][] | null;
};

export type RegionalImpactIntensity = {
  high_impact_regions?: string[] | null;
  medium_impact_regions?: string[] | null;
  low_impact_regions?: string[] | null;
};

export type EmissionHotspot = {
  location?: string | null;
  emission_intensity?: number | null;
  primary_cause?: string | null;
  mitigation_potential?: string | null;
};

/* ----------------------- TIMELINE ANALYSIS ----------------------- */
export type TimelineAnalysis = {
  lifecycle_progression?: LifecycleStage[] | null;
  emission_velocity?: EmissionVelocity | null;
  milestones?: TimelineMilestone[] | null;
};

export type LifecycleStage = {
  stage?: string | null;
  duration_days?: number | null;
  emissions?: number | null;
  key_activities?: string[] | null;
};

export type EmissionVelocity = {
  peak_emission_phase?: string | null;
  daily_average_emissions?: number | null;
  cumulative_emissions?: number | null;
};

export type TimelineMilestone = {
  event?: string | null;
  day?: number | null;
  significance?: string | null;
};

/* ------------------- EQUIVALENCY COMPARISONS ------------------- */
export type EquivalencyComparisons = {
  carbon_footprint_equivalents?: CarbonFootprintEquivalents | null;
  contextual_benchmarks?: ContextualBenchmarks | null;
  visual_metaphors?: VisualMetaphor[] | null;
};

export type CarbonFootprintEquivalents = {
  cars_driven_miles?: number | null;
  gasoline_gallons?: number | null;
  coal_pounds?: number | null;
  tree_seedlings_grown?: number | null;
};

export type ContextualBenchmarks = {
  vs_industry_average?: string | null;
  vs_best_in_class?: string | null;
  improvement_potential?: string | null;
};

export type VisualMetaphor = {
  metaphor?: string | null;
  impact_type?: string | null;
};

/* ------------------- SUPPLY CHAIN MAPPING ------------------- */
export type SupplyChainMapping = {
  tier_breakdown?: TierBreakdown | null;
  transportation_network?: TransportationRoute[] | null;
  traceability_score?: TraceabilityScore | null;
};

export type TierBreakdown = {
  tier_1_suppliers?: number | null;
  tier_2_suppliers?: number | null;
  tier_3_suppliers?: number | null;
  geographical_spread?: string | null;
};

export type TransportationRoute = {
  route?: string | null;
  distance_km?: number | null;
  mode?: string | null;
  emissions_share?: number | null;
};

export type TraceabilityScore = {
  overall_score?: number | null;
  material_traceability?: number | null;
  supplier_transparency?: number | null;
  certification_coverage?: number | null;
};

/* ---------------------------- IPCC REPORT ---------------------------- */
export type IPCCReport = {
  overall_summary?: string | null;
  global_warming_potential_indicator?: ImpactIndicator | null;
  water_consumption_indicator?: ImpactIndicator | null;
  land_use_impact_indicator?: ImpactIndicator | null;
  biodiversity_impact_indicator?: ImpactIndicator | null;
  air_quality_impact?: ImpactIndicator | null;
  waste_generation?: ImpactIndicator | null;
  resource_depletion_indicator?: ImpactIndicator | null;
  human_health_impact?: ImpactIndicator | null;
  ecosystem_quality_impact?: ImpactIndicator | null;
};

export type ImpactIndicator = {
  [key: string]: string | number | null | undefined;
  description?: string | null;
};

/* ---------------------------- CITATIONS & META ---------------------------- */
export type Citation = {
  source_title?: string | null;
  source_url?: string | null;
  source_description?: string | null;
};

export type UsageInfo = {
  input_tokens?: number | null;
  output_tokens?: number | null;
};

const pollIntervalMs = 5000;

export const generateLCAAnalysisReportV2Fn = async (
  data: GenerateLCAAnalysisResponseV2Props,
): Promise<GenerateLCAAnalysisResponseV2Response> => {
  // 1) Start the workflow
  const startRes = await axios.post<{
    data: { workflowInstanceId: string };
  }>(API_ENDPOINTS.AI.GENERATE_ANALYSIS_REPORT_V2_START, data);

  const workflowInstanceId = startRes.data?.data?.workflowInstanceId;
  if (!workflowInstanceId) {
    throw new Error('Missing workflowInstanceId from start response');
  }

  // 2) Poll for completion
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const statusUrl = API_ENDPOINTS.AI.GENERATE_ANALYSIS_REPORT_V2_STATUS.replace(
      '{workflowInstanceId}',
      workflowInstanceId,
    );

    const statusRes = await axios.get<{
      data: {
        status: 'pending' | 'running' | 'complete' | 'failed';
        result?: GenerateLCAAnalysisResponseV2Response['data'];
        error?: string;
      };
    }>(statusUrl);

    const status = statusRes.data?.data?.status;

    if (status === 'complete') {
      return {
        error: '0',
        message: 'Analysis report generated',
        data: statusRes.data.data.result ?? null,
      };
    }

    if (status === 'failed') {
      throw new Error(statusRes.data?.data?.error || 'LCA analysis workflow failed');
    }

    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }
};

export const useGenerateLCAAnalysisReportV2 = () => {
  const { isPending, error, mutateAsync: generateAnalysisReportV2 } = useMutation({
    mutationFn: generateLCAAnalysisReportV2Fn,
    // onSuccess: () => {
    //   toast({
    //     title: 'Analysis report generated successfully',
    //     description: 'The analysis report has been generated successfully',
    //     variant: 'success',
    //   });
    // },
  });
  return { loading: isPending, error, generateAnalysisReportV2 };
};
