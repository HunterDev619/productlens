'use client';

import { ArrowRight } from 'lucide-react';

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
  Textarea,
} from '@/components/ui';
import type { LcaCalculatorChangeHandler, LcaCalculatorFormData } from '@/types/lca-calculator';

import { getString } from '../utils';

type ReferenceFlowFormProps = {
  formData: LcaCalculatorFormData;
  onChange: LcaCalculatorChangeHandler;
};

export function ReferenceFlowForm({ formData, onChange }: ReferenceFlowFormProps) {
  const referenceFlowQuantity = typeof formData.reference_flow_quantity === 'number' ? formData.reference_flow_quantity : parseFloat(String(formData.reference_flow_quantity || '0')) || 0;
  const conversionRatio = typeof formData.conversion_ratio === 'number' ? formData.conversion_ratio : parseFloat(String(formData.conversion_ratio || '0')) || 0;
  const calculatedOutput = referenceFlowQuantity && conversionRatio 
    ? (referenceFlowQuantity * conversionRatio).toFixed(2) 
    : '0.00';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-emerald-600" />
            Reference Flow Definition
          </CardTitle>
          <CardDescription>
            Quantification of products/processes required to fulfill the functional unit (ISO 14040:2006, 3.30)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="mb-2 font-medium text-blue-900">Reference Flow Concept</h4>
            <p className="text-sm text-blue-700">
              The reference flow is the measure of the outputs from processes in a given product system 
              required to fulfill the function expressed by the functional unit. It serves as the basis 
              for all inventory calculations in the LCA.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Reference Product/Service</Label>
              <Input 
                value={getString(formData.reference_product)} 
                onChange={(e) => onChange('reference_product', e.target.value)}
                placeholder="e.g., Lithium-ion battery pack"
              />
            </div>
            <div className="space-y-2">
              <Label>Reference Flow Unit</Label>
              <Select 
                value={getString(formData.reference_flow_unit)} 
                onValueChange={(v) => onChange('reference_flow_unit', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg (kilogram)</SelectItem>
                  <SelectItem value="kWh">kWh (kilowatt-hour)</SelectItem>
                  <SelectItem value="unit">unit (piece)</SelectItem>
                  <SelectItem value="m2">m² (square meter)</SelectItem>
                  <SelectItem value="m3">m³ (cubic meter)</SelectItem>
                  <SelectItem value="ton">ton (metric ton)</SelectItem>
                  <SelectItem value="MJ">MJ (megajoule)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reference Flow Quantity</Label>
              <Input 
                type="number"
                value={getString(formData.reference_flow_quantity)} 
                onChange={(e) => onChange('reference_flow_quantity', e.target.value)}
                placeholder="e.g., 1, 100, 1000"
              />
            </div>
            <div className="space-y-2">
              <Label>Product Mass (kg)</Label>
              <Input 
                type="number"
                value={getString(formData.product_mass_kg)} 
                onChange={(e) => onChange('product_mass_kg', e.target.value)}
                placeholder="Total product mass"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Functional Unit (from Goal &amp; Scope)</Label>
            <Input 
              value={getString(formData.functional_unit)} 
              disabled
              className="bg-slate-100"
              placeholder="Defined in Goal & Scope section"
            />
            <p className="text-xs text-slate-500">
              Reference from Goal &amp; Scope section - this determines the reference flow
            </p>
          </div>

          <div className="space-y-2">
            <Label>Conversion Ratio (Reference Flow to Functional Unit)</Label>
            <Input 
              type="number"
              value={getString(formData.conversion_ratio)} 
              onChange={(e) => onChange('conversion_ratio', e.target.value)}
              placeholder="e.g., 1.0 if reference flow = functional unit"
            />
            <p className="text-xs text-slate-500">
              How many reference flow units are needed to deliver one functional unit
            </p>
          </div>

          <div className="space-y-2">
            <Label>Reference Flow Description</Label>
            <Textarea 
              value={getString(formData.reference_flow_description)} 
              onChange={(e) => onChange('reference_flow_description', e.target.value)}
              placeholder="Detailed description of how the reference flow relates to the functional unit and system boundaries"
              className="h-24"
            />
          </div>

          {referenceFlowQuantity && conversionRatio ? (
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-900">Calculated System Output</p>
                  <p className="text-xs text-emerald-600">
                    Based on reference flow and conversion ratio
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-700">
                    {calculatedOutput}
                  </p>
                  <p className="text-xs text-emerald-600">{getString(formData.reference_flow_unit) || 'units'}</p>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Boundary Alignment</CardTitle>
          <CardDescription>Ensure reference flow aligns with defined system boundaries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Included Life Cycle Stages</Label>
            <Textarea 
              value={getString(formData.included_stages)} 
              onChange={(e) => onChange('included_stages', e.target.value)}
              placeholder="List which life cycle stages are included in the reference flow quantification"
              className="h-20"
            />
          </div>

          <div className="space-y-2">
            <Label>Exclusions &amp; Cut-offs</Label>
            <Textarea 
              value={getString(formData.exclusions_cutoffs)} 
              onChange={(e) => onChange('exclusions_cutoffs', e.target.value)}
              placeholder="Document any processes, materials, or flows excluded from the reference flow"
              className="h-20"
            />
          </div>

          <div className="space-y-2">
            <Label>Allocation Basis</Label>
            <Select 
              value={getString(formData.allocation_basis)} 
              onValueChange={(v) => onChange('allocation_basis', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select allocation method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mass">Physical (Mass)</SelectItem>
                <SelectItem value="energy">Physical (Energy)</SelectItem>
                <SelectItem value="economic">Economic Value</SelectItem>
                <SelectItem value="system_expansion">System Expansion</SelectItem>
                <SelectItem value="not_applicable">Not Applicable</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              Method used when reference flow involves multi-functional processes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
