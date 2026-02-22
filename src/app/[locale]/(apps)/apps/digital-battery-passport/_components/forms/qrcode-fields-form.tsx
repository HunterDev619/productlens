'use client';

import { useEffect, useState } from 'react';
import { Info, QrCode, AlertCircle } from 'lucide-react';

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
} from '@/components/ui';
import type { BatteryPassportFormChangeHandler, BatteryPassportFormData } from '@/types/battery-passport';

type QRCodeFieldsFormProps = {
  formData: BatteryPassportFormData;
  onChange: BatteryPassportFormChangeHandler;
  validationErrors?: string[];
};

export function QRCodeFieldsForm({ formData, onChange, validationErrors = [] }: QRCodeFieldsFormProps) {
  const [touched, setTouched] = useState({ gtin: false, serial_number: false });
  const hasGtinValidationError = validationErrors.includes('qrCodeGs1.gtin');
  const hasSerialValidationError = validationErrors.includes('qrCodeGs1.serial_number');

  // Auto-generate GTIN from manufacturer ID if not set
  useEffect(() => {
    if (formData.manufacturer_id && !formData.gtin) {
      const digits = String(formData.manufacturer_id).replace(/[^0-9]/g, '');
      if (digits.length > 0) {
        const gtin = digits.padStart(14, '0').slice(0, 14);
        onChange('gtin', gtin);
      }
    }
  }, [formData.manufacturer_id, formData.gtin, onChange]);

  const gs1LinkDomain = formData.gs1_link_domain || 'id.gs1.org';
  const showPreview = formData.gtin && formData.serial_number;

  // Validation checks
  const gtinError = (touched.gtin && !formData.gtin) || hasGtinValidationError;
  const serialError = (touched.serial_number && !formData.serial_number) || hasSerialValidationError;
  const hasErrors = !formData.gtin || !formData.serial_number || hasGtinValidationError || hasSerialValidationError;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-emerald-600" />
          GS1 Digital Link &amp; QR Code
        </CardTitle>
        <CardDescription>
          ISO/IEC 18004-compliant QR Code with GS1 Application Identifiers (Annex VI-C)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
          <p className="text-sm text-blue-900">
            GS1 Digital Link creates machine-readable identifiers for battery traceability per EU Regulation 2023/1542 Annex VI-C.
            These fields auto-populate from your identification data but can be customized.
          </p>
        </div>

        {hasErrors && (touched.gtin || touched.serial_number) && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-900">Required Fields Missing</p>
              <p className="text-sm text-red-700">
                Please enter both GTIN (AI 01) and Serial Number (AI 21) to generate a valid GS1 Digital Link.
              </p>
            </div>
          </div>
        )}

        {/* Primary Identifiers */}
        <section className="rounded-lg border bg-slate-50 p-4">
          <h4 className="mb-3 font-medium text-slate-800">Primary Identifiers (Required)</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className={gtinError ? 'text-red-600' : ''}>GTIN (AI 01) *</Label>
              <Input 
                value={(formData.gtin as string) || ''} 
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 14);
                  onChange('gtin', value);
                }}
                onBlur={() => setTouched(prev => ({ ...prev, gtin: true }))}
                placeholder="00000000000000"
                maxLength={14}
                className={gtinError ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {gtinError && (
                <p className="text-xs text-red-600 font-medium">
                  ⚠ GTIN is required for GS1 Digital Link
                </p>
              )}
              <p className="text-xs text-slate-500">
                Global Trade Item Number - 14 digits (auto-generated from Manufacturer ID)
              </p>
            </div>
            <div className="space-y-2">
              <Label className={serialError ? 'text-red-600' : ''}>Serial Number (AI 21) *</Label>
              <Input 
                value={(formData.serial_number as string) || ''} 
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9\-_]/g, '').slice(0, 20);
                  onChange('serial_number', value);
                }}
                onBlur={() => setTouched(prev => ({ ...prev, serial_number: true }))}
                placeholder="BP-12345ABC"
                maxLength={20}
                className={serialError ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {serialError && (
                <p className="text-xs text-red-600 font-medium">
                  ⚠ Serial Number is required for GS1 Digital Link
                </p>
              )}
              <p className="text-xs text-slate-500">
                Unique serial number for this battery passport
              </p>
            </div>
          </div>
        </section>

        {/* Secondary Identifiers */}
        <section className="rounded-lg border bg-slate-50 p-4">
          <h4 className="mb-3 font-medium text-slate-800">Secondary Identifiers (Optional)</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Batch/Lot Number (AI 10)</Label>
              <Input 
                value={(formData.batch_lot_number as string) || ''} 
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9\-_]/g, '').slice(0, 20);
                  onChange('batch_lot_number', value);
                }}
                placeholder="LOT-2024-001"
                maxLength={20}
              />
              <p className="text-xs text-slate-500">
                Production batch or lot identifier
              </p>
            </div>
            <div className="space-y-2">
              <Label>Expiry Date (AI 17)</Label>
              <Input 
                type="date"
                value={(formData.expiry_date as string) || ''} 
                onChange={(e) => onChange('expiry_date', e.target.value)}
              />
              <p className="text-xs text-slate-500">
                Battery warranty expiration or end-of-life date
              </p>
            </div>
          </div>
        </section>

        {/* GS1 Digital Link Components */}
        <section className="rounded-lg border bg-slate-50 p-4">
          <h4 className="mb-3 font-medium text-slate-800">GS1 Digital Link Configuration</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>GS1 Company Prefix</Label>
              <Input 
                value={(formData.gs1_company_prefix as string) || ''} 
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                  onChange('gs1_company_prefix', value);
                }}
                placeholder="1234567890"
                maxLength={12}
              />
              <p className="text-xs text-slate-500">
                Your GS1-assigned company prefix (7-12 digits)
              </p>
            </div>
            <div className="space-y-2">
              <Label>Link Domain</Label>
              <Input 
                value={(formData.gs1_link_domain as string) || 'id.gs1.org'} 
                onChange={(e) => onChange('gs1_link_domain', e.target.value)}
                placeholder="id.gs1.org"
              />
              <p className="text-xs text-slate-500">
                GS1 Digital Link resolver domain (default: id.gs1.org)
              </p>
            </div>
          </div>
        </section>

        {/* QR Code Settings */}
        <section className="rounded-lg border bg-slate-50 p-4">
          <h4 className="mb-3 font-medium text-slate-800">QR Code Settings</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Error Correction Level</Label>
              <Select
                value={(formData.qr_error_correction as string) || 'M'}
                onValueChange={(value) => onChange('qr_error_correction', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%) - Recommended</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Higher levels allow more damage tolerance
              </p>
            </div>
            <div className="space-y-2">
              <Label>QR Code Size (pixels)</Label>
              <Input 
                type="number"
                value={(formData.qr_size as number) || 256} 
                onChange={(e) => onChange('qr_size', Number.parseInt(e.target.value, 10) || 256)}
                min={128}
                max={1024}
                step={32}
              />
              <p className="text-xs text-slate-500">
                Recommended: 256px for printing
              </p>
            </div>
            <div className="space-y-2">
              <Label>Include Logo</Label>
              <Select
                value={String(formData.qr_include_logo || 'false')}
                onValueChange={(value) => onChange('qr_include_logo', value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">No</SelectItem>
                  <SelectItem value="true">Yes (requires H correction)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Logo in center (requires High error correction)
              </p>
            </div>
          </div>
        </section>

        {/* Access Layer Configuration */}
        <section className="rounded-lg border bg-slate-50 p-4">
          <h4 className="mb-3 font-medium text-slate-800">Access Layer Configuration</h4>
          <p className="mb-4 text-xs text-slate-600">
            Configure which information layers are accessible when scanning the QR code
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded border bg-white p-3">
              <div>
                <p className="text-sm font-medium text-slate-900">Public Access Layer</p>
                <p className="text-xs text-slate-500">Basic sustainability info for general consumers</p>
              </div>
              <input
                type="checkbox"
                checked={formData.access_layer_public_enabled !== false}
                onChange={(e) => onChange('access_layer_public_enabled', e.target.checked)}
                className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center justify-between rounded border bg-white p-3">
              <div>
                <p className="text-sm font-medium text-slate-900">Authority Access Layer</p>
                <p className="text-xs text-slate-500">Compliance data for market surveillance authorities</p>
              </div>
              <input
                type="checkbox"
                checked={formData.access_layer_authority_enabled !== false}
                onChange={(e) => onChange('access_layer_authority_enabled', e.target.checked)}
                className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between rounded border bg-white p-3">
              <div>
                <p className="text-sm font-medium text-slate-900">Legitimate Interest Layer</p>
                <p className="text-xs text-slate-500">Lifecycle data for recyclers, repairers, manufacturers</p>
              </div>
              <input
                type="checkbox"
                checked={formData.access_layer_legitimate_enabled !== false}
                onChange={(e) => onChange('access_layer_legitimate_enabled', e.target.checked)}
                className="h-5 w-5 rounded text-purple-600 focus:ring-purple-500"
              />
            </div>
          </div>
        </section>

        {/* Preview GS1 Digital Link */}
        {showPreview && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <h4 className="mb-2 font-medium text-emerald-900">Generated GS1 Digital Link</h4>
            <code className="block break-all rounded border bg-white p-2 text-xs font-mono text-emerald-800">
              {`https://${gs1LinkDomain}/01/${formData.gtin}/21/${formData.serial_number}${formData.batch_lot_number ? `/10/${formData.batch_lot_number}` : ''}${formData.expiry_date ? `/17/${(formData.expiry_date as string).replace(/-/g, '')}` : ''}`}
            </code>
            <p className="mt-2 text-xs text-emerald-700">
              ✓ ISO/IEC 18004:2015 compliant | GS1 Digital Link Syntax 1.2
            </p>
            <p className="mt-2 text-xs text-slate-600">
              → Scanning this QR code will direct users to tiered access layers based on their role
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
