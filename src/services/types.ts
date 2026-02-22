/**
 * Common API types and interfaces
 */

// Generic API response wrapper
export type ApiResponse<T = any> = {
  error: string;
  message: string;
  data: T;
};

// User entity
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type UserProfile = {
  id: string;
  email: string;
  fullname: string;
  picture: string | null;
  userAddress: string | null;
  locale: string;
  status: number;
  provider: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  aud: string;
  phone: string;
  email_confirmed_at?: string;
  app_metadata: {
    provider: string;
    providers: string[];
    role?: string;
  };
  user_metadata: {
    email_verified: boolean;
    fullname: string;
    locale: string;
    picture: string;
    status: number;
    twoFactorEnabled: boolean;
    userAddress: string;
  };
  identities: Array<{
    identity_id: string;
    id: string;
    user_id: string;
    identity_data: {
      email: string;
      email_verified: boolean;
      phone_verified: boolean;
      sub: string;
    };
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
    email: string;
  }>;
  is_anonymous: boolean;
};

export type User = {
  id: string;
  email: string;
  fullname: string;
  picture: string | null;
  userAddress: string | null;
  locale: string;
  status: number;
  provider: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  aud: string;
  phone: string;
  confirmation_sent_at?: string;
  email_confirmed_at?: string;
  app_metadata: {
    provider: string;
    providers: string[];
    role?: string;
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    fullname: string;
    locale: string;
    phone_verified: boolean;
    picture: string;
    role: string;
    sub: string;
    userAddress: string;
    status?: number;
    twoFactorEnabled?: boolean;
  };
  identities: any[];
  is_anonymous: boolean;
};

// Authentication response types
export type LoginResponse = {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
};

export type RefreshResponse = {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
};

export type RegisterResponse = {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
};

// Request types
export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  password: string;
  fullname: string;
  locale: string;
  user_address: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token_hash: string;
  new_password: string;
};

export type AuthenticatedResetPasswordRequest = {
  old_password: string;
  new_password: string;
};

// Error types
export type ApiError = {
  error: string;
  message: string;
  details?: any;
};

export type ProductSpecification = {
  id: string;
  userId?: string | null;
  productName: string;
  productGeneralName?: string | null;
  manufacturer?: string | null;
  skuNumber?: string | null;
  origin?: string | null;
  lifespan?: number | null;
  totalWeight?: number | null;
  totalWeightUnit?: string | null;
  dimensions?: number[] | null;
  dimensionsUnit?: string | null;
  categoryName?: string[] | null;
  marketPrice?: number[] | null;
  productInformation: Record<string, any>;
  productSpecifications: Record<string, any> & { list_of_parts?: ProductPart[] };
  dataSources: DataSource[];
  verificationStatus?: string;
  confidenceScore?: number;
  createdAt: string;
  updatedAt: string;
  imageId?: string | null;
};

export type ProductPart = {
  part_name: string;
  weight: number;
  weight_unit: string;
  materials: string[];
  percentage: number;
};

export type DataSource = {
  source_url?: string;
  source_title?: string;
  source_description?: string;
  url?: string;
  title?: string;
  description?: string;
  name?: string;
  type?: string;
  domain?: string;
  reliability?: string;
  last_updated?: string;
  [key: string]: unknown;
};

export type Analysis = {
  id: string;
  userId?: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'removed';
  productSpecificationId?: string | null;
  lcaAnalysisId?: string | null;
  rawMaterialCompositionId?: string | null;
  startedAt: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  imageId?: string | null;
  ipccReportId?: string | null;
  // Nested objects from consolidated API
  productSpecification?: ProductSpecification | null;
  lcaAnalysis?: LCAAnalysis | null;
  ipccReport?: (IpccAr6Report & { materialComposition?: MaterialComposition | null }) | null;
};

export type Material = {
  material_name: string;
  material_type: string | null; // ví dụ: "Natural", "Synthetic", "Metal"
  weight: number | null;
  weight_unit: string | null; // ví dụ: "kg"
  percentage: number | null;
  carbon_factor: number | null;
  carbon_factor_unit: string | null; // ví dụ: "kg CO2e/kg"
  carbon_emissions: number | null;
  source: string | null;
  sustainability_notes: string | null;
  recyclable: boolean | null;
  renewable: boolean | null;
};

export type MaterialSummary = {
  total_carbon_footprint: number | null;
  carbon_footprint_unit: string | null; // ví dụ: "kg CO2e"
  recyclability_score: number | null; // 0–1
  sustainability_rating: string | null; // ví dụ: "A", "B", "C"
  primary_materials: string[] | null;
};

export type MaterialCompositionJson = {
  total_weight: number | null;
  total_weight_unit: string | null;
  materials: Material[] | null;
  summary: MaterialSummary | null;
};

export type MaterialComposition = {
  id: string;
  analysisId: string | null;
  productSpecificationId: string | null;
  userId: string | null;

  totalWeight: number | null;
  totalWeightUnit: string | null;

  totalCarbonFootprint: number | null;
  carbonFootprintUnit: string | null;

  recyclabilityScore: number | null;
  sustainabilityRating: string | null;

  primaryMaterials: string[] | null;

  materialComposition: MaterialCompositionJson; // jsonb
  dataSources: DataSource[]; // jsonb array (default [])

  createdAt: string; // ISO string (timestamp with time zone)
  updatedAt: string;

  materialComponents: string[] | null; // uuid array
  imageId: string | null;
};

export type IpccAr6Report = {
  /** UUID — Primary Key */
  id: string;

  /** Liên kết đến ProductSpecification */
  productSpecificationId?: string | null;

  /** Liên kết đến MaterialComposition */
  materialCompositionId?: string | null;

  /** Liên kết đến User */
  userId?: string | null;

  /** Nested MaterialComposition from consolidated API */
  materialComposition?: MaterialComposition | null;

  /** Tóm tắt tổng quan của báo cáo */
  overallSummary: string;

  /** Tổng lượng phát thải khí nhà kính (CO2e) */
  globalWarmingTotalEmission: number;
  globalWarmingTotalEmissionUnit: string;
  globalWarmingCondition: 'very low' | 'low' | 'intermediate' | 'high' | 'very high';
  globalWarmingDescription: string;

  /** Tiêu thụ nước */
  waterConsumption: number;
  waterConsumptionUnit: string;
  waterConsumptionDescription: string;

  /** Sử dụng đất */
  landUse: number;
  landUseUnit: string;
  landUseDescription: string;

  /** Tác động đa dạng sinh học */
  biodiversity: number;
  biodiversityUnit: string;
  biodiversityDescription: string;

  /** Phát thải ra không khí */
  airEmissions: number;
  airEmissionsUnit: string;
  airEmissionsDescription: string;

  /** Rác thải sinh ra */
  wasteGeneration: number;
  wasteGenerationUnit: string;
  wasteGenerationDescription: string;

  /** Suy giảm tài nguyên (optional) */
  resourceDepletion?: number | null;
  resourceDepletionUnit?: string | null;
  resourceDepletionDescription?: string | null;

  /** Tác động sức khỏe (optional) */
  healthImpact?: number | null;
  healthImpactUnit?: string | null;
  healthImpactDescription?: string | null;

  /** Tác động hệ sinh thái (optional) */
  ecosystemImpact?: number | null;
  ecosystemImpactUnit?: string | null;
  ecosystemImpactDescription?: string | null;

  /** Timestamps */
  createdAt: string; // ISO string (timestamp with time zone)
  updatedAt: string; // ISO string (timestamp with time zone)

  /** Hình ảnh minh họa hoặc biểu đồ kèm theo (optional) */
  imageId?: string | null;
};

export type LCAAnalysis = {
  id: string;
  userId: string;
  productSpecificationId?: string | null;
  mainLcaAnalysis: string;
  dataSources: DataSource[];
  otherAnalysis: OtherAnalysis;
  createdAt: string;
  updatedAt: string;
};

export type MainLcaAnalysis = {
  product_name: string;
  total_emissions_kg_co2e: number;
  functional_unit: string; // e.g. "per unit", "per year"
  lifecycle_stages: LifecycleStage[];
  hotspots: Hotspot[];
  recommendations: string[];
};

export type LifecycleStage = {
  stage: string;
  emissions_kg_co2e: number;
  percentage_of_total: number;
};

export type Hotspot = {
  stage: string;
  cause: string;
  mitigation_strategy: string;
};

export type OtherAnalysis = {
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  timeline_analysis: {
    milestones: {
      day: number;
      event: string;
      significance: string;
    }[];
    emission_velocity: {
      peak_emission_phase: string;
      cumulative_emissions: number;
      daily_average_emissions: number;
    };
    lifecycle_progression: {
      stage: string;
      emissions: number;
      duration_days: number;
      key_activities: string[];
    }[];
    total_lifecycle_carbon: number;
  };
  geographic_analysis: {
    emission_hotspots: {
      location: string;
      primary_cause: string;
      emission_intensity: number;
      mitigation_potential: string;
    }[];
    supply_chain_mapping: {
      raw_materials: {
        material: string;
        source_countries: string[];
        emissions_by_country: Record<
          string,
          {
            co2e: number;
            intensity: string;
          }
        >;
      }[];
      manufacturing_hubs: {
        location: string;
        emissions: number;
        processes: string[];
        coordinates: [number, number];
        grid_carbon_intensity?: number;
      }[];
      distribution_routes: {
        to: string;
        from: string;
        emissions: number;
        distance_km: number;
        transport_mode: string;
        route_coordinates: [number, number][];
      }[];
    };
    regional_impact_intensity: {
      low_impact_regions: string[];
      high_impact_regions: string[];
      medium_impact_regions: string[];
    };
  };
  supply_chain_mapping: {
    tier_breakdown: {
      tier_1_suppliers: number;
      tier_2_suppliers: number;
      tier_3_suppliers: number;
      geographical_spread: string;
    };
    traceability_score: {
      overall_score: number;
      material_traceability: number;
      supplier_transparency: number;
      certification_coverage: number;
    };
    transportation_network: {
      mode: string;
      route: string;
      distance_km: number;
      emissions_share: number;
    }[];
  };
  equivalency_comparisons: {
    visual_metaphors: {
      metaphor: string;
      impact_type: string;
    }[];
    contextual_benchmarks: {
      vs_best_in_class: string;
      vs_industry_average: string;
      improvement_potential: string;
    };
    carbon_footprint_equivalents: {
      coal_pounds: number;
      gasoline_gallons: number;
      cars_driven_miles: number;
      tree_seedlings_grown: number;
    };
  };
  decarbonization_pathways?: DecarbonisationOpportunities;
};

export type MaterialComponent = {
  id: string;
  materialCompositionId?: string | null;
  materialName: string;
  materialType?: string | null;
  weight: number;
  weightUnit: string;
  percentage: number;
  carbonFactor?: number | null;
  carbonFactorUnit?: string | null;
  carbonEmissions?: number | null;
  source?: string | null;
  sustainabilityNotes?: string | null;
  recyclable?: boolean | null;
  renewable?: boolean | null;
  createdAt: string;
};

export type DecarbonisationRecommendation = {
  category?: string;
  cost_impact?: string;
  description?: string;
  data_sources?: string[];
  strategy_name?: string;
  specific_actions?: string[];
  potential_savings?: number;
  savings_percentage?: number;
  potential_savings_unit?: string;
  implementation_difficulty?: 'low' | 'medium' | 'high' | string;
};

export type DecarbonisationPriorityRank = {
  rank?: number;
  strategy?: string;
  rationale?: string;
};

export type DecarbonisationOpportunities = {
  recommendations?: DecarbonisationRecommendation[];
  priority_ranking?: DecarbonisationPriorityRank[];
  reduction_percentage?: number;
  implementation_timeline?: string;
  total_reduction_potential?: number;
  total_reduction_potential_unit?: string;
};

export type UserStatistics = {
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

export type UserStatisticsDetails = {
  statisticsTime: string[];
  totalUsers: number[];
  activeUsers: number[];
  inactiveUsers: number[];
  recentUsers: number[];
  twoFactorEnabled: number[];
};

export type UserStatisticsOverview = {
  statistics: UserStatistics;
  statisticsDetails: UserStatisticsDetails;
};

export type Category = {
  id: string;
  title: string;
  icon?: string | null;
  color?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Reference = {
  id: string;
  categoryId: string;
  name: string;
  description?: string | null;
  url?: string | null;
  access?: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};
