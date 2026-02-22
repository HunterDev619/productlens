import { Recycle } from 'lucide-react';

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

import { getNumericValue } from './utils';

type RecycledContentFormProps = {
  formData: BatteryPassportFormData;
  onChange: BatteryPassportFormChangeHandler;
};

export function RecycledContentForm({ formData, onChange }: RecycledContentFormProps) {
  const renderPercentageField = (label: string, field: string, accentClass: string) => (
    <div className="space-y-2">
      <Label className={accentClass}>{label}</Label>
      <Input
        type="number"
        min="0"
        max="100"
        value={getNumericValue(formData[field])}
        onChange={event => {
          const val = event.target.value;
          if (val === '') {
            onChange(field, '');
          } else {
            const num = Number(val);
            onChange(field, Math.max(0, Math.min(100, num)));
          }
        }}
      />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Recycle className="h-5 w-5 text-emerald-600" />
          Recycled Content
        </CardTitle>
        <CardDescription>Article 8 &amp; Annex XI compliance - ISO 22095 Chain of Custody</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
          <h4 className="mb-3 font-medium text-blue-800">Pre-Consumer Recycled Content (%)</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {renderPercentageField('Nickel', 'pre_consumer_recycled_nickel', 'text-blue-700')}
            {renderPercentageField('Cobalt', 'pre_consumer_recycled_cobalt', 'text-blue-700')}
            {renderPercentageField('Lithium', 'pre_consumer_recycled_lithium', 'text-blue-700')}
            {renderPercentageField('Lead', 'pre_consumer_recycled_lead', 'text-blue-700')}
          </div>
        </div>

        <div className="rounded-lg border border-green-100 bg-green-50 p-4">
          <h4 className="mb-3 font-medium text-green-800">Post-Consumer Recycled Content (%)</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {renderPercentageField('Nickel', 'post_consumer_recycled_nickel', 'text-green-700')}
            {renderPercentageField('Cobalt', 'post_consumer_recycled_cobalt', 'text-green-700')}
            {renderPercentageField('Lithium', 'post_consumer_recycled_lithium', 'text-green-700')}
            {renderPercentageField('Lead', 'post_consumer_recycled_lead', 'text-green-700')}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Renewable Content Share (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={getNumericValue(formData.renewable_content_share)}
            onChange={event => {
              const val = event.target.value;
              if (val === '') {
                onChange('renewable_content_share', '');
              } else {
                const num = Number(val);
                onChange('renewable_content_share', Math.max(0, Math.min(100, num)));
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
