import { Package } from 'lucide-react';

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

type MaterialsFormProps = {
  formData: BatteryPassportFormData;
  onChange: BatteryPassportFormChangeHandler;
  validationErrors?: string[];
};

export function MaterialsForm({ formData, onChange, validationErrors = [] }: MaterialsFormProps) {
  const hasChemistryError = validationErrors.includes('identification.chemistry');
  const criticalMaterialsValue = Array.isArray(formData.critical_raw_materials)
    ? formData.critical_raw_materials.join(', ')
    : getTextValue(formData.critical_raw_materials);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-emerald-600" />
          Materials &amp; Composition
        </CardTitle>
        <CardDescription>Battery chemistry and material composition</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className={hasChemistryError ? 'text-red-600' : ''}>Battery Chemistry *</Label>
          <Select value={getTextValue(formData.battery_chemistry)} onValueChange={value => onChange('battery_chemistry', value)}>
            <SelectTrigger className={hasChemistryError ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select chemistry type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lead-acid">Lead-acid</SelectItem>
              <SelectItem value="LFP">LFP (Lithium Iron Phosphate)</SelectItem>
              <SelectItem value="Li-LCO">Li-LCO (Lithium Cobalt Oxide)</SelectItem>
              <SelectItem value="Li-LMO">Li-LMO (Lithium Manganese Oxide)</SelectItem>
              <SelectItem value="Li-LTO">Li-LTO (Lithium Titanate)</SelectItem>
              <SelectItem value="Li-NCA">Li-NCA (Lithium Nickel Cobalt Aluminum)</SelectItem>
              <SelectItem value="Li-NMC">Li-NMC (Lithium Nickel Manganese Cobalt)</SelectItem>
              <SelectItem value="Na-ion">Sodium-ion</SelectItem>
              <SelectItem value="Ni-MH">Ni-MH (Nickel Metal Hydride)</SelectItem>
              <SelectItem value="Solid-state">Solid-state Lithium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Cathode Material</Label>
            <Select value={getTextValue(formData.cathode_material)} onValueChange={value => onChange('cathode_material', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select cathode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LCO">LCO</SelectItem>
                <SelectItem value="LFP">LFP</SelectItem>
                <SelectItem value="LMO">LMO</SelectItem>
                <SelectItem value="LNMO">LNMO</SelectItem>
                <SelectItem value="NCA">NCA</SelectItem>
                <SelectItem value="NMC 111">NMC 111</SelectItem>
                <SelectItem value="NMC 532">NMC 532</SelectItem>
                <SelectItem value="NMC 622">NMC 622</SelectItem>
                <SelectItem value="NMC 811">NMC 811</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Anode Material</Label>
            <Select value={getTextValue(formData.anode_material)} onValueChange={value => onChange('anode_material', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select anode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Graphite">Graphite</SelectItem>
                <SelectItem value="Hard Carbon">Hard Carbon</SelectItem>
                <SelectItem value="Lithium Metal">Lithium Metal</SelectItem>
                <SelectItem value="LTO">LTO (Lithium Titanate)</SelectItem>
                <SelectItem value="Silicon">Silicon</SelectItem>
                <SelectItem value="Silicon-Graphite">Silicon-Graphite composite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Electrolyte Material</Label>
            <Select value={getTextValue(formData.electrolyte_material)} onValueChange={value => onChange('electrolyte_material', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select electrolyte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ceramic solid">Ceramic solid</SelectItem>
                <SelectItem value="Gel polymer">Gel polymer</SelectItem>
                <SelectItem value="LiBF4">LiBF4</SelectItem>
                <SelectItem value="LiClO4">LiClO4</SelectItem>
                <SelectItem value="LiPF6">LiPF6</SelectItem>
                <SelectItem value="LiTFSI">LiTFSI</SelectItem>
                <SelectItem value="Solid polymer">Solid polymer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Critical Raw Materials</Label>
          <Textarea
            value={criticalMaterialsValue}
            onChange={event => {
              const entries = event.target.value
                .split(',')
                .map(entry => entry.trim())
                .filter(Boolean);
              onChange('critical_raw_materials', entries);
            }}
            placeholder="Cobalt, Lithium, Natural Graphite, Nickel (comma separated)"
            rows={2}
          />
        </div>

        <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
          <h4 className="mb-3 font-medium text-amber-800">Hazardous Substances</h4>
          <div className="space-y-2">
            <Label className="text-amber-700">Hazardous Substances Information</Label>
            <Textarea
              value={getTextValue(formData.hazardous_substances_text)}
              onChange={event => onChange('hazardous_substances_text', event.target.value)}
              placeholder="List hazardous substances with CAS numbers, concentrations, and locations"
              rows={3}
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label className="text-amber-700">Impact on Environment, Health, Safety</Label>
            <Textarea
              value={getTextValue(formData.substances_impact_info)}
              onChange={event => onChange('substances_impact_info', event.target.value)}
              placeholder="Describe impact of substances on environment, human health, safety, and persons"
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
