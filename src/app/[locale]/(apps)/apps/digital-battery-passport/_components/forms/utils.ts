import type { BatteryPassportFormValue } from '@/types/battery-passport';

export const getTextValue = (value: BatteryPassportFormValue) =>
  typeof value === 'string' ? value : '';

export const getNumericValue = (value: BatteryPassportFormValue) => {
  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }
  return '';
};

export const getBooleanValue = (value: BatteryPassportFormValue) => value === true;

export const toNumberOrEmpty = (value: string) => (value === '' ? '' : Number(value));
