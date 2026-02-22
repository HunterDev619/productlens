import { z } from 'zod';

// Định nghĩa các kiểu file được chấp nhận
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/avif'];

// Kích thước file tối đa (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Schema validation cho image file upload
export const uploadFileSchema = z.object({
  image_file: z
    .any()
    .refine(file => file instanceof File, {
      message: 'Please select a valid image file',
    })
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Invalid file format. Only JPG, JPEG, PNG, or AVIF are allowed',
    })
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: 'File size exceeds the 5MB limit',
    }),
  claudeStream: z.boolean().optional().default(true),
});

export type UploadFileFormData = z.infer<typeof uploadFileSchema>;

// Constants để export
export const FILE_UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE_MB: MAX_FILE_SIZE / (1024 * 1024),
} as const;
