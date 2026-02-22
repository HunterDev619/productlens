import { Shield } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui';
import type { BatteryPassportFormChangeHandler, BatteryPassportFormData } from '@/types/battery-passport';

import { getNumericValue, getTextValue, toNumberOrEmpty } from './utils';

type ResistanceLifetimeFormProps = {
  formData: BatteryPassportFormData;
  onChange: BatteryPassportFormChangeHandler;
};

export function ResistanceLifetimeForm({ formData, onChange }: ResistanceLifetimeFormProps) {
  const renderField = (
    label: string,
    field: string,
    options?: { step?: string; labelClassName?: string; min?: string; max?: string; isPercentage?: boolean },
  ) => (
    <div className="space-y-2">
      <Label className={options?.labelClassName}>{label}</Label>
      <Input
        type="number"
        step={options?.step}
        min={options?.min}
        max={options?.max}
        value={getNumericValue(formData[field])}
        onChange={event => {
          if (options?.isPercentage || (options?.min === "0" && options?.max === "100")) {
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
          <Shield className="h-5 w-5 text-emerald-600" />
          Internal Resistance &amp; Lifetime
        </CardTitle>
        <CardDescription>Resistance, durability and cycle life parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
          <h4 className="mb-3 font-medium text-slate-800">Initial Internal Resistance (mΩ)</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {renderField('Cell', 'initial_internal_resistance_cell', { step: '0.001' })}
            {renderField('Module (recommended)', 'initial_internal_resistance_module', { step: '0.001' })}
            {renderField('Pack', 'initial_internal_resistance_pack', { step: '0.001' })}
          </div>
        </div>

        <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
          <h4 className="mb-3 font-medium text-orange-800">Resistance Increase (%)</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {renderField('Cell', 'internal_resistance_increase_cell', { step: '0.1', labelClassName: 'text-orange-700', isPercentage: true })}
            {renderField('Module (recommended)', 'internal_resistance_increase_module', { step: '0.1', labelClassName: 'text-orange-700', isPercentage: true })}
            {renderField('Pack', 'internal_resistance_increase_pack', { step: '0.1', labelClassName: 'text-orange-700', isPercentage: true })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {renderField('Expected Lifetime (years)', 'expected_lifetime_years')}
          {renderField('Expected Lifetime (cycles)', 'expected_lifetime_cycles')}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {renderField('Full Cycles Completed', 'full_cycles_completed')}
          <div className="space-y-2">
            <Label>Cycle-Life Reference Test</Label>
            <Select
              value={getTextValue(formData.cycle_life_reference_test)}
              onValueChange={value => onChange('cycle_life_reference_test', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select test standard" />
              </SelectTrigger>
              <SelectContent>
                {[
                  'GB/T 31484',
                  'IEC 62660-1',
                  'IEC 62660-2',
                  'ISO 12405-4',
                  'SAE J2464',
                  'UN ECE R100',
                  'USABC',
                  'Other',
                ].map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {renderField('C-Rate of Cycle-Life Test', 'c_rate_cycle_life_test', { step: '0.1' })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {renderField('Energy Throughput (kWh)', 'energy_throughput')}
          {renderField('Capacity Throughput (Ah)', 'capacity_throughput')}
          {renderField('Capacity Threshold for Exhaustion (%)', 'capacity_threshold_exhaustion', { min: '0', max: '100' })}
        </div>

        <div className="space-y-2">
          <Label>State of Health SoH (%)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={getNumericValue(formData.state_of_health)}
            onChange={event => {
              const val = event.target.value;
              if (val === '') {
                onChange('state_of_health', '');
              } else {
                const num = Number(val);
                onChange('state_of_health', Math.max(0, Math.min(100, num)));
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
