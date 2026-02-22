import { z } from 'zod';

export const CreateIpccReportSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  productSpecificationId: z.string().uuid('Invalid product specification ID'),
  materialCompositionId: z.string().uuid('Invalid material composition ID'),
  overallSummary: z.string().min(1),
  globalWarmingTotalEmission: z.union([z.string(), z.number()]),
  globalWarmingTotalEmissionUnit: z.string().min(1),
  globalWarmingCondition: z.enum(['very low', 'low', 'intermediate', 'high', 'very high']),
  globalWarmingDescription: z.string().min(1),
  waterConsumption: z.union([z.string(), z.number()]),
  waterConsumptionUnit: z.string().min(1),
  waterConsumptionDescription: z.string().min(1),
  landUse: z.union([z.string(), z.number()]),
  landUseUnit: z.string().min(1),
  landUseDescription: z.string().min(1),
  biodiversity: z.union([z.string(), z.number()]),
  biodiversityUnit: z.string().min(1),
  biodiversityDescription: z.string().min(1),
  airEmissions: z.union([z.string(), z.number()]),
  airEmissionsUnit: z.string().min(1),
  airEmissionsDescription: z.string().min(1),
  wasteGeneration: z.union([z.string(), z.number()]),
  wasteGenerationUnit: z.string().min(1),
  wasteGenerationDescription: z.string().min(1),
  resourceDepletion: z.union([z.string(), z.number()]).optional(),
  resourceDepletionUnit: z.string().optional(),
  resourceDepletionDescription: z.string().optional(),
  healthImpact: z.union([z.string(), z.number()]).optional(),
  healthImpactUnit: z.string().optional(),
  healthImpactDescription: z.string().optional(),
  ecosystemImpact: z.union([z.string(), z.number()]).optional(),
  ecosystemImpactUnit: z.string().optional(),
  ecosystemImpactDescription: z.string().optional(),
  imageId: z.string().uuid('Invalid image ID').optional(),
});

export const UpdateIpccReportSchema = CreateIpccReportSchema.partial();

export const IpccReportFilterSchema = z.object({
  userId: z.string().uuid('Invalid user ID').optional(),
  productSpecificationId: z.string().uuid('Invalid product specification ID').optional(),
  materialCompositionId: z.string().uuid('Invalid material composition ID').optional(),
  globalWarmingCondition: z.enum(['very low', 'low', 'intermediate', 'high', 'very high']).optional(),
  createdFrom: z.string().datetime().optional(),
  createdTo: z.string().datetime().optional(),
});

export const IpccReportPaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'updatedAt', 'globalWarmingTotalEmission']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateIpccReportDTO = z.infer<typeof CreateIpccReportSchema>;
export type UpdateIpccReportDTO = z.infer<typeof UpdateIpccReportSchema>;
export type IpccReportFilterDTO = z.infer<typeof IpccReportFilterSchema>;
export type IpccReportPaginationDTO = z.infer<typeof IpccReportPaginationSchema>;

export const validateCreateIpccReport = (data: unknown): CreateIpccReportDTO => CreateIpccReportSchema.parse(data);
export const validateUpdateIpccReport = (data: unknown): UpdateIpccReportDTO => UpdateIpccReportSchema.parse(data);
export const validateIpccReportFilter = (data: unknown): IpccReportFilterDTO => IpccReportFilterSchema.parse(data);
export const validateIpccReportPagination = (data: unknown): IpccReportPaginationDTO => IpccReportPaginationSchema.parse(data);
