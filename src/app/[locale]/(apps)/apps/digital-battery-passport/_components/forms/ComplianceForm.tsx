import { FileCheck, Globe, Shield } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Checkbox,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
} from '@/components/ui';
import type { BatteryPassportFormChangeHandler, BatteryPassportFormData } from '@/types/battery-passport';

import { getBooleanValue, getTextValue } from './utils';

const DUE_DILIGENCE_SCHEMES = [
  { value: 'ASI', label: 'ASI (Aluminium Stewardship Initiative)' },
  { value: 'Bettercoal', label: 'Bettercoal' },
  { value: 'IRMA', label: 'IRMA (Initiative for Responsible Mining Assurance)' },
  { value: 'LBMA Responsible Gold', label: 'LBMA Responsible Gold Guidance' },
  { value: 'RJC CoC', label: 'RJC Chain of Custody' },
  { value: 'RMI Cobalt Refiner', label: 'RMI Cobalt Refiner Supply Chain Due Diligence' },
  { value: 'RMI RMAP', label: 'RMI RMAP (Responsible Minerals Assurance Process)' },
  { value: 'The Copper Mark', label: 'The Copper Mark' },
  { value: 'TSM', label: 'TSM (Towards Sustainable Mining)' },
  { value: 'Other', label: 'Other recognized scheme' },
] as const;

const COLLECTION_SCHEMES = [
  { value: 'Dedicated recycler', label: 'Dedicated recycler partnership' },
  { value: 'Manufacturer take-back', label: 'Manufacturer take-back program' },
  { value: 'Municipal collection', label: 'Municipal collection center' },
  { value: 'PRO collection', label: 'PRO collection network' },
  { value: 'Retailer collection', label: 'Retailer collection point' },
] as const;

const PRODUCER_RESPONSIBILITY_OPTIONS = [
  'Bebat (Belgium)',
  'Corepile (France)',
  'Ecobat (UK)',
  'EPBA member',
  'GRS Batterien (Germany)',
  'National PRO',
  'Stibat (Netherlands)',
  'Other',
] as const;

const TAKE_BACK_PROGRAMS = [
  { value: 'Dealer network', label: 'Dealer network collection' },
  { value: 'Mail-back program', label: 'Mail-back program' },
  { value: 'OEM return program', label: 'OEM return program' },
  { value: 'On-site pickup', label: 'On-site pickup service' },
  { value: 'PRO managed', label: 'PRO managed take-back' },
  { value: 'Service center', label: 'Service center collection' },
] as const;

type ComplianceFormProps = {
  formData: BatteryPassportFormData;
  onChange: BatteryPassportFormChangeHandler;
};

export function ComplianceForm({ formData, onChange }: ComplianceFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-emerald-600" />
            Conformity &amp; Test Reports
          </CardTitle>
          <CardDescription>EU Declaration of Conformity and compliance documentation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>EU Declaration of Conformity URL</Label>
              <Input
                value={getTextValue(formData.eu_declaration_conformity_url)}
                onChange={event => onChange('eu_declaration_conformity_url', event.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Test Reports URL</Label>
              <Input
                value={getTextValue(formData.test_reports_url)}
                onChange={event => onChange('test_reports_url', event.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>CE Marking Date</Label>
              <Input
                type="date"
                value={getTextValue(formData.ce_marking_date)}
                onChange={event => onChange('ce_marking_date', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Notified Body ID</Label>
              <Input
                value={getTextValue(formData.notified_body_id)}
                onChange={event => onChange('notified_body_id', event.target.value)}
                placeholder="Notified body identifier"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-600" />
            Due Diligence &amp; Supply Chain
          </CardTitle>
          <CardDescription>OECD Due Diligence Guidance compliance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="due_diligence_compliant"
              checked={getBooleanValue(formData.due_diligence_compliant)}
              onCheckedChange={checked => onChange('due_diligence_compliant', checked === true)}
            />
            <Label htmlFor="due_diligence_compliant">Due Diligence Compliant</Label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Due Diligence Report URL</Label>
              <Input
                value={getTextValue(formData.due_diligence_report_url)}
                onChange={event => onChange('due_diligence_report_url', event.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Due Diligence Scheme</Label>
              <Select
                value={getTextValue(formData.due_diligence_scheme)}
                onValueChange={value => onChange('due_diligence_scheme', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scheme" />
                </SelectTrigger>
                <SelectContent>
                  {DUE_DILIGENCE_SCHEMES.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Third Party Assurances</Label>
            <Textarea
              value={getTextValue(formData.third_party_assurances)}
              onChange={event => onChange('third_party_assurances', event.target.value)}
              placeholder="Third party assurances of recognised schemes"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Supply Chain Indices</Label>
            <Textarea
              value={getTextValue(formData.supply_chain_indices)}
              onChange={event => onChange('supply_chain_indices', event.target.value)}
              placeholder="Supply chain indices and traceability information"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            Extended Producer Responsibility
          </CardTitle>
          <CardDescription>EPR obligations per Article 60-61</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>EPR Producer ID</Label>
              <Input
                value={getTextValue(formData.epr_producer_id)}
                onChange={event => onChange('epr_producer_id', event.target.value)}
                placeholder="Extended Producer Responsibility ID"
              />
            </div>
            <div className="space-y-2">
              <Label>Collection Scheme</Label>
              <Select
                value={getTextValue(formData.collection_scheme)}
                onValueChange={value => onChange('collection_scheme', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scheme" />
                </SelectTrigger>
                <SelectContent>
                  {COLLECTION_SCHEMES.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Producer Responsibility Org</Label>
              <Select
                value={getTextValue(formData.producer_responsibility_org)}
                onValueChange={value => onChange('producer_responsibility_org', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select PRO" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCER_RESPONSIBILITY_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Free Take-Back Scheme</Label>
              <Select
                value={getTextValue(formData.free_take_back_scheme)}
                onValueChange={value => onChange('free_take_back_scheme', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {TAKE_BACK_PROGRAMS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
