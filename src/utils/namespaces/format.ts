export function formatWeightValue(value: number | string | null | undefined) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return value ?? 'N/A';
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(numericValue);
}

export function formatNumberValue(
  value: number | string | null | undefined,
  options?: Intl.NumberFormatOptions,
) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return value ?? 'N/A';
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10,
    ...options,
  }).format(numericValue);
}
