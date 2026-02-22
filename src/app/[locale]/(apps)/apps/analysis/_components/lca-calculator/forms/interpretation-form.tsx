'use client';

import type { LcaCalculatorChangeHandler, LcaCalculatorFormData } from '@/types/lca-calculator';
import { Lightbulb } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Switch,
  Textarea,
} from '@/components/ui';

import { getString } from '../utils';

type InterpretationFormProps = {
  formData: LcaCalculatorFormData;
  onChange: LcaCalculatorChangeHandler;
};

export function InterpretationForm({ formData, onChange }: InterpretationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-emerald-600" />
          Interpretation
        </CardTitle>
        <CardDescription>Section 4 - Analysis and recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Identification of Significant Issues</Label>
          <Textarea
            value={getString(formData.significant_issues)}
            onChange={event => onChange('significant_issues', event.target.value)}
            placeholder="Describe significant environmental issues identified…"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Critical Hotspots Identified</Label>
          <Textarea
            value={getString(formData.critical_hotspots)}
            onChange={event => onChange('critical_hotspots', event.target.value)}
            placeholder="List processes or life-cycle stages driving the impact profile…"
            rows={3}
          />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
          <Switch
            checked={Boolean(formData.sensitivity_analysis_performed)}
            onCheckedChange={checked => onChange('sensitivity_analysis_performed', checked)}
          />
          <div>
            <p className="text-sm font-medium text-foreground">Sensitivity Analysis Performed</p>
            <p className="text-xs text-muted-foreground">Indicate if uncertainty or sensitivity studies were conducted.</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Conclusions</Label>
          <Textarea
            value={getString(formData.conclusions)}
            onChange={event => onChange('conclusions', event.target.value)}
            placeholder="Summarize key findings and implications for stakeholders…"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Improvement Recommendations</Label>
          <Textarea
            value={getString(formData.recommendations)}
            onChange={event => onChange('recommendations', event.target.value)}
            placeholder="Provide actionable recommendations to reduce impacts…"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
