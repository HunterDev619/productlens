import { Battery } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
} from '@/components/ui';
import type { BatteryPassportFormChangeHandler, BatteryPassportFormData } from '@/types/battery-passport';

import { getNumericValue, toNumberOrEmpty } from './utils';

type CapacityEnergyFormProps = {
  formData: BatteryPassportFormData;
  onChange: BatteryPassportFormChangeHandler;
};

export function CapacityEnergyForm({ formData, onChange }: CapacityEnergyFormProps) {
  const renderField = (
    label: string,
    field: string,
    options?: { step?: string; min?: string; max?: string; labelClassName?: string },
  ) => (
    <div className="space-y-2">
      <Label className={options?.labelClassName}>{label}</Label>
      <Input
        type="number"
        step={options?.step}
        min={options?.min}
        max={options?.max}
        value={getNumericValue(formData[field])}
        onChange={event => onChange(field, toNumberOrEmpty(event.target.value))}
      />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Battery className="h-5 w-5 text-emerald-600" />
          Capacity &amp; Energy
        </CardTitle>
        <CardDescription>Battery capacity and energy parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {renderField('Rated Capacity (Ah)', 'rated_capacity', { step: '0.1' })}
          {renderField('Rated Capacity (kWh)', 'rated_capacity_kwh', { step: '0.1' })}
          {renderField('Certified Usable Energy (kWh)', 'certified_usable_energy', { step: '0.1' })}
        </div>

        <div className="rounded-lg border border-cyan-100 bg-cyan-50 p-4">
          <h4 className="mb-3 font-medium text-cyan-800">Current State (Dynamic Data)</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {renderField('Remaining Capacity (Ah)', 'remaining_capacity', { step: '0.1', labelClassName: 'text-cyan-700' })}
          {renderField('Remaining Capacity (kWh)', 'remaining_capacity_kwh', { step: '0.1', labelClassName: 'text-cyan-700' })}
          {renderField('Capacity Fade (%)', 'capacity_fade', { step: '0.1', labelClassName: 'text-cyan-700' })}
          {renderField('Remaining Usable Energy (kWh)', 'remaining_usable_energy', { step: '0.1', labelClassName: 'text-cyan-700' })}
          {renderField('State of Certified Energy SOCE (%)', 'state_of_certified_energy', { min: '0', max: '100', labelClassName: 'text-cyan-700' })}
          {renderField('State of Charge SoC (%)', 'state_of_charge', { min: '0', max: '100', labelClassName: 'text-cyan-700' })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
