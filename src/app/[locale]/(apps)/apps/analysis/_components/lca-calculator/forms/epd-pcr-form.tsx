'use client';

import { Plus, Trash2 } from 'lucide-react';

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
  Textarea,
} from '@/components/ui';
import type { LcaCalculatorChangeHandler, LcaCalculatorFormData, LcaEpdReference, LcaPcrReference } from '@/types/lca-calculator';

import { getString } from '../utils';

type EpdPcrFormProps = {
  formData: LcaCalculatorFormData;
  onChange: LcaCalculatorChangeHandler;
};

const PROGRAM_OPERATORS = [
  'IBU',
  'EPD International',
  'UL Environment',
  'ASTM',
  'NSF',
  'BRE',
  'Other',
];

export function EpdPcrForm({ formData, onChange }: EpdPcrFormProps) {
  const epdReferences = (formData.epd_references ?? []) as LcaEpdReference[];
  const pcrReferences = (formData.pcr_references ?? []) as LcaPcrReference[];

  const addEpd = () => {
    onChange('epd_references', [
      ...epdReferences,
      {
        registration_number: '',
        program_operator: '',
        declaration_holder: '',
        issue_date: '',
        valid_until: '',
        version: '',
        url: '',
        reference_product: '',
        functional_unit: '',
      },
    ]);
  };

  const updateEpd = (index: number, payload: Partial<LcaEpdReference>) => {
    const next = [...epdReferences];
    next[index] = { ...next[index], ...payload };
    onChange('epd_references', next);
  };

  const removeEpd = (index: number) => {
    onChange('epd_references', epdReferences.filter((_, i) => i !== index));
  };

  const addPcr = () => {
    onChange('pcr_references', [
      ...pcrReferences,
      {
        name: '',
        reference_number: '',
        version: '',
        publication_date: '',
        valid_until: '',
        un_cpc_code: '',
        url: '',
        product_category: '',
        specific_requirements: '',
      },
    ]);
  };

  const updatePcr = (index: number, payload: Partial<LcaPcrReference>) => {
    const next = [...pcrReferences];
    next[index] = { ...next[index], ...payload };
    onChange('pcr_references', next);
  };

  const removePcr = (index: number) => {
    onChange('pcr_references', pcrReferences.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Environmental Product Declarations (EPD)</CardTitle>
          <CardDescription>ISO 14025 / EN 15804 program details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {epdReferences.map((epd, index) => (
            <div key={`epd-${index}`} className="p-4 bg-slate-50 rounded-lg border space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-700">EPD Reference {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => removeEpd(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>EPD Registration Number</Label>
                  <Input
                    value={getString(epd.registration_number)}
                    onChange={event => updateEpd(index, { registration_number: event.target.value })}
                    placeholder="S-P-12345"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Program Operator</Label>
                  <Select
                    value={getString(epd.program_operator)}
                    onValueChange={value => updateEpd(index, { program_operator: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROGRAM_OPERATORS.map(operator => (
                        <SelectItem key={operator} value={operator}>
                          {operator}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Declaration Holder</Label>
                  <Input
                    value={getString(epd.declaration_holder)}
                    onChange={event => updateEpd(index, { declaration_holder: event.target.value })}
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Input
                    type="date"
                    value={getString(epd.issue_date)}
                    onChange={event => updateEpd(index, { issue_date: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <Input
                    type="date"
                    value={getString(epd.valid_until)}
                    onChange={event => updateEpd(index, { valid_until: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Version</Label>
                  <Input
                    value={getString(epd.version)}
                    onChange={event => updateEpd(index, { version: event.target.value })}
                    placeholder="1.0"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>EPD URL / Reference</Label>
                  <Input
                    type="url"
                    value={getString(epd.url)}
                    onChange={event => updateEpd(index, { url: event.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Reference Product / Service</Label>
                  <Textarea
                    value={getString(epd.reference_product)}
                    onChange={event => updateEpd(index, { reference_product: event.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Functional / Declared Unit</Label>
                  <Input
                    value={getString(epd.functional_unit)}
                    onChange={event => updateEpd(index, { functional_unit: event.target.value })}
                    placeholder="e.g., 1 kWh of storage"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addEpd} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add EPD Reference
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Category Rules (PCR)</CardTitle>
          <CardDescription>Product-specific LCA methodology references</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pcrReferences.map((pcr, index) => (
            <div key={`pcr-${index}`} className="p-4 bg-slate-50 rounded-lg border space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-700">PCR Reference {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => removePcr(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>PCR Name</Label>
                  <Input
                    value={getString(pcr.name)}
                    onChange={event => updatePcr(index, { name: event.target.value })}
                    placeholder="UN CPC 43: Batteries and accumulators"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reference Number</Label>
                  <Input
                    value={getString(pcr.reference_number)}
                    onChange={event => updatePcr(index, { reference_number: event.target.value })}
                    placeholder="2023:XX"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Version / Edition</Label>
                  <Input
                    value={getString(pcr.version)}
                    onChange={event => updatePcr(index, { version: event.target.value })}
                    placeholder="Version 3.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Publication Date</Label>
                  <Input
                    type="date"
                    value={getString(pcr.publication_date)}
                    onChange={event => updatePcr(index, { publication_date: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <Input
                    type="date"
                    value={getString(pcr.valid_until)}
                    onChange={event => updatePcr(index, { valid_until: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>UN CPC Code</Label>
                  <Input
                    value={getString(pcr.un_cpc_code)}
                    onChange={event => updatePcr(index, { un_cpc_code: event.target.value })}
                    placeholder="43"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>PCR URL / Reference Link</Label>
                  <Input
                    type="url"
                    value={getString(pcr.url)}
                    onChange={event => updatePcr(index, { url: event.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Product Category Description</Label>
                  <Textarea
                    value={getString(pcr.product_category)}
                    onChange={event => updatePcr(index, { product_category: event.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Specific PCR Requirements</Label>
                  <Textarea
                    value={getString(pcr.specific_requirements)}
                    onChange={event => updatePcr(index, { specific_requirements: event.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addPcr} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add PCR Reference
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verification &amp; Compliance</CardTitle>
          <CardDescription>ISO 14040/14044/14067 declarations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Third-Party Verification</Label>
              <Select
                value={getString(formData.verification_status)}
                onValueChange={value => onChange('verification_status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending verification</SelectItem>
                  <SelectItem value="not_required">Not required</SelectItem>
                  <SelectItem value="self_declared">Self-declared</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Verifier Name</Label>
              <Input
                value={getString(formData.verifier_name)}
                onChange={event => onChange('verifier_name', event.target.value)}
                placeholder="Verification body or individual"
              />
            </div>
            <div className="space-y-2">
              <Label>Verification Date</Label>
              <Input
                type="date"
                value={getString(formData.verification_date)}
                onChange={event => onChange('verification_date', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Certificate Number</Label>
              <Input
                value={getString(formData.verification_certificate)}
                onChange={event => onChange('verification_certificate', event.target.value)}
                placeholder="Certificate number"
              />
            </div>
          </div>

          <Textarea
            value={getString(formData.iso_compliance_statement)}
            onChange={event => onChange('iso_compliance_statement', event.target.value)}
            placeholder="Statement of compliance with ISO standards"
            rows={3}
          />

          <Textarea
            value={getString(formData.data_quality_statement)}
            onChange={event => onChange('data_quality_statement', event.target.value)}
            placeholder="Describe data quality, coverage, and sources"
            rows={3}
          />

          <Textarea
            value={getString(formData.comparability_statement)}
            onChange={event => onChange('comparability_statement', event.target.value)}
            placeholder="Statement on comparability with other EPDs"
            rows={3}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Environmental Information</CardTitle>
          <CardDescription>Resource use, indicators, and scenarios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={getString(formData.resource_circular_economy)}
            onChange={event => onChange('resource_circular_economy', event.target.value)}
            placeholder="Resource use & circular economy information"
            rows={3}
          />
          <Textarea
            value={getString(formData.other_environmental_indicators)}
            onChange={event => onChange('other_environmental_indicators', event.target.value)}
            placeholder="Additional environmental indicators"
            rows={3}
          />
          <Textarea
            value={getString(formData.scenario_information)}
            onChange={event => onChange('scenario_information', event.target.value)}
            placeholder="Scenario information (transport, use phase, EoL)"
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
}
