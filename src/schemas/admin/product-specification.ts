import { z } from 'zod';

// Product Information Schema
export const ProductInformationSchema = z.object({
  origin: z.string().optional(),
  lifespan: z.number().int().min(0).optional(),
  SKU_number: z.string().optional(),
  manufacturer: z.string().optional(),
  product_name: z.string().optional(),
  total_weight: z.number().min(0).optional(),
  total_weight_unit: z.string().optional(),
  product_general_name: z.string().optional(),
  market_price: z.array(z.number()).optional(),
  category_name: z.array(z.string()).optional(),
});

// Product Specifications Schema
export const ProductSpecificationsSchema = z.object({
  weight: z.union([z.number(), z.string()]).optional(),
  dimensions: z.array(z.union([z.number(), z.string()])).optional(),
  weight_unit: z.string().optional(),
  key_features: z.array(z.string()).optional(),
  total_capacity: z.union([z.number(), z.string()]).optional(),
  dimensions_unit: z.string().optional(),
  energy_consumption: z.union([z.number(), z.string()]).optional(),
  total_capacity_unit: z.string().optional(),
  energy_consumption_unit: z.string().optional(),
}).passthrough(); // Allow additional fields

// Data Source Schema - Enhanced to handle various data source structures
export const DataSourceSchema = z.object({
  source_url: z.string().optional(),
  source_title: z.string().optional(),
  source_description: z.string().optional(),
  // Additional common fields that might be present
  url: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
  domain: z.string().optional(),
  reliability: z.string().optional(),
  last_updated: z.string().optional(),
  // Allow any additional fields
}).passthrough(); // Allow additional fields not defined above

// Zod Schemas
export const CreateProductSpecificationSchema = z.object({
  analysisId: z.string().uuid('Invalid analysis ID').optional(),
  userId: z.string().uuid('Invalid user ID').optional(),
  productName: z.string().min(1, 'Product name is required'),
  productGeneralName: z.string().optional(),
  manufacturer: z.string().optional(),
  skuNumber: z.string().optional(),
  origin: z.string().optional(),
  lifespan: z.number().int().min(0).optional(),
  totalWeight: z.string().optional(),
  totalWeightUnit: z.string().optional(),
  dimensions: z.array(z.number()).optional(),
  dimensionsUnit: z.string().optional(),
  categoryName: z.array(z.string()).optional(),
  marketPrice: z.array(z.string()).optional(),
  productInformation: ProductInformationSchema,
  productSpecifications: ProductSpecificationsSchema,
  dataSources: z.array(DataSourceSchema).default([]),
  verificationStatus: z.string().default('unverified'),
  confidenceScore: z.string().default('0.80'),
  imageId: z.string().uuid('Invalid image ID').optional(),
});

export const UpdateProductSpecificationSchema = z.object({
  productName: z.string().min(1, 'Product name is required').optional(),
  productGeneralName: z.string().optional(),
  manufacturer: z.string().optional(),
  skuNumber: z.string().optional(),
  origin: z.string().optional(),
  lifespan: z.number().int().min(0).optional(),
  totalWeight: z.string().optional(),
  totalWeightUnit: z.string().optional(),
  dimensions: z.union([
    z.array(z.number()),
    z.string().transform((val) => {
      if (!val.trim()) {
        return undefined;
      }
      return val.split(',').map(v => Number.parseFloat(v.trim())).filter(n => !Number.isNaN(n));
    }),
  ]).optional(),
  dimensionsUnit: z.string().optional(),
  categoryName: z.array(z.string()).optional(),
  marketPrice: z.union([
    z.array(z.string()),
    z.string().transform((val) => {
      if (!val.trim()) {
        return undefined;
      }
      // Parse to numbers first to validate, then convert back to strings
      return val.split(',')
        .map(v => v.trim())
        .filter(v => v.length > 0 && !Number.isNaN(Number.parseFloat(v)))
        .map(v => String(Number.parseFloat(v)));
    }),
  ]).optional(),
  productInformation: ProductInformationSchema.optional(),
  productSpecifications: ProductSpecificationsSchema.optional(),
  dataSources: z.array(DataSourceSchema).optional(),
  verificationStatus: z.string().optional(),
  confidenceScore: z.string().optional(),
  imageId: z.string().uuid('Invalid image ID').optional(),
});

export const ProductSpecificationFilterSchema = z.object({
  productName: z.string().optional(),
  productGeneralName: z.string().optional(),
  manufacturer: z.string().optional(),
  skuNumber: z.string().optional(),
  origin: z.string().optional(),
  verificationStatus: z.string().optional(),
  userId: z.string().uuid('Invalid user ID').optional(),
  analysisId: z.string().uuid('Invalid analysis ID').optional(),
  createdFrom: z.string().datetime('Invalid createdFrom date').optional(),
  createdTo: z.string().datetime('Invalid createdTo date').optional(),
  confidenceScoreMin: z.number().min(0).max(1).optional(),
  confidenceScoreMax: z.number().min(0).max(1).optional(),
});

export const ProductSpecificationPaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['productName', 'createdAt', 'updatedAt', 'manufacturer', 'verificationStatus', 'confidenceScore']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const BulkUpdateVerificationStatusSchema = z.object({
  productIds: z.array(z.string().uuid('Invalid product ID')).min(1, 'At least one product ID is required'),
  status: z.string().min(1, 'Status is required'),
});

export const SearchProductsSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  limit: z.number().int().min(1).max(100).default(20),
});

// TypeScript interfaces derived from Zod schemas
export type ProductInformationDTO = z.infer<typeof ProductInformationSchema>;
export type ProductSpecificationsDTO = z.infer<typeof ProductSpecificationsSchema>;
export type DataSourceDTO = z.infer<typeof DataSourceSchema>;
export type CreateProductSpecificationDTO = z.infer<typeof CreateProductSpecificationSchema>;
export type UpdateProductSpecificationDTO = z.infer<typeof UpdateProductSpecificationSchema>;
export type ProductSpecificationFilterDTO = z.infer<typeof ProductSpecificationFilterSchema>;
export type ProductSpecificationPaginationDTO = z.infer<typeof ProductSpecificationPaginationSchema>;
export type BulkUpdateVerificationStatusDTO = z.infer<typeof BulkUpdateVerificationStatusSchema>;
export type SearchProductsDTO = z.infer<typeof SearchProductsSchema>;

// Response DTOs
export type ProductSpecificationStatisticsDTO = {
  totalProducts: number;
  verifiedProducts: number;
  unverifiedProducts: number;
  pendingVerification: number;
  averageConfidenceScore: number;
  productsToday: number;
  productsThisWeek: number;
  productsThisMonth: number;
  topManufacturers: Array<{ manufacturer: string; count: number }>;
  topCategories: Array<{ category: string; count: number }>;
};

// Validation helper functions
export const validateCreateProductSpecification = (data: unknown): CreateProductSpecificationDTO => {
  return CreateProductSpecificationSchema.parse(data);
};

export const validateUpdateProductSpecification = (data: unknown): UpdateProductSpecificationDTO => {
  return UpdateProductSpecificationSchema.parse(data);
};

export const validateProductSpecificationFilter = (data: unknown): ProductSpecificationFilterDTO => {
  return ProductSpecificationFilterSchema.parse(data);
};

export const validateProductSpecificationPagination = (data: unknown): ProductSpecificationPaginationDTO => {
  return ProductSpecificationPaginationSchema.parse(data);
};

export const validateBulkUpdateVerificationStatus = (data: unknown): BulkUpdateVerificationStatusDTO => {
  return BulkUpdateVerificationStatusSchema.parse(data);
};

export const validateSearchProducts = (data: unknown): SearchProductsDTO => {
  return SearchProductsSchema.parse(data);
};
