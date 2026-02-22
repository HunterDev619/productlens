import { z } from 'zod';

export const ProfileSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters'),
  phone: z
    .string()
    .trim()
    .optional()
    .transform(v => (v === '' ? undefined : v))
    // Normalize: remove spaces, parentheses, dashes, dots before validation
    .transform(v => (v ? v.replace(/[^\d+]/g, '') : v))
    // E.164 strict: + followed by 1-15 digits, first digit 1-9
    .refine(v => !v || /^\+[1-9]\d{1,14}$/.test(v), {
      message: 'Phone must be E.164, e.g. +14155552671',
    }),
  userAddress: z
    .string()
    .trim()
    .optional()
    .transform(v => (v === '' ? undefined : v))
    .refine(v => !v || v.length <= 200, { message: 'Address is too long' }),
});

// Form state type used with react-hook-form
export type ProfileFormValues = {
  fullname: string;
  phone: string | undefined;
  userAddress: string | undefined;
};
