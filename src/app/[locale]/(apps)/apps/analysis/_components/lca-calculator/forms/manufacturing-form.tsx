'use client';

import { Factory, Plus, Trash2 } from 'lucide-react';

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
import type { LcaCalculatorChangeHandler, LcaCalculatorFormData, LcaManufacturingProcess } from '@/types/lca-calculator';

import { getString, toNumberOrEmpty } from '../utils';

type ManufacturingFormProps = {
  formData: LcaCalculatorFormData;
  onChange: LcaCalculatorChangeHandler;
};


const FUEL_FACTORS = [
  { label: 'Natural Gas (0.056)', value: '0.056' },
  { label: 'Diesel (0.074)', value: '0.074' },
  { label: 'LPG (0.069)', value: '0.069' },
  { label: 'Fuel Oil (0.077)', value: '0.077' },
  { label: 'Coal (0.095)', value: '0.095' },
  { label: 'Biogas (0.000)', value: '0' },
  { label: 'Green Hydrogen (0.000)', value: '0' },
];

const DEFAULT_PROCESS: LcaManufacturingProcess = {
  process_name: '',
  energy_kwh: '',
  grid_ef: '',
  fuel_mj: '',
  fuel_ef: '',
  renewable_percent: '',
};

const calculateProcessEmissions = (process: LcaManufacturingProcess) => {
  const energy = Number(process.energy_kwh) || 0;
  const gridFactor = Number(process.grid_ef) || 0;
  const fuel = Number(process.fuel_mj) || 0;
  const fuelFactor = Number(process.fuel_ef) || 0;
  const renewableShare = Number(process.renewable_percent) || 0;

  const electricityEmissions = energy * gridFactor * (1 - renewableShare / 100);
  const fuelEmissions = fuel * fuelFactor;
  return electricityEmissions + fuelEmissions;
};

export function ManufacturingForm({ formData, onChange }: ManufacturingFormProps) {
  const processes = (formData.manufacturing_processes ?? []) as LcaManufacturingProcess[];

  const addProcess = () => {
    onChange('manufacturing_processes', [...processes, { ...DEFAULT_PROCESS }]);
  };

  const updateProcess = (index: number, payload: Partial<LcaManufacturingProcess>) => {
    const next = [...processes];
    next[index] = { ...next[index], ...payload };
    onChange('manufacturing_processes', next);
  };

  const removeProcess = (index: number) => {
    onChange('manufacturing_processes', processes.filter((_, i) => i !== index));
  };

  const totalEmissions = processes.reduce((sum, process) => sum + calculateProcessEmissions(process), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Factory className="h-5 w-5 text-emerald-600" />
          Manufacturing
        </CardTitle>
        <CardDescription>LCI Section 4 - Manufacturing process energy consumption</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {processes.map((process, index) => (
          <div key={`manufacturing-${index}`} className="p-4 bg-slate-50 rounded-lg border space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-700">Manufacturing Process {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => removeProcess(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>Process Name</Label>
                <Input
                  value={getString(process.process_name)}
                  onChange={event => updateProcess(index, { process_name: event.target.value })}
                  placeholder="Cell assembly, Casing..."
                />
              </div>
              <div className="space-y-2">
                <Label>Electricity Use (kWh)</Label>
                <Input
                  type="number"
                  value={process.energy_kwh ?? ''}
                  onChange={event => updateProcess(index, { energy_kwh: toNumberOrEmpty(event.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Grid Emission Factor (kg CO₂/kWh)</Label>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  value={process.grid_ef ?? ''}
                  onChange={event => updateProcess(index, { grid_ef: toNumberOrEmpty(event.target.value) })}
                  placeholder="e.g., 0.420"
                />
                <p className="text-xs text-slate-400">Source: IEA 2023. Enter a value or use a national/regional average.</p>
              </div>
              <div className="space-y-2">
                <Label>Fuel Use (MJ)</Label>
                <Input
                  type="number"
                  value={process.fuel_mj ?? ''}
                  onChange={event => updateProcess(index, { fuel_mj: toNumberOrEmpty(event.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Fuel Emission Factor (kg CO₂/MJ)</Label>
                <Select
                  value={process.fuel_ef?.toString() ?? ''}
                  onValueChange={value => updateProcess(index, { fuel_ef: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel factor" />
                  </SelectTrigger>
                  <SelectContent>
                    {FUEL_FACTORS.map(option => (
                      <SelectItem key={option.label} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-400">Source: IPCC 2006</p>
              </div>
              <div className="space-y-2">
                <Label>Renewable Share (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={process.renewable_percent ?? ''}
                  onChange={event => {
                    const val = event.target.value;
                    if (val === '') {
                      updateProcess(index, { renewable_percent: '' });
                    } else {
                      const num = Number(val);
                      updateProcess(index, { renewable_percent: Math.max(0, Math.min(100, num)) });
                    }
                  }}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addProcess} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Manufacturing Process
        </Button>

        {processes.length > 0 && (
          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-900">Total Manufacturing Emissions</p>
                <p className="text-xs text-orange-600">Electricity + fuel combustion</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-700">{totalEmissions.toFixed(2)}</p>
                <p className="text-xs text-orange-600">kg CO₂e</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 border-t border-orange-100 pt-3 sm:grid-cols-2">
              {processes.map((process, index) => {
                const processTotal = calculateProcessEmissions(process);
                if (!processTotal) {
                  return null;
                }
                return (
                  <div key={`manufacturing-summary-${index}`} className="text-xs">
                    <span className="text-orange-600">{process.process_name || `Process ${index + 1}`}:</span>
                    <span className="ml-1 font-medium text-orange-800">
                      {processTotal.toFixed(2)}
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
  );
}
