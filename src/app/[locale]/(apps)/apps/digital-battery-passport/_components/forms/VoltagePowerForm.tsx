import { Zap } from 'lucide-react';

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

type VoltagePowerFormProps = {
  formData: BatteryPassportFormData;
  onChange: BatteryPassportFormChangeHandler;
};

export function VoltagePowerForm({ formData, onChange }: VoltagePowerFormProps) {
  const renderField = (
    label: string,
    field: string,
    options?: { step?: string; labelClassName?: string; isPercentage?: boolean },
  ) => (
    <div className="space-y-2">
      <Label className={options?.labelClassName}>{label}</Label>
      <Input
        type="number"
        step={options?.step}
        min={options?.isPercentage ? "0" : undefined}
        max={options?.isPercentage ? "100" : undefined}
        value={getNumericValue(formData[field])}
        onChange={event => {
          if (options?.isPercentage) {
            const val = event.target.value;
            if (val === '') {
              onChange(field, '');
            } else {
              const num = Number(val);
              onChange(field, Math.max(0, Math.min(100, num)));
            }
          } else {
            onChange(field, toNumberOrEmpty(event.target.value));
          }
        }}
      />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-emerald-600" />
          Voltage &amp; Power
        </CardTitle>
        <CardDescription>Voltage and power capability parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {renderField('Minimum Voltage (V)', 'minimum_voltage', { step: '0.1' })}
          {renderField('Maximum Voltage (V)', 'maximum_voltage', { step: '0.1' })}
          {renderField('Nominal Voltage (V)', 'nominal_voltage', { step: '0.1' })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {renderField('Original Power Capability (W)', 'original_power_capability')}
          {renderField('Maximum Permitted Power (W)', 'max_permitted_power')}
        </div>

        <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4">
          <h4 className="mb-3 font-medium text-yellow-800">Current Power State (Dynamic Data)</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {renderField('Remaining Power Capability (W)', 'remaining_power_capability', { labelClassName: 'text-yellow-700' })}
            {renderField('Power Fade (%)', 'power_fade', { step: '0.1', labelClassName: 'text-yellow-700', isPercentage: true })}
            {renderField('Power/Energy Ratio', 'power_energy_ratio', { step: '0.01', labelClassName: 'text-yellow-700' })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
