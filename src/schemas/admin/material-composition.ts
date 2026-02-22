import { z } from 'zod';

// Material Schema
export const MaterialSchema = z.object({
  material_name: z.string(),
  material_type: z.string().nullable(),
  weight: z.number().nullable(),
  weight_unit: z.string().nullable(),
  percentage: z.number().nullable(),
  carbon_factor: z.number().nullable(),
  carbon_factor_unit: z.string().nullable(),
  carbon_emissions: z.number().nullable(),
  source: z.string().nullable(),
  sustainability_notes: z.string().nullable(),
  recyclable: z.boolean().nullable(),
  renewable: z.boolean().nullable(),
}).passthrough();

// Material Summary Schema
export const MaterialSummarySchema = z.object({
  total_carbon_footprint: z.number().nullable(),
  carbon_footprint_unit: z.string().nullable(),
  recyclability_score: z.number().nullable(),
  sustainability_rating: z.string().nullable(),
  primary_materials: z.array(z.string()).nullable(),
}).passthrough();

// Material Composition JSON Schema
export const MaterialCompositionJsonSchema = z.object({
  total_weight: z.number().nullable(),
  total_weight_unit: z.string().nullable(),
  materials: z.array(MaterialSchema).nullable(),
  summary: MaterialSummarySchema.nullable(),
}).passthrough();

// Material Composition Schema
export const MaterialCompositionSchema = z.object({
  totalWeight: z.number().optional(),
  totalWeightUnit: z.string().optional(),
  totalCarbonFootprint: z.number().optional(),
  carbonFootprintUnit: z.string().optional(),
  recyclabilityScore: z.number().optional(),
  sustainabilityRating: z.string().optional(),
  primaryMaterials: z.array(z.string()).optional(),
  materialComposition: MaterialCompositionJsonSchema.optional(),
  dataSources: z.array(z.record(z.string(), z.unknown())).optional(),
  materialComponents: z.array(z.string()).optional(),
}).passthrough(); // Allow additional fields

// Zod Schemas
export const CreateMaterialCompositionSchema = z.object({
  analysisId: z.string().uuid('Invalid analysis ID').optional(),
  productSpecificationId: z.string().uuid('Invalid product specification ID').optional(),
  userId: z.string().uuid('Invalid user ID').optional(),
  totalWeight: z.string().optional(),
  totalWeightUnit: z.string().optional(),
  totalCarbonFootprint: z.string().optional(),
  carbonFootprintUnit: z.string().default('kg CO2e'),
  recyclabilityScore: z.string().optional(),
  sustainabilityRating: z.string().optional(),
  primaryMaterials: z.array(z.string()).optional(),
  materialComposition: z.record(z.string(), z.unknown()).default({}),
  dataSources: z.array(z.record(z.string(), z.unknown())).default([]),
  materialComponents: z.array(z.string()).optional(),
  imageId: z.string().uuid('Invalid image ID').optional(),
});

export const UpdateMaterialCompositionSchema = z.object({
  analysisId: z.string().uuid('Invalid analysis ID').optional(),
  productSpecificationId: z.string().uuid('Invalid product specification ID').optional(),
  userId: z.string().uuid('Invalid user ID').optional(),
  totalWeight: z.string().optional(),
  totalWeightUnit: z.string().optional(),
  totalCarbonFootprint: z.string().optional(),
  carbonFootprintUnit: z.string().optional(),
  recyclabilityScore: z.string().optional(),
  sustainabilityRating: z.string().optional(),
  primaryMaterials: z.array(z.string()).optional(),
  materialComposition: z.union([
    MaterialCompositionJsonSchema,
    z.string().transform((val) => {
      if (!val.trim()) {
        return undefined;
      }
      try {
        return JSON.parse(val);
      } catch {
        return undefined;
      }
    }),
  ]).optional(),
  dataSources: z.array(z.record(z.string(), z.unknown())).optional(),
  materialComponents: z.array(z.string()).optional(),
  imageId: z.string().uuid('Invalid image ID').optional(),
});

export const MaterialCompositionFilterSchema = z.object({
  userId: z.string().uuid('Invalid user ID').optional(),
  analysisId: z.string().uuid('Invalid analysis ID').optional(),
  productSpecificationId: z.string().uuid('Invalid product specification ID').optional(),
  imageId: z.string().uuid('Invalid image ID').optional(),
  sustainabilityRating: z.string().optional(),
  recyclabilityScoreMin: z.number().min(0).max(1).optional(),
  recyclabilityScoreMax: z.number().min(0).max(1).optional(),
  totalCarbonFootprintMin: z.number().min(0).optional(),
  totalCarbonFootprintMax: z.number().min(0).optional(),
  createdFrom: z.string().datetime('Invalid createdFrom date').optional(),
  createdTo: z.string().datetime('Invalid createdTo date').optional(),
});

export const MaterialCompositionPaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'updatedAt', 'totalCarbonFootprint', 'recyclabilityScore', 'sustainabilityRating']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const BulkUpdateSustainabilityRatingSchema = z.object({
  materialCompositionIds: z.array(z.string().uuid('Invalid material composition ID')).min(1, 'At least one material composition ID is required'),
  rating: z.string().min(1, 'Rating is required'),
});

export const SearchMaterialCompositionsSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  limit: z.number().int().min(1).max(100).default(20),
});

// TypeScript interfaces derived from Zod schemas
export type MaterialCompositionDTO = z.infer<typeof MaterialCompositionSchema>;
export type CreateMaterialCompositionDTO = z.infer<typeof CreateMaterialCompositionSchema>;
export type UpdateMaterialCompositionDTO = z.infer<typeof UpdateMaterialCompositionSchema>;
export type MaterialCompositionFilterDTO = z.infer<typeof MaterialCompositionFilterSchema>;
export type MaterialCompositionPaginationDTO = z.infer<typeof MaterialCompositionPaginationSchema>;
export type BulkUpdateSustainabilityRatingDTO = z.infer<typeof BulkUpdateSustainabilityRatingSchema>;
export type SearchMaterialCompositionsDTO = z.infer<typeof SearchMaterialCompositionsSchema>;

// Response DTOs
export type MaterialCompositionStatisticsDTO = {
  totalMaterialCompositions: number;
  averageRecyclabilityScore: number;
  averageCarbonFootprint: number;
  sustainabilityRatings: Record<string, number>;
  materialCompositionsToday: number;
  materialCompositionsThisWeek: number;
  materialCompositionsThisMonth: number;
  topUsers: Array<{ userId: string; count: number }>;
  topProductSpecifications: Array<{ productSpecificationId: string; count: number }>;
};

// Validation helper functions
export const validateCreateMaterialComposition = (data: unknown): CreateMaterialCompositionDTO => {
  return CreateMaterialCompositionSchema.parse(data);
};

export const validateUpdateMaterialComposition = (data: unknown): UpdateMaterialCompositionDTO => {
  return UpdateMaterialCompositionSchema.parse(data);
};

export const validateMaterialCompositionFilter = (data: unknown): MaterialCompositionFilterDTO => {
  return MaterialCompositionFilterSchema.parse(data);
};

export const validateMaterialCompositionPagination = (data: unknown): MaterialCompositionPaginationDTO => {
  return MaterialCompositionPaginationSchema.parse(data);
};

export const validateBulkUpdateSustainabilityRating = (data: unknown): BulkUpdateSustainabilityRatingDTO => {
  return BulkUpdateSustainabilityRatingSchema.parse(data);
};

export const validateSearchMaterialCompositions = (data: unknown): SearchMaterialCompositionsDTO => {
  return SearchMaterialCompositionsSchema.parse(data);
};
