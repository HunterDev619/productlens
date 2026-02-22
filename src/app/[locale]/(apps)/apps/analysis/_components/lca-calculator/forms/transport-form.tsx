'use client';

import { Plus, Trash2, Truck } from 'lucide-react';

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
import type { LcaCalculatorChangeHandler, LcaCalculatorFormData, LcaTransportEntry } from '@/types/lca-calculator';

import { getString, toNumberOrEmpty } from '../utils';

type TransportFormProps = {
  formData: LcaCalculatorFormData;
  onChange: LcaCalculatorChangeHandler;
};

const TRANSPORT_FACTORS: Record<string, number> = {
  Road: 0.062,
  Rail: 0.022,
  Sea: 0.008,
  Air: 0.602,
  Pipeline: 0.005,
};

export function TransportForm({ formData, onChange }: TransportFormProps) {
  const transport = formData.transport ?? [];

  const addTransport = () => {
    const next: LcaTransportEntry[] = [
      ...transport,
      {
        material_product: '',
        mode: '',
        distance_km: '',
        load_factor_percent: '',
        trips: '',
        emission_factor: '',
      },
    ];
    onChange('transport', next);
  };

  const updateTransport = (index: number, payload: Partial<LcaTransportEntry>) => {
    const next = [...transport];
    next[index] = { ...next[index], ...payload };
    onChange('transport', next);
  };

  const removeTransport = (index: number) => {
    const next = transport.filter((_, entryIndex) => entryIndex !== index);
    onChange('transport', next);
  };

  const totalEmissions = transport.reduce((total, entry) => {
    const distance = typeof entry.distance_km === 'number' ? entry.distance_km : Number(entry.distance_km) || 0;
    const loadFactor = typeof entry.load_factor_percent === 'number'
      ? entry.load_factor_percent
      : Number(entry.load_factor_percent) || 100;
    const trips = typeof entry.trips === 'number' ? entry.trips : Number(entry.trips) || 1;
    const emissionFactor = typeof entry.emission_factor === 'number'
      ? entry.emission_factor
      : Number(entry.emission_factor) || 0;

    const effectiveFactor = emissionFactor / (loadFactor / 100);
    return total + distance * effectiveFactor * trips;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-emerald-600" />
          Transportation &amp; Distribution
        </CardTitle>
        <CardDescription>LCI 3.1 - Transport details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {transport.map((entry, index) => (
          <div key={`transport-${index}`} className="p-4 bg-slate-50 rounded-lg border space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-700">Transport {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => removeTransport(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Material / Product</Label>
                <Input
                  value={getString(entry.material_product)}
                  onChange={event => updateTransport(index, { material_product: event.target.value })}
                  placeholder="Raw lithium, Battery cells..."
                />
              </div>
              <div className="space-y-2">
                <Label>Transport Mode</Label>
                <Select
                  value={getString(entry.mode)}
                  onValueChange={value => {
                    updateTransport(index, { mode: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TRANSPORT_FACTORS).map(([mode]) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Distance (km)</Label>
                <Input
                  type="number"
                  value={entry.distance_km ?? ''}
                  onChange={event => updateTransport(index, { distance_km: toNumberOrEmpty(event.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Load Factor (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={entry.load_factor_percent ?? ''}
                  onChange={event => {
                    const val = event.target.value;
                    if (val === '') {
                      updateTransport(index, { load_factor_percent: '' });
                    } else {
                      const num = Number(val);
                      updateTransport(index, { load_factor_percent: Math.max(0, Math.min(100, num)) });
                    }
                  }}
                  placeholder="85"
                />
              </div>
              <div className="space-y-2">
                <Label>Number of Trips</Label>
                <Input
                  type="number"
                  value={entry.trips ?? ''}
                  onChange={event => updateTransport(index, { trips: toNumberOrEmpty(event.target.value) })}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Emission Factor (kg CO₂/tkm)</Label>
                <Input
                  type="number"
                  value={entry.emission_factor ?? ''}
                  onChange={event => updateTransport(index, { emission_factor: toNumberOrEmpty(event.target.value) })}
                  placeholder="Auto-filled"
                />
                <p className="text-xs text-slate-400">Source: GLEC Framework 2023</p>
              </div>
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addTransport} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Transport
        </Button>

        {transport.length > 0 && (
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-900">Total Transport Emissions</p>
                <p className="text-xs text-purple-600">All transport routes combined</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-700">{totalEmissions.toFixed(2)}</p>
                <p className="text-xs text-purple-600">kg CO₂e</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
