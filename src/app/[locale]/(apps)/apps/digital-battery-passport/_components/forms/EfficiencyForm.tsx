import { Activity } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Textarea,
} from '@/components/ui';
import type { BatteryPassportFormChangeHandler, BatteryPassportFormData } from '@/types/battery-passport';

import { getNumericValue, getTextValue, toNumberOrEmpty } from './utils';

type EfficiencyFormProps = {
  formData: BatteryPassportFormData;
  onChange: BatteryPassportFormChangeHandler;
};

export function EfficiencyForm({ formData, onChange }: EfficiencyFormProps) {
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
          <Activity className="h-5 w-5 text-emerald-600" />
          Energy Efficiency &amp; Self-Discharge
        </CardTitle>
        <CardDescription>Round trip efficiency and self-discharge parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-lime-100 bg-lime-50 p-4">
          <h4 className="mb-3 font-medium text-lime-800">Round Trip Energy Efficiency (%)</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {renderField('Initial', 'initial_round_trip_efficiency', { step: '0.1', labelClassName: 'text-lime-700', isPercentage: true })}
            {renderField('At 50% Cycle Life', 'round_trip_efficiency_50_cycle', { step: '0.1', labelClassName: 'text-lime-700', isPercentage: true })}
            {renderField('Remaining', 'remaining_round_trip_efficiency', { step: '0.1', labelClassName: 'text-lime-700', isPercentage: true })}
            {renderField('Efficiency Fade', 'round_trip_efficiency_fade', { step: '0.1', labelClassName: 'text-lime-700', isPercentage: true })}
          </div>
        </div>

        <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
          <h4 className="mb-3 font-medium text-purple-800">Self-Discharge Rate (%/month)</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {renderField('Initial Self-Discharge Rate', 'initial_self_discharge_rate', { step: '0.01', labelClassName: 'text-purple-700', isPercentage: true })}
            {renderField('Current Self-Discharge Rate', 'current_self_discharge_rate', { step: '0.01', labelClassName: 'text-purple-700', isPercentage: true })}
          </div>
          <div className="mt-4 space-y-2">
            <Label className="text-purple-700">Evolution of Self-Discharge Rates</Label>
            <Textarea
              value={getTextValue(formData.self_discharge_evolution)}
              onChange={event => onChange('self_discharge_evolution', event.target.value)}
              placeholder="Describe the evolution of self-discharge rates over time"
              rows={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
