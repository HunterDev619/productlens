import { z } from 'zod';

const CitationSchema = z.object({
  url: z.string().url().optional(),
  type: z.string().optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  cited_text: z.string().optional(),
}).passthrough();

const UsageSchema = z.object({
  total_tokens: z.number().int().nonnegative().optional(),
  prompt_tokens: z.number().int().nonnegative().optional(),
  completion_tokens: z.number().int().nonnegative().optional(),
}).strict();

const AnalysisOptionsSchema = z.object({
  include_geographic_mapping: z.boolean().optional(),
}).strict();

const OtherAnalysisSchema = z.object({
  usage: UsageSchema.optional(),
  analysis_options: AnalysisOptionsSchema.optional(),
  geographic_analysis: z.any().optional(),
}).passthrough();

export const CreateLcaAnalysisSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  productSpecificationId: z.string().uuid('Invalid product specification ID').optional().nullable(),
  mainLcaAnalysis: z.any(),
  dataSources: z.array(CitationSchema).default([]),
  otherAnalysis: OtherAnalysisSchema.default({}),
});

export const UpdateLcaAnalysisSchema = z.object({
  productSpecificationId: z.string().uuid('Invalid product specification ID').optional().nullable(),
  mainLcaAnalysis: z.any().optional(),
  dataSources: z.array(CitationSchema).optional(),
  otherAnalysis: OtherAnalysisSchema.optional(),
});

export const LcaAnalysisFilterSchema = z.object({
  userId: z.string().uuid('Invalid user ID').optional(),
  productSpecificationId: z.string().uuid('Invalid product specification ID').optional(),
  createdFrom: z.string().datetime().optional(),
  createdTo: z.string().datetime().optional(),
  updatedFrom: z.string().datetime().optional(),
  updatedTo: z.string().datetime().optional(),
});

export const LcaAnalysisPaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const BulkDeleteLcaAnalysisSchema = z.object({
  ids: z.array(z.string().uuid('Invalid ID')).min(1, 'At least one ID is required'),
});

export const SearchLcaAnalysesSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateLcaAnalysisDTO = z.infer<typeof CreateLcaAnalysisSchema>;
export type UpdateLcaAnalysisDTO = z.infer<typeof UpdateLcaAnalysisSchema>;
export type LcaAnalysisFilterDTO = z.infer<typeof LcaAnalysisFilterSchema>;
export type LcaAnalysisPaginationDTO = z.infer<typeof LcaAnalysisPaginationSchema>;
export type BulkDeleteLcaAnalysisDTO = z.infer<typeof BulkDeleteLcaAnalysisSchema>;
export type SearchLcaAnalysesDTO = z.infer<typeof SearchLcaAnalysesSchema>;

export const validateCreateLcaAnalysis = (data: unknown): CreateLcaAnalysisDTO => CreateLcaAnalysisSchema.parse(data);
export const validateUpdateLcaAnalysis = (data: unknown): UpdateLcaAnalysisDTO => UpdateLcaAnalysisSchema.parse(data);
export const validateLcaAnalysisFilter = (data: unknown): LcaAnalysisFilterDTO => LcaAnalysisFilterSchema.parse(data);
export const validateLcaAnalysisPagination = (data: unknown): LcaAnalysisPaginationDTO => LcaAnalysisPaginationSchema.parse(data);
export const validateBulkDeleteLcaAnalysis = (data: unknown): BulkDeleteLcaAnalysisDTO => BulkDeleteLcaAnalysisSchema.parse(data);
export const validateSearchLcaAnalyses = (data: unknown): SearchLcaAnalysesDTO => SearchLcaAnalysesSchema.parse(data);
