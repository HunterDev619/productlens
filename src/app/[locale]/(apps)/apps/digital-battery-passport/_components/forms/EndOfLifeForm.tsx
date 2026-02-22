import { RotateCcw, Users, Wrench } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Checkbox,
    Input,
    Label,
    Textarea,
} from '@/components/ui';
import type { BatteryPassportFormChangeHandler, BatteryPassportFormData } from '@/types/battery-passport';

import { getBooleanValue, getTextValue } from './utils';

type EndOfLifeFormProps = {
  formData: BatteryPassportFormData;
  onChange: BatteryPassportFormChangeHandler;
};

export function EndOfLifeForm({ formData, onChange }: EndOfLifeFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-emerald-600" />
            Dismantling &amp; Safety
          </CardTitle>
          <CardDescription>Dismantling instructions and safety information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Dismantling Manual URL</Label>
            <Input
              value={getTextValue(formData.dismantling_manual_url)}
              onChange={event => onChange('dismantling_manual_url', event.target.value)}
              placeholder="https://... (URL to removal and disassembly manual)"
            />
          </div>

          <div className="space-y-2">
            <Label>Part Numbers for Components</Label>
            <Textarea
              value={getTextValue(formData.part_numbers_components)}
              onChange={event => onChange('part_numbers_components', event.target.value)}
              placeholder="List part numbers for key components"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Sources of Spare Parts</Label>
            <Textarea
              value={getTextValue(formData.spare_parts_sources)}
              onChange={event => onChange('spare_parts_sources', event.target.value)}
              placeholder="Information on where to obtain spare parts"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Safety Measures</Label>
            <Textarea
              value={getTextValue(formData.safety_measures)}
              onChange={event => onChange('safety_measures', event.target.value)}
              placeholder="Safety measures for handling, storage, and disposal"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            End-User Information
          </CardTitle>
          <CardDescription>Information for end-users on waste prevention and collection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Role in Waste Prevention</Label>
            <Textarea
              value={getTextValue(formData.end_user_waste_prevention_info)}
              onChange={event => onChange('end_user_waste_prevention_info', event.target.value)}
              placeholder="Information on end-users role in contributing to waste prevention"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Role in Separate Collection</Label>
            <Textarea
              value={getTextValue(formData.end_user_collection_info)}
              onChange={event => onChange('end_user_collection_info', event.target.value)}
              placeholder="Information on end-users role in separate collection of waste batteries"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>End of Life Treatment Information</Label>
            <Textarea
              value={getTextValue(formData.end_of_life_collection_info)}
              onChange={event => onChange('end_of_life_collection_info', event.target.value)}
              placeholder="Information on battery collection, preparation for second life, and treatment at end of life"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-emerald-600" />
            Second Life
          </CardTitle>
          <CardDescription>Repurposing and second life applicability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="second_life_applicable"
              checked={getBooleanValue(formData.second_life_applicable)}
              onCheckedChange={checked => onChange('second_life_applicable', checked === true)}
            />
            <Label htmlFor="second_life_applicable">Second Life Applicable</Label>
          </div>

          <div className="space-y-2">
            <Label>Repurposing Information</Label>
            <Textarea
              value={getTextValue(formData.repurposing_info)}
              onChange={event => onChange('repurposing_info', event.target.value)}
              placeholder="Information on repurposing possibilities and requirements"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
