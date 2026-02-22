'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Battery,
  Factory,
  Leaf,
  Recycle,
  Shield,
  FileCheck,
  Calendar,
  MapPin,
  Thermometer,
  Activity,
  CheckCircle2,
  Trash2,
  Loader2,
} from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
} from '@/components/ui';
import { useToast } from '@/hooks/use-toast';
import { getBatteryPassport } from '@/services/battery-passports/get';
import { updateBatteryPassport } from '@/services/battery-passports/update';
import { deleteBatteryPassport } from '@/services/battery-passports/delete';

import { StatusBadge, CarbonFootprintClass, ComplianceBadge } from '../_components';
import QRCodeDisplay from '@/components/QRCodeDisplay';

export default function PassportDetailsPageContent() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const passportId = id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['battery-passport', passportId],
    queryFn: () => getBatteryPassport(passportId),
    enabled: !!passportId,
  });

  const passport = data?.data?.passport as any;

  const deleteMutation = useMutation({
    mutationFn: () => deleteBatteryPassport(passportId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ 
        queryKey: ['battery-passports'],
        refetchType: 'all',
      });
      toast({
        title: 'Passport deleted',
        description: 'The battery passport has been deleted.',
        variant: 'success',
      });
      router.push('/apps/passports');
    },
    onError: () => {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete passport. Please try again.',
        variant: 'error',
      });
    },
  });

  const activateMutation = useMutation({
    mutationFn: () => updateBatteryPassport(passportId, { status: 'approved' }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['battery-passport', passportId], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: ['battery-passports'], refetchType: 'all' }),
      ]);
      toast({
        title: 'Passport activated',
        description: 'The battery passport has been activated.',
        variant: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'Activation failed',
        description: 'Failed to activate passport. Please try again.',
        variant: 'error',
      });
    },
  });

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value?: string | number | null; icon?: React.ComponentType<{ className?: string }> }) => (
    <div className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-0">
      {Icon && <Icon className="mt-0.5 h-4 w-4 text-slate-400" />}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="truncate text-sm font-medium text-slate-900">{value ?? '-'}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error || !passport) {
    return (
      <div className="p-6 text-center lg:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Passport not found</h2>
        <Link href="/apps/passports">
          <Button className="mt-4">Back to Passports</Button>
        </Link>
      </div>
    );
  }

  // Extract data from nested structure (passport.data.identification)
  const passportData = passport.data || passport;
  const identification = passportData.identification || {};
  
  const batteryModel = identification.battery_model || passportData.passport_id;
  const manufacturer = identification.manufacturer || identification.manufacturer_name;
  const manufacturerId = identification.manufacturer_id;
  const manufacturingFacility = identification.manufacturing_place;
  const manufacturingCountry = identification.manufacturing_country;
  const manufacturingDate = identification.manufacturing_date;
  const batteryCategory = identification.application || identification.battery_category || passportData.category;
  const batteryChemistry = identification.chemistry || identification.battery_chemistry;
  const batteryWeightKg = identification.battery_mass_kg;

  const carbonFootprintTotal = identification.carbon_footprint_total;
  const carbonFootprintClass = identification.carbon_footprint_class;
  const carbonFootprintRaw = identification.carbon_footprint_raw_materials;
  const carbonFootprintMfg = identification.carbon_footprint_manufacturing;
  const carbonFootprintDist = identification.carbon_footprint_distribution;

  const stateOfHealth = passportData.state_of_health || identification.state_of_health;
  const ratedCapacity = identification.rated_capacity_kwh || identification.rated_capacity;
  const nominalVoltage = identification.nominal_voltage;
  const expectedLifetime = identification.expected_lifetime_years;
  const operatingTempMin = identification.temp_range_idle_lower;
  const operatingTempMax = identification.temp_range_idle_upper;

  const cathodeMaterial = identification.cathode_material;
  const anodeMaterial = identification.anode_material;
  const electrolyteMaterial = identification.electrolyte_material;
  const recycledCobalt = (identification.pre_consumer_recycled_cobalt || 0) + (identification.post_consumer_recycled_cobalt || 0);
  const recycledLithium = (identification.pre_consumer_recycled_lithium || 0) + (identification.post_consumer_recycled_lithium || 0);
  const recycledNickel = (identification.pre_consumer_recycled_nickel || 0) + (identification.post_consumer_recycled_nickel || 0);
  const recycledLead = (identification.pre_consumer_recycled_lead || 0) + (identification.post_consumer_recycled_lead || 0);

  const dueDiligenceCompliant = passportData.due_diligence_compliant || identification.due_diligence_compliant;
  const eprProducerId = identification.epr_producer_id;
  const collectionScheme = identification.collection_scheme;
  const capacityThreshold = identification.capacity_threshold_exhaustion;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push('/apps/passports')}
            className="-ml-2 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">
              {batteryModel}
            </h1>
            <StatusBadge status={passport.status} />
          </div>
          <p className="mt-1 font-mono text-sm text-slate-500">{passport.passport_id}</p>
        </div>

        <div className="flex gap-2">
          {passport.status === 'draft' && (
            <Button
              onClick={() => activateMutation.mutate()}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={activateMutation.isPending}
            >
              {activateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Activate
            </Button>
          )}
          <Button
            variant="outline"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => {
              if (confirm('Are you sure you want to delete this passport?')) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* General Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Battery className="h-5 w-5 text-emerald-600" />
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                <InfoRow label="Battery Category" value={batteryCategory} icon={Battery} />
                <InfoRow label="Battery Chemistry" value={batteryChemistry} />
                <InfoRow label="Manufacturer" value={manufacturer} icon={Factory} />
                <InfoRow label="Manufacturer ID" value={manufacturerId} />
                <InfoRow label="Manufacturing Facility" value={manufacturingFacility} icon={MapPin} />
                <InfoRow label="Country" value={manufacturingCountry} />
                <InfoRow
                  label="Manufacturing Date"
                  value={manufacturingDate ? format(new Date(manufacturingDate), 'PP') : undefined}
                  icon={Calendar}
                />
                <InfoRow label="Battery Weight" value={batteryWeightKg ? `${batteryWeightKg} kg` : undefined} />
              </div>
            </CardContent>
          </Card>

          {/* Carbon Footprint */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="h-5 w-5 text-emerald-600" />
                Carbon Footprint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center gap-6">
                <CarbonFootprintClass cfClass={carbonFootprintClass} size="large" />
                <div>
                  <p className="text-3xl font-bold text-slate-900">
                    {carbonFootprintTotal ?? '-'}
                    <span className="ml-2 text-lg font-normal text-slate-500">kg CO₂e/kWh</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Total carbon footprint (ISO 14067 / PEF)</p>
                </div>
              </div>

              {(carbonFootprintRaw || carbonFootprintMfg || carbonFootprintDist) && (
                <div className="grid grid-cols-3 gap-4 rounded-lg bg-slate-50 p-4">
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Raw Materials</p>
                    <p className="text-lg font-semibold text-slate-900">{carbonFootprintRaw ?? '-'}</p>
                  </div>
                  <div className="border-x border-slate-200 text-center">
                    <p className="text-sm text-slate-500">Manufacturing</p>
                    <p className="text-lg font-semibold text-slate-900">{carbonFootprintMfg ?? '-'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Distribution</p>
                    <p className="text-lg font-semibold text-slate-900">{carbonFootprintDist ?? '-'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Materials & Recycled Content */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Recycle className="h-5 w-5 text-emerald-600" />
                Materials & Recycled Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Cathode</p>
                  <p className="font-medium text-slate-900">{cathodeMaterial ?? '-'}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Anode</p>
                  <p className="font-medium text-slate-900">{anodeMaterial ?? '-'}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Electrolyte</p>
                  <p className="font-medium text-slate-900">{electrolyteMaterial ?? '-'}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <p className="mb-3 text-sm font-medium text-slate-700">Recycled Content (ISO 22095)</p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: 'Cobalt', value: recycledCobalt },
                  { label: 'Lithium', value: recycledLithium },
                  { label: 'Nickel', value: recycledNickel },
                  { label: 'Lead', value: recycledLead },
                ].map(item => (
                  <div key={item.label} className="rounded-lg bg-blue-50 p-3 text-center">
                    <p className="text-xs text-blue-600">{item.label}</p>
                    <p className="text-xl font-bold text-blue-800">{item.value ?? 0}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-emerald-600" />
                Performance & Durability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-emerald-50 p-4 text-center">
                  <Activity className="mx-auto mb-2 h-5 w-5 text-emerald-600" />
                  <p className="text-xs text-emerald-600">State of Health</p>
                  <p className="text-2xl font-bold text-emerald-700">{stateOfHealth ?? '-'}%</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <Battery className="mx-auto mb-2 h-5 w-5 text-slate-600" />
                  <p className="text-xs text-slate-500">Rated Capacity</p>
                  <p className="text-2xl font-bold text-slate-900">{ratedCapacity ?? '-'} kWh</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="text-xs text-slate-500">Nominal Voltage</p>
                  <p className="text-2xl font-bold text-slate-900">{nominalVoltage ?? '-'} V</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="text-xs text-slate-500">Expected Life</p>
                  <p className="text-2xl font-bold text-slate-900">{expectedLifetime ?? '-'} years</p>
                </div>
              </div>

              {(operatingTempMin || operatingTempMax) && (
                <div className="mt-4 flex items-center gap-3 rounded-lg bg-amber-50 p-4">
                  <Thermometer className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Operating Temperature Range</p>
                    <p className="text-sm text-amber-700">
                      {operatingTempMin ?? '-'}°C to {operatingTempMax ?? '-'}°C
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* QR Code */}
          <QRCodeDisplay passport={passport} />

          {/* Compliance Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileCheck className="h-5 w-5 text-emerald-600" />
                Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">EU Reg 2023/1542</span>
                <ComplianceBadge status={passport.status === 'approved' ? 'compliant' : 'pending'} size="small" />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Carbon Footprint</span>
                <ComplianceBadge status={carbonFootprintTotal ? 'compliant' : 'pending'} size="small" />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Due Diligence</span>
                <ComplianceBadge status={dueDiligenceCompliant ? 'compliant' : 'warning'} size="small" />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Recycled Content</span>
                <ComplianceBadge status={recycledCobalt ? 'compliant' : 'pending'} size="small" />
              </div>
            </CardContent>
          </Card>

          {/* EPR Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Producer Responsibility</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="EPR Producer ID" value={eprProducerId} />
              <InfoRow label="Collection Scheme" value={collectionScheme} />
              <InfoRow
                label="Exhaustion Threshold"
                value={capacityThreshold ? `${capacityThreshold}% SOCE` : undefined}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
