import { Leaf } from 'lucide-react';

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

type CarbonFootprintFormProps = {
  formData: BatteryPassportFormData;
  onChange: BatteryPassportFormChangeHandler;
};

export function CarbonFootprintForm({ formData, onChange }: CarbonFootprintFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-emerald-600" />
          Carbon Footprint
        </CardTitle>
        <CardDescription>ISO 14067 / PEF methodology compliant data (Article 7)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Carbon Footprint per Functional Unit (kg CO₂e/kWh)</Label>
            <Input
              type="number"
              step="0.01"
              value={getNumericValue(formData.carbon_footprint_per_functional_unit)}
              onChange={event => onChange('carbon_footprint_per_functional_unit', toNumberOrEmpty(event.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Absolute Carbon Footprint (kg CO₂e)</Label>
            <Input
              type="number"
              step="0.01"
              value={getNumericValue(formData.carbon_footprint_total)}
              onChange={event => onChange('carbon_footprint_total', toNumberOrEmpty(event.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Carbon Footprint Class</Label>
            <Select
              value={getTextValue(formData.carbon_footprint_class)}
              onValueChange={value => onChange('carbon_footprint_class', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A - Lowest</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="E">E - Highest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <h4 className="mb-3 font-medium text-emerald-800">Lifecycle Stage Contributions</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-emerald-700">Raw Materials &amp; Pre-processing</Label>
              <Input
                type="number"
                step="0.01"
                value={getNumericValue(formData.carbon_footprint_raw_materials)}
                onChange={event => onChange('carbon_footprint_raw_materials', toNumberOrEmpty(event.target.value))}
                placeholder="kg CO₂e"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-emerald-700">Manufacturing</Label>
              <Input
                type="number"
                step="0.01"
                value={getNumericValue(formData.carbon_footprint_manufacturing)}
                onChange={event => onChange('carbon_footprint_manufacturing', toNumberOrEmpty(event.target.value))}
                placeholder="kg CO₂e"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-emerald-700">Distribution</Label>
              <Input
                type="number"
                step="0.01"
                value={getNumericValue(formData.carbon_footprint_distribution)}
                onChange={event => onChange('carbon_footprint_distribution', toNumberOrEmpty(event.target.value))}
                placeholder="kg CO₂e"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-emerald-700">End of Life &amp; Recycling</Label>
              <Input
                type="number"
                step="0.01"
                value={getNumericValue(formData.carbon_footprint_end_of_life)}
                onChange={event => onChange('carbon_footprint_end_of_life', toNumberOrEmpty(event.target.value))}
                placeholder="kg CO₂e"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Web Link to Public Carbon Footprint Study</Label>
          <Input
            value={getTextValue(formData.carbon_footprint_study_url)}
            onChange={event => onChange('carbon_footprint_study_url', event.target.value)}
            placeholder="https://..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
