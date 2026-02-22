import { Tag } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
} from '@/components/ui';
import type { BatteryPassportFormChangeHandler, BatteryPassportFormData } from '@/types/battery-passport';

import { getTextValue } from './utils';

type LabellingFormProps = {
  formData: BatteryPassportFormData;
  onChange: BatteryPassportFormChangeHandler;
};

export function LabellingForm({ formData, onChange }: LabellingFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-emerald-600" />
          Labelling &amp; Symbols
        </CardTitle>
        <CardDescription>Required labelling information per Annex VI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Separate Collection Symbol</Label>
            <Select
              value={getTextValue(formData.separate_collection_symbol)}
              onValueChange={value => onChange('separate_collection_symbol', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select symbol type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Battery collection symbol">Battery collection symbol</SelectItem>
                <SelectItem value="Crossed-out wheeled bin">Crossed-out wheeled bin</SelectItem>
                <SelectItem value="WEEE symbol">WEEE symbol</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Cadmium &amp; Lead Symbols</Label>
            <Select
              value={getTextValue(formData.cadmium_lead_symbols)}
              onValueChange={value => onChange('cadmium_lead_symbols', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select if applicable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cd and Pb symbols">Cd and Pb symbols</SelectItem>
                <SelectItem value="Cd symbol">Cd symbol (Cadmium)</SelectItem>
                <SelectItem value="Pb symbol">Pb symbol (Lead)</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Carbon Footprint Label</Label>
            <Select
              value={getTextValue(formData.carbon_footprint_label)}
              onValueChange={value => onChange('carbon_footprint_label', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select label type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Class A label">Class A label</SelectItem>
                <SelectItem value="Class B label">Class B label</SelectItem>
                <SelectItem value="Class C label">Class C label</SelectItem>
                <SelectItem value="Class D label">Class D label</SelectItem>
                <SelectItem value="Class E label">Class E label</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Extinguishing Agent</Label>
            <Select
              value={getTextValue(formData.extinguishing_agent)}
              onValueChange={value => onChange('extinguishing_agent', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CO2">CO2</SelectItem>
                <SelectItem value="Dry chemical">Dry chemical</SelectItem>
                <SelectItem value="Foam">Foam</SelectItem>
                <SelectItem value="Lithium-ion fire extinguisher">Lithium-ion fire extinguisher</SelectItem>
                <SelectItem value="Sand">Sand</SelectItem>
                <SelectItem value="Water mist">Water mist</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Meaning of Labels and Symbols</Label>
          <Textarea
            value={getTextValue(formData.labels_symbols_meaning)}
            onChange={event => onChange('labels_symbols_meaning', event.target.value)}
            placeholder="Explanation of all labels and symbols used on the battery"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
