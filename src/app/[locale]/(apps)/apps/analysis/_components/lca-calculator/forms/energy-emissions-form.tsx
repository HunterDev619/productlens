'use client';

import type { LcaCalculatorChangeHandler, LcaCalculatorFormData, LcaEnergyInput } from '@/types/lca-calculator';
import { Plus, Trash2, Zap } from 'lucide-react';
import {
  Button,
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

import { getString, toNumberOrEmpty } from '../utils';

type EnergyEmissionsFormProps = {
  formData: LcaCalculatorFormData;
  onChange: LcaCalculatorChangeHandler;
};

const AIR_EMISSIONS_FIELDS = [
  { key: 'air_co2_kg', label: 'CO₂' },
  { key: 'air_ch4_kg', label: 'CH₄' },
  { key: 'air_n2o_kg', label: 'N₂O' },
  { key: 'air_nox_kg', label: 'NOx' },
  { key: 'air_sox_kg', label: 'SOx' },
] as const;

const WATER_EMISSIONS_FIELDS = [
  { key: 'water_cod_kg', label: 'COD' },
  { key: 'water_bod_kg', label: 'BOD' },
] as const;

const SOLID_WASTE_FIELDS = [
  { key: 'solid_hazardous_kg', label: 'Hazardous' },
  { key: 'solid_nonhazardous_kg', label: 'Non-hazardous' },
] as const;

export function EnergyEmissionsForm({ formData, onChange }: EnergyEmissionsFormProps) {
  const energyInputs = formData.energy_inputs ?? [];
  const emissions = formData.emissions ?? {};

  const addEnergyInput = () => {
    const next: LcaEnergyInput[] = [
      ...energyInputs,
      {
        energy_type: '',
        energy_use_kwh: '',
        source: '',
        emission_factor: '',
        notes: '',
      },
    ];
    onChange('energy_inputs', next);
  };

  const updateEnergyInput = (index: number, payload: Partial<LcaEnergyInput>) => {
    const next = [...energyInputs];
    next[index] = { ...next[index], ...payload };
    onChange('energy_inputs', next);
  };

  const removeEnergyInput = (index: number) => {
    const next = energyInputs.filter((_, i) => i !== index);
    onChange('energy_inputs', next);
  };

  const updateEmission = (field: string, value: number | '') => {
    onChange('emissions', { ...emissions, [field]: value });
  };

  const energyEmissions = energyInputs.reduce((total, entry) => {
    const usage = typeof entry.energy_use_kwh === 'number' ? entry.energy_use_kwh : Number(entry.energy_use_kwh) || 0;
    const factor = typeof entry.emission_factor === 'number' ? entry.emission_factor : Number(entry.emission_factor) || 0;
    return total + usage * factor;
  }, 0);

  const directEmissions = (Number(emissions.air_co2_kg) || 0)
    + (Number(emissions.air_ch4_kg) || 0) * 28
    + (Number(emissions.air_n2o_kg) || 0) * 265
    + (Number(emissions.air_nox_kg) || 0) * 0.00001
    + (Number(emissions.air_sox_kg) || 0) * 0.00001;

  const totalEnergyKwh = energyInputs.reduce(
    (sum, entry) => sum + (typeof entry.energy_use_kwh === 'number' ? entry.energy_use_kwh : Number(entry.energy_use_kwh) || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-emerald-600" />
            Energy Inputs
          </CardTitle>
          <CardDescription>LCI Section 2.2 - Energy consumption data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {energyInputs.map((input, index) => (
            <div key={`energy-${index}`} className="p-4 bg-slate-50 rounded-lg border space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-700">
                  Energy Input
                  {' '}
                  {index + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => removeEnergyInput(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Energy Type</Label>
                  <Input
                    value={getString(input.energy_type)}
                    onChange={event => updateEnergyInput(index, { energy_type: event.target.value })}
                    placeholder="e.g., Electricity, Natural Gas"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Energy Use (kWh)</Label>
                  <Input
                    type="number"
                    value={input.energy_use_kwh ?? ''}
                    onChange={event => updateEnergyInput(index, { energy_use_kwh: toNumberOrEmpty(event.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Source</Label>
                  <Select
                    value={getString(input.source)}
                    onValueChange={value => updateEnergyInput(index, { source: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Grid', 'Renewables', 'Fossil', 'Mixed'].map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Emission Factor (kg CO₂/kWh)</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={input.emission_factor ?? ''}
                    onChange={event => updateEnergyInput(index, { emission_factor: toNumberOrEmpty(event.target.value) })}
                    placeholder="0.000"
                  />
                  <p className="text-xs text-slate-400">Enter emission factor manually</p>
                </div>
                <div className="space-y-2">
                  <Label>Data Source Type</Label>
                  <Select
                    value={getString(input.data_source)}
                    onValueChange={value => updateEnergyInput(index, { data_source: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select data source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary Data (Metered/Measured)</SelectItem>
                      <SelectItem value="secondary">Secondary Data (Estimated/Database)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input
                    value={getString(input.notes)}
                    onChange={event => updateEnergyInput(index, { notes: event.target.value })}
                    placeholder="Additional notes"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addEnergyInput} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Energy Input
          </Button>

          {energyInputs.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-blue-900">Energy-Related Emissions</p>
                  <p className="text-xs text-blue-600">
                    {`Total energy: ${totalEnergyKwh.toFixed(1)} kWh`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-700">{energyEmissions.toFixed(2)}</p>
                  <p className="text-xs text-blue-600">kg CO₂e</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-blue-200 pt-3">
                {energyInputs.map((e, i) => {
                  const usage = typeof e.energy_use_kwh === 'number' ? e.energy_use_kwh : Number(e.energy_use_kwh) || 0;
                  const factor = typeof e.emission_factor === 'number' ? e.emission_factor : Number(e.emission_factor) || 0;
                  return (
                    <div key={`energy-breakdown-${i}`} className="text-xs">
                      <span className="text-blue-600">{e.energy_type || 'Energy'}:</span>
                      <span className="ml-1 font-medium text-blue-800">
                        {(usage * factor).toFixed(2)}
                        {' '}
                        kg CO₂e
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emissions &amp; Waste</CardTitle>
          <CardDescription>LCI Section 2.3 - Air, water, and solid waste emissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <h4 className="mb-3 font-medium text-blue-800">Air Emissions (kg)</h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {AIR_EMISSIONS_FIELDS.map(field => (
                <div key={field.key} className="space-y-2">
                  <Label className="text-xs text-blue-700">{field.label}</Label>
                  <Input
                    type="number"
                    value={emissions[field.key] ?? ''}
                    onChange={event => updateEmission(field.key, toNumberOrEmpty(event.target.value))}
                    placeholder="0.00"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-cyan-100 bg-cyan-50 p-4">
            <h4 className="mb-3 font-medium text-cyan-800">Water Emissions (kg)</h4>
            <div className="grid grid-cols-2 gap-4">
              {WATER_EMISSIONS_FIELDS.map(field => (
                <div key={field.key} className="space-y-2">
                  <Label className="text-xs text-cyan-700">{field.label}</Label>
                  <Input
                    type="number"
                    value={emissions[field.key] ?? ''}
                    onChange={event => updateEmission(field.key, toNumberOrEmpty(event.target.value))}
                    placeholder="0.00"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <h4 className="mb-3 font-medium text-amber-800">Solid Waste (kg)</h4>
            <div className="grid grid-cols-2 gap-4">
              {SOLID_WASTE_FIELDS.map(field => (
                <div key={field.key} className="space-y-2">
                  <Label className="text-xs text-amber-700">{field.label}</Label>
                  <Input
                    type="number"
                    value={emissions[field.key] ?? ''}
                    onChange={event => updateEmission(field.key, toNumberOrEmpty(event.target.value))}
                    placeholder="0.00"
                  />
                </div>
              ))}
            </div>
          </div>

          {(emissions.air_co2_kg || emissions.air_ch4_kg || emissions.air_n2o_kg) && (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-amber-900">Direct GHG Emissions</p>
                  <p className="text-xs text-amber-600">CO₂, CH₄, N₂O (GWP100)</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-amber-700">{directEmissions.toFixed(2)}</p>
                  <p className="text-xs text-amber-600">kg CO₂e</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-amber-200 pt-3">
                {emissions.air_co2_kg && (
                  <div className="text-xs">
                    <span className="text-amber-600">CO₂:</span>
                    <span className="ml-1 font-medium text-amber-800">
                      {Number(emissions.air_co2_kg).toFixed(2)}
                      {' '}
                      kg
                    </span>
                  </div>
                )}
                {emissions.air_ch4_kg && (
                  <div className="text-xs">
                    <span className="text-amber-600">CH₄:</span>
                    <span className="ml-1 font-medium text-amber-800">
                      {Number(emissions.air_ch4_kg).toFixed(2)}
                      {' '}
                      kg × 28
                    </span>
                  </div>
                )}
                {emissions.air_n2o_kg && (
                  <div className="text-xs">
                    <span className="text-amber-600">N₂O:</span>
                    <span className="ml-1 font-medium text-amber-800">
                      {Number(emissions.air_n2o_kg).toFixed(2)}
                      {' '}
                      kg × 265
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {(energyInputs.length > 0 || emissions.air_co2_kg) && (
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-900">Total Energy &amp; Emissions</p>
                  <p className="text-xs text-emerald-600">Combined impact</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-700">{(energyEmissions + directEmissions).toFixed(2)}</p>
                  <p className="text-xs text-emerald-600">kg CO₂e</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
