import { AlertTriangle, Thermometer } from 'lucide-react';

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

type TemperatureEventsFormProps = {
  formData: BatteryPassportFormData;
  onChange: BatteryPassportFormChangeHandler;
};

export function TemperatureEventsForm({ formData, onChange }: TemperatureEventsFormProps) {
  const renderField = (
    label: string,
    field: string,
  ) => (
    <div className="space-y-2">
      <Label className="text-amber-700">{label}</Label>
      <Input
        type="number"
        value={getNumericValue(formData[field])}
        onChange={event => onChange(field, toNumberOrEmpty(event.target.value))}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-emerald-600" />
            Temperature Information
          </CardTitle>
          <CardDescription>Temperature ranges and exposure data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Temperature Information (General)</Label>
            <Textarea
              value={getTextValue(formData.temperature_info)}
              onChange={event => onChange('temperature_info', event.target.value)}
              placeholder="General temperature information and requirements"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Idle State Lower Boundary (°C)</Label>
              <Input
                type="number"
                value={getNumericValue(formData.temp_range_idle_lower)}
                onChange={event => onChange('temp_range_idle_lower', toNumberOrEmpty(event.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Idle State Upper Boundary (°C)</Label>
              <Input
                type="number"
                value={getNumericValue(formData.temp_range_idle_upper)}
                onChange={event => onChange('temp_range_idle_upper', toNumberOrEmpty(event.target.value))}
              />
            </div>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <h4 className="mb-3 font-medium text-amber-800">Time in Extreme Temperatures (hours)</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderField('Above Upper Boundary', 'time_extreme_temp_above')}
              {renderField('Below Lower Boundary', 'time_extreme_temp_below')}
              {renderField('Charging Above Upper Boundary', 'time_charging_extreme_temp_above')}
              {renderField('Charging Below Lower Boundary', 'time_charging_extreme_temp_below')}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Negative Events &amp; Accidents
          </CardTitle>
          <CardDescription>Record of significant battery events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Number of Deep Discharge Events</Label>
              <Input
                type="number"
                value={getNumericValue(formData.deep_discharge_events)}
                onChange={event => onChange('deep_discharge_events', toNumberOrEmpty(event.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Number of Overcharge Events</Label>
              <Input
                type="number"
                value={getNumericValue(formData.overcharge_events)}
                onChange={event => onChange('overcharge_events', toNumberOrEmpty(event.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Information on Accidents</Label>
            <Textarea
              value={getTextValue(formData.accident_info)}
              onChange={event => onChange('accident_info', event.target.value)}
              placeholder="Record any accidents or incidents involving the battery"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
