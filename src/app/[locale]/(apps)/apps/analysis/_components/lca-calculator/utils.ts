import type { LcaCalculatorFormData } from '@/types/lca-calculator';

export const getString = (value: unknown) => (typeof value === 'string' ? value : '');

export const getNumberInput = (value: unknown) => {
  if (typeof value === 'number') {
    return value;
  }
  return value ?? '';
};

export const toNumberOrEmpty = (value: string) => (value === '' ? '' : Number(value));

export const updateArrayField = <T>(
  formData: LcaCalculatorFormData,
  field: keyof LcaCalculatorFormData,
  index: number,
  update: Partial<T>,
  onChange: (key: string, value: T[]) => void,
) => {
  const items = (formData[field] as T[] | undefined) ?? [];
  const next = [...items];
  next[index] = { ...(next[index] as T), ...update };
  onChange(field as string, next);
};
