'use client';

import { FileText } from 'lucide-react';

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
  Switch,
  Textarea,
} from '@/components/ui';
import type { LcaCalculatorChangeHandler, LcaCalculatorFormData } from '@/types/lca-calculator';

import { getString } from '../utils';

type GoalScopeFormProps = {
  formData: LcaCalculatorFormData;
  onChange: LcaCalculatorChangeHandler;
};

export function GoalScopeForm({ formData, onChange }: GoalScopeFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-600" />
          Goal &amp; Scope Definition
        </CardTitle>
        <CardDescription>ISO 14040 / ISO 14044 compliant inputs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="p-4 bg-slate-50 rounded-lg border">
          <h4 className="mb-3 font-medium text-slate-800">Product Information</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input
                value={getString(formData.product_name)}
                onChange={event => onChange('product_name', event.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <Label>Product Category</Label>
              <Input
                value={getString(formData.product_category)}
                onChange={event => onChange('product_category', event.target.value)}
                placeholder="e.g., Battery, Electronics"
              />
            </div>
            <div className="space-y-2">
              <Label>Company / Organisation</Label>
              <Input
                value={getString(formData.company_organisation)}
                onChange={event => onChange('company_organisation', event.target.value)}
                placeholder="Organisation name"
              />
            </div>
            <div className="space-y-2">
              <Label>Assessment Date</Label>
              <Input
                type="date"
                value={getString(formData.assessment_date)}
                onChange={event => onChange('assessment_date', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Assessor Name *</Label>
              <Input
                value={getString(formData.assessor_name)}
                onChange={event => onChange('assessor_name', event.target.value)}
                placeholder="Name of assessor"
              />
            </div>
            <div className="space-y-2">
              <Label>Geographical Scope</Label>
              <Input
                value={getString(formData.geographical_scope)}
                onChange={event => onChange('geographical_scope', event.target.value)}
                placeholder="e.g., EU, Global, Regional"
              />
            </div>
          </div>
        </section>

        <section className="p-4 bg-slate-50 rounded-lg border">
          <h4 className="mb-3 font-medium text-slate-800">Goal of Study</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Goal of the Study</Label>
              <Textarea
                value={getString(formData.goal_of_study)}
                onChange={event => onChange('goal_of_study', event.target.value)}
                placeholder="Describe the goal of this LCA study..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Intended Application</Label>
                <Input
                  value={getString(formData.intended_application)}
                  onChange={event => onChange('intended_application', event.target.value)}
                  placeholder="e.g., Product development, EPD"
                />
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Input
                  value={getString(formData.target_audience)}
                  onChange={event => onChange('target_audience', event.target.value)}
                  placeholder="Internal teams, suppliers..."
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={Boolean(formData.comparative_study)}
                onCheckedChange={checked => onChange('comparative_study', checked)}
              />
              <Label className="text-sm text-slate-700">Comparative Study</Label>
            </div>
          </div>
        </section>

        <section className="p-4 bg-slate-50 rounded-lg border">
          <h4 className="mb-3 font-medium text-slate-800">Scope Definition</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Scope Description</Label>
              <Textarea
                value={getString(formData.scope_description)}
                onChange={event => onChange('scope_description', event.target.value)}
                placeholder="Describe the scope of this assessment..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Functional Unit *</Label>
                <Input
                  value={getString(formData.functional_unit)}
                  onChange={event => onChange('functional_unit', event.target.value)}
                  placeholder="e.g., 1 kWh of battery capacity"
                />
              </div>
              <div className="space-y-2">
                <Label>System Boundary *</Label>
                <Select
                  value={getString(formData.system_boundary)}
                  onValueChange={value => onChange('system_boundary', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select boundary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cradle-to-Grave">Cradle-to-Grave</SelectItem>
                    <SelectItem value="Cradle-to-Gate">Cradle-to-Gate</SelectItem>
                    <SelectItem value="Gate-to-Gate">Gate-to-Gate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Impact Assessment Method *</Label>
            <Select
              value={getString(formData.impact_assessment_method)}
              onValueChange={value => onChange('impact_assessment_method', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {['IPCC AR6', 'ReCiPe', 'CML', 'TRACI', 'EF 3.0', 'Other'].map(method => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Allocation Procedures</Label>
            <Input
              value={getString(formData.allocation_procedures)}
              onChange={event => onChange('allocation_procedures', event.target.value)}
              placeholder="e.g., Mass, Economic, Energy"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Assumptions &amp; Limitations</Label>
          <Textarea
            value={getString(formData.assumptions_limitations)}
            onChange={event => onChange('assumptions_limitations', event.target.value)}
            placeholder="List key assumptions and limitations..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
