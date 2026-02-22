import { Battery } from 'lucide-react';

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
import type { BatteryPassportFormChangeHandler, BatteryPassportFormData } from '@/types/battery-passport';

import { getNumericValue, getTextValue, toNumberOrEmpty } from './utils';

const MANUFACTURERS = [
  'ACC (Automotive Cells Company)',
  'AESC (Envision)',
  'BMW Group',
  'BYD',
  'CALB',
  'CATL',
  'Durapower Group',
  'EVE Energy',
  'Farasis Energy',
  'Freyr Battery',
  'Gotion High-Tech',
  'LG Energy Solution',
  'Mercedes-Benz',
  'Northvolt',
  'Panasonic',
  'Samsung SDI',
  'SK On',
  'SVOLT',
  'Tesla',
  'Volkswagen Group',
  'Other',
] as const;

const DURAPOWER_ADDRESSES = {
  'Durapower Group': {
    singapore: '10 Science Park Road, #03-18 The Alpha, Singapore Science Park II, Singapore 117684',
    china: 'No. 888 Huanhu West 2nd Road, Lingang New Area, Shanghai, China 201306',
  },
} as const;

type IdentificationFormProps = {
  formData: BatteryPassportFormData;
  onChange: BatteryPassportFormChangeHandler;
  validationErrors?: string[];
};

export function IdentificationForm({ formData, onChange, validationErrors = [] }: IdentificationFormProps) {
  const hasManufacturerError = validationErrors.includes('identification.manufacturer');
  const hasCategoryError = validationErrors.includes('identification.application');
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Battery className="h-5 w-5 text-emerald-600" />
          Identification &amp; General Information
        </CardTitle>
        <CardDescription>Battery and manufacturer identification per Annex XIII</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Passport ID</Label>
            <Input value={getTextValue(formData.passport_id)} disabled className="bg-slate-50" />
          </div>
          <div className="space-y-2">
            <Label>Battery Identifier</Label>
            <Input
              value={getTextValue(formData.battery_identifier)}
              onChange={event => onChange('battery_identifier', event.target.value)}
              placeholder="Unique battery identifier"
            />
          </div>
          <div className="space-y-2">
            <Label>Serialisation</Label>
            <Input
              value={getTextValue(formData.serialisation)}
              onChange={event => onChange('serialisation', event.target.value)}
              placeholder="Serial number"
            />
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-slate-50">
          <h4 className="mb-3 font-medium text-slate-800">Operator Information</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Operator ID</Label>
              <Input
                value={getTextValue(formData.operator_id)}
                onChange={event => onChange('operator_id', event.target.value)}
                placeholder="Unique operator identifier"
              />
            </div>
            <div className="space-y-2">
              <Label>Operator Name</Label>
              <Input
                value={getTextValue(formData.operator_name)}
                onChange={event => onChange('operator_name', event.target.value)}
                placeholder="Operator company name"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Operator Address</Label>
              <Textarea
                value={getTextValue(formData.operator_address)}
                onChange={event => onChange('operator_address', event.target.value)}
                placeholder="Full address and contact information"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-slate-50">
          <h4 className="mb-3 font-medium text-slate-800">Manufacturer Information</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className={hasManufacturerError ? 'text-red-600' : ''}>Manufacturer Name *</Label>
              <Select
                value={getTextValue(formData.manufacturer_name)}
                onValueChange={value => onChange('manufacturer_name', value)}
              >
                <SelectTrigger className={hasManufacturerError ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  {MANUFACTURERS.map(manufacturer => (
                    <SelectItem key={manufacturer} value={manufacturer}>
                      {manufacturer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Manufacturer ID</Label>
              <Input
                value={getTextValue(formData.manufacturer_id)}
                onChange={event => onChange('manufacturer_id', event.target.value)}
                placeholder="Unique manufacturer identifier"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Manufacturer Address</Label>
              {getTextValue(formData.manufacturer_name) === 'Durapower Group'
                ? (
                  <Select
                    value={getTextValue(formData.manufacturer_address)}
                    onValueChange={value => onChange('manufacturer_address', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DURAPOWER_ADDRESSES['Durapower Group'].singapore}>
                        Singapore - 10 Science Park Road, #03-18 The Alpha
                      </SelectItem>
                      <SelectItem value={DURAPOWER_ADDRESSES['Durapower Group'].china}>
                        China - No. 888 Huanhu West 2nd Road, Lingang, Shanghai
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )
                : (
                  <Textarea
                    value={getTextValue(formData.manufacturer_address)}
                    onChange={event => onChange('manufacturer_address', event.target.value)}
                    placeholder="Full address and contact information"
                    rows={2}
                  />
                )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Manufacturing Place</Label>
            <Input
              value={getTextValue(formData.manufacturing_place)}
              onChange={event => onChange('manufacturing_place', event.target.value)}
              placeholder="Facility name or address"
            />
          </div>
          <div className="space-y-2">
            <Label>Manufacturing Country</Label>
            <Select
              value={getTextValue(formData.manufacturing_country)}
              onValueChange={value => onChange('manufacturing_country', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {[
                  'Austria',
                  'Belgium',
                  'China',
                  'Czech Republic',
                  'France',
                  'Germany',
                  'Hungary',
                  'Italy',
                  'Japan',
                  'Netherlands',
                  'Norway',
                  'Poland',
                  'Singapore',
                  'South Korea',
                  'Spain',
                  'Sweden',
                  'United Kingdom',
                  'USA',
                  'Other',
                ].map(country => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Manufacturing Date</Label>
            <Input
              type="date"
              value={getTextValue(formData.manufacturing_date)}
              onChange={event => onChange('manufacturing_date', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Date Putting Into Service</Label>
            <Input
              type="date"
              value={getTextValue(formData.date_putting_into_service)}
              onChange={event => onChange('date_putting_into_service', event.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label className={hasCategoryError ? 'text-red-600' : ''}>Battery Category *</Label>
            <Select
              value={getTextValue(formData.battery_category)}
              onValueChange={value => onChange('battery_category', value)}
            >
              <SelectTrigger className={hasCategoryError ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EV Battery">EV Battery</SelectItem>
                <SelectItem value="Industrial Battery">Industrial Battery</SelectItem>
                <SelectItem value="LMT Battery">LMT Battery</SelectItem>
                <SelectItem value="Portable Battery">Portable Battery</SelectItem>
                <SelectItem value="SLI Battery">SLI Battery</SelectItem>
                <SelectItem value="Stationary ESS">Stationary ESS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Battery Model</Label>
            <Input
              value={getTextValue(formData.battery_model)}
              onChange={event => onChange('battery_model', event.target.value)}
              placeholder="Model name or number"
            />
          </div>
          <div className="space-y-2">
            <Label>Battery Mass (kg)</Label>
            <Input
              type="number"
              value={getNumericValue(formData.battery_mass_kg)}
              onChange={event => onChange('battery_mass_kg', toNumberOrEmpty(event.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Warranty Period</Label>
            <Input
              value={getTextValue(formData.warranty_period)}
              onChange={event => onChange('warranty_period', event.target.value)}
              placeholder="e.g., 8 years / 160,000 km"
            />
          </div>
          <div className="space-y-2">
            <Label>Battery Status</Label>
            <Select
              value={getTextValue(formData.battery_status)}
              onValueChange={value => onChange('battery_status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="original">Original</SelectItem>
                <SelectItem value="remanufactured">Remanufactured</SelectItem>
                <SelectItem value="repurposed">Repurposed</SelectItem>
                <SelectItem value="reused">Reused</SelectItem>
                <SelectItem value="waste">Waste</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
