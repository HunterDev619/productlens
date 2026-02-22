import { z } from 'zod';

/**
 * Zod schema for Battery Passport Form Validation
 * Only validates required fields marked with * in the forms
 * Based on EU Regulation 2023/1542 Annex XIII
 */

export const BatteryPassportSchema = z.object({
  // Top-level fields
  passport_id: z.string(),
  status: z.string(),
  
  // Required nested identification object
  identification: z.object({
    manufacturer: z.string().min(1, 'Manufacturer Name is required'),
    application: z.string().min(1, 'Battery Category is required'),
    chemistry: z.string().min(1, 'Battery Chemistry is required'),
  }).passthrough(),
  
  // Required QR Code/GS1 fields
  qrCodeGs1: z.object({
    gtin: z.string().min(14, 'GTIN (AI 01) must be 14 digits').max(14, 'GTIN (AI 01) must be 14 digits'),
    serial_number: z.string().min(1, 'Serial Number (AI 21) is required'),
  }).passthrough().optional(),
  
  // Allow any other fields that might be present
}).passthrough();

export type BatteryPassportValidation = z.infer<typeof BatteryPassportSchema>;

/**
 * Helper function to get all validation errors as a formatted string
 */
export const formatValidationErrors = (error: z.ZodError): string[] => {
  if (!error || !error.issues) {
    return ['Unknown validation error'];
  }
  
  return error.issues.map((err) => {
    const field = err.path.join('.') || 'unknown field';
    const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return `${fieldName}: ${err.message}`;
  });
};
