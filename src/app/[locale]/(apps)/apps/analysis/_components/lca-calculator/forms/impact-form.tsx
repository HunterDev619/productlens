'use client';

import { BarChart3 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/ui';
import type { LcaCalculatorChangeHandler, LcaCalculatorFormData } from '@/types/lca-calculator';

import { toNumberOrEmpty } from '../utils';

type ImpactFormProps = {
  formData: LcaCalculatorFormData;
  onChange: LcaCalculatorChangeHandler;
};

const IMPACT_FIELDS = [
  {
    key: 'impact_climate_change_kg_co2e',
    label: 'Climate Change (kg CO₂e)',
    description: 'Global warming potential (GWP100)',
    accent: 'bg-red-50 border-red-100 text-red-800',
  },
  {
    key: 'impact_acidification_kg_so2_eq',
    label: 'Acidification (kg SO₂ eq)',
    description: 'Potential for acid rain and terrestrial ecosystem damage',
    accent: 'bg-orange-50 border-orange-100 text-orange-800',
  },
  {
    key: 'impact_eutrophication_kg_po4_eq',
    label: 'Eutrophication (kg PO₄³⁻ eq)',
    description: 'Nutrient enrichment for aquatic/terrestrial ecosystems',
    accent: 'bg-green-50 border-green-100 text-green-800',
  },
  {
    key: 'impact_resource_depletion_kg_sb_eq',
    label: 'Resource Depletion (kg Sb eq)',
    description: 'Abiotic depletion of mineral and fossil resources',
    accent: 'bg-purple-50 border-purple-100 text-purple-800',
  },
] as const;

export function ImpactForm({ formData, onChange }: ImpactFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-emerald-600" />
          Life Cycle Impact Assessment (LCIA)
        </CardTitle>
        <CardDescription>
          Impact assessment results based on selected method:
          {' '}
          {formData.impact_assessment_method || 'Not selected'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {IMPACT_FIELDS.map(field => (
            <div key={field.key} className={`space-y-2 rounded-lg border p-4 ${field.accent}`}>
              <div className="space-y-1">
                <Label className="font-medium">{field.label}</Label>
                <p className="text-xs text-muted-foreground">{field.description}</p>
              </div>
              <Input
                type="number"
                step="any"
                value={formData[field.key] ?? ''}
                onChange={event => onChange(field.key, toNumberOrEmpty(event.target.value))}
                placeholder="0.00"
                className="bg-white"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
