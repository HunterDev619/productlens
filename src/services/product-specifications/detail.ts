'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { axios } from '@/libs/axios';

export type MaterialComponent = {
  id: string;
  materialCompositionId: string;
  materialName: string;
  materialType: string;
  weight: string;
  weightUnit: string;
  percentage: string;
  carbonFactor: string;
  carbonFactorUnit: string;
  carbonEmissions: string;
  source: string;
  sustainabilityNotes: string;
  recyclable: boolean | null;
  renewable: boolean | null;
  createdAt: string;
};

export type MaterialComposition = {
  id: string;
  analysisId: string | null;
  productSpecificationId: string;
  userId: string;
  totalWeight: string;
  totalWeightUnit: string;
  totalCarbonFootprint: string;
  carbonFootprintUnit: string;
  recyclabilityScore: string;
  sustainabilityRating: string;
  primaryMaterials: string[];
  materialComposition: Record<string, any>;
  dataSources: Array<{
    source_url: string;
    source_title: string;
    source_description: string;
  }>;
  createdAt: string;
  updatedAt: string;
  materialComponents: string[];
  imageId: string | null;
  components?: MaterialComponent[];
};

export type IPCCReport = {
  id: string;
  productSpecificationId: string;
  materialCompositionId: string;
  userId: string;
  overallSummary: string;
  globalWarmingTotalEmission: string;
  globalWarmingTotalEmissionUnit: string;
  globalWarmingCondition: string;
  globalWarmingDescription: string;
  waterConsumption: string;
  waterConsumptionUnit: string;
  waterConsumptionDescription: string;
  landUse: string;
  landUseUnit: string;
  landUseDescription: string;
  biodiversity: string;
  biodiversityUnit: string;
  biodiversityDescription: string;
  airEmissions: string;
  airEmissionsUnit: string;
  airEmissionsDescription: string;
  wasteGeneration: string;
  wasteGenerationUnit: string;
  wasteGenerationDescription: string;
  resourceDepletion: string;
  resourceDepletionUnit: string;
  resourceDepletionDescription: string;
  healthImpact: string;
  healthImpactUnit: string;
  healthImpactDescription: string;
  ecosystemImpact: string;
  ecosystemImpactUnit: string;
  ecosystemImpactDescription: string;
  createdAt: string;
  updatedAt: string;
  imageId: string | null;
};

export type LCAAnalysisData = {
  id: string;
  mainLcaAnalysis: {
    main_lca_analysis: string;
    citations: Array<{
      type: string;
      cited_text: string;
      url: string;
      title: string;
      content: string;
    }>;
  };
  dataSources: Array<{
    url: string;
    title: string;
    content: string;
  }>;
};

export type ProductSpecificationDetail = {
  id: string;
  analysisId: string | null;
  userId: string;
  productName: string;
  productGeneralName: string;
  manufacturer: string;
  skuNumber: string | null;
  origin: string;
  lifespan: number;
  totalWeight: string;
  totalWeightUnit: string;
  dimensions: string[] | null;
  dimensionsUnit: string | null;
  categoryName: string[];
  marketPrice: string[];
  productInformation: Record<string, any>;
  productSpecifications: Record<string, any>;
  dataSources: Array<{
    source_url: string;
    source_title: string;
    source_description: string;
  }>;
  verificationStatus: string;
  confidenceScore: string;
  createdAt: string;
  updatedAt: string;
  imageId: string;
  materialCompositions?: MaterialComposition[];
  ipccReports?: IPCCReport[];
  lcaAnalysis?: LCAAnalysisData[];
  analysis?: Array<{
    id: string;
    userId: string;
    status: string;
    productSpecificationId: string;
    lcaAnalysisId: string | null;
    rawMaterialCompositionId: string | null;
    startedAt: string;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    imageId: string;
    ipccReportId: string | null;
  }>;
  image?: {
    id: string;
    userId: string;
    bucketName: string;
    imageKey: string;
    size: number;
    etag: any;
    contentType: string;
    metadata: {
      uploadedAt: string;
      originalName: string;
    };
    lastModified: string;
    createdAt: string;
    updatedAt: string;
  };
};

const getProductSpecificationsDetail = async (id: string): Promise<ProductSpecificationDetail> => {
  const response = await axios.get(API_ENDPOINTS.PRODUCT_SPECIFICATIONS_V2.DETAIL.replace('{id}', id));
  return response.data.data;
};

export const useGetProductSpecificationsDetail = (id: string) => {
  return useQuery({
    queryKey: ['product-specifications-detail', id],
    queryFn: () => getProductSpecificationsDetail(id),
    refetchOnMount: true,
    staleTime: 0,
    enabled: !!id,
  });
};

export const useGetProductSpecificationsDetailMutation = () => {
  return useMutation({
    mutationFn: (id: string) => getProductSpecificationsDetail(id),
  });
};
