'use client';

import { Package, Plus, Trash2 } from 'lucide-react';

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
import type { LcaCalculatorChangeHandler, LcaCalculatorFormData, LcaMaterial } from '@/types/lca-calculator';

import { getString, toNumberOrEmpty } from '../utils';

type MaterialsFormProps = {
  formData: LcaCalculatorFormData;
  onChange: LcaCalculatorChangeHandler;
};

export function MaterialsForm({ formData, onChange }: MaterialsFormProps) {
  const materials = formData.materials ?? [];

  const addMaterial = () => {
    const next: LcaMaterial[] = [
      ...materials,
      {
        name: '',
        quantity_kg: '',
        source_country: '',
        extraction_method: '',
        recycled_content_percent: '',
        emission_factor: '',
        notes: '',
      },
    ];
    onChange('materials', next);
  };

  const updateMaterial = (index: number, payload: Partial<LcaMaterial>) => {
    const next = [...materials];
    next[index] = { ...next[index], ...payload };
    onChange('materials', next);
  };

  const removeMaterial = (index: number) => {
    const next = materials.filter((_, materialIndex) => materialIndex !== index);
    onChange('materials', next);
  };

  const totalEmissions = materials.reduce((total, material) => {
    const quantity = typeof material.quantity_kg === 'number' ? material.quantity_kg : Number(material.quantity_kg) || 0;
    const factor = typeof material.emission_factor === 'number' ? material.emission_factor : Number(material.emission_factor) || 0;
    const recycled = typeof material.recycled_content_percent === 'number'
      ? material.recycled_content_percent
      : Number(material.recycled_content_percent) || 0;

    const effectiveFactor = factor * (1 - recycled / 100);
    return total + quantity * effectiveFactor;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-emerald-600" />
          Material Inventory
        </CardTitle>
        <CardDescription>Raw Materials Extraction &amp; Processing (LCI Section 2.1)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {materials.map((material, index) => (
          <div key={`material-${index}`} className="p-4 bg-slate-50 rounded-lg border space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-700">Material {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => removeMaterial(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Material Name</Label>
                <Input
                  value={getString(material.name)}
                  onChange={event => updateMaterial(index, { name: event.target.value })}
                  placeholder="Lithium, Cobalt..."
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity (kg/unit)</Label>
                <Input
                  type="number"
                  value={material.quantity_kg ?? ''}
                  onChange={event => updateMaterial(index, { quantity_kg: toNumberOrEmpty(event.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Source Country</Label>
                <Input
                  value={getString(material.source_country)}
                  onChange={event => updateMaterial(index, { source_country: event.target.value })}
                  placeholder="Australia, Chile..."
                />
              </div>
              <div className="space-y-2">
                <Label>Extraction Method</Label>
                <Input
                  value={getString(material.extraction_method)}
                  onChange={event => updateMaterial(index, { extraction_method: event.target.value })}
                  placeholder="Mining, Brine extraction..."
                />
              </div>
              <div className="space-y-2">
                <Label>Recycled Content (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={material.recycled_content_percent ?? ''}
                  onChange={event => {
                    const val = event.target.value;
                    if (val === '') {
                      updateMaterial(index, { recycled_content_percent: '' });
                    } else {
                      const num = Number(val);
                      updateMaterial(index, { recycled_content_percent: Math.max(0, Math.min(100, num)) });
                    }
                  }}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Emission Factor (kg CO₂/kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={material.emission_factor ?? ''}
                  onChange={event => updateMaterial(index, { emission_factor: toNumberOrEmpty(event.target.value) })}
                  placeholder="0.0"
                />
                <p className="text-xs text-slate-400">Enter emission factor manually</p>
              </div>
              <div className="space-y-2">
                <Label>Data Source Type</Label>
                <Select
                  value={getString(material.data_source)}
                  onValueChange={value => updateMaterial(index, { data_source: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary Data (Site-specific)</SelectItem>
                    <SelectItem value="secondary">Secondary Data (Database/Literature)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Environmental Notes</Label>
                <Input
                  value={getString(material.notes)}
                  onChange={event => updateMaterial(index, { notes: event.target.value })}
                  placeholder="Environmental considerations..."
                />
              </div>
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addMaterial} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Material
        </Button>

        {materials.length > 0 && (
          <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-900">Total Material Emissions</p>
                <p className="text-xs text-emerald-600">Raw material extraction &amp; processing</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-700">{totalEmissions.toFixed(2)}</p>
                <p className="text-xs text-emerald-600">kg CO₂e</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
