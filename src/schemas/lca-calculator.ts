import { z } from 'zod';

/**
 * Zod schema for LCA Calculator Form Validation
 * Based on ISO 14040/14044 requirements
 */

export const LcaCalculatorSchema = z.object({
  // Required fields for basic LCA
  product_name: z.string().min(1, 'Product Name is required'),
  functional_unit: z.string().min(1, 'Functional Unit is required'),
  system_boundary: z.string().min(1, 'System Boundary is required'),
  impact_assessment_method: z.string().min(1, 'Impact Assessment Method is required'),
  
  // Allow any other fields that might be present
}).passthrough();

export type LcaCalculatorValidation = z.infer<typeof LcaCalculatorSchema>;

/**
 * Helper function to format validation errors
 */
export const formatLcaValidationErrors = (error: z.ZodError): string[] => {
  if (!error || !error.issues) {
    return ['Unknown validation error'];
  }
  
  return error.issues.map((err) => {
    const field = err.path.join('.') || 'unknown field';
    const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return `${fieldName}: ${err.message}`;
  });
};
