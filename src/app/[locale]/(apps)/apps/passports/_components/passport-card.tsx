'use client';

import Link from 'next/link';
import { Battery, Factory, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { format } from 'date-fns';
import { StatusBadge } from './status-badge';
import { CarbonFootprintClass } from './carbon-footprint-class';

type PassportData = {
  id?: string;
  passport_id?: string;
  passportId?: string;
  status?: string;
  category?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  // Flat fields from normalized list service
  battery_model?: string;
  manufacturer_name?: string;
  battery_category?: string;
  carbon_footprint_class?: string;
  carbon_footprint_total?: number;
  // Nested structure for direct API usage
  identification?: Record<string, unknown>;
  data?: {
    identification?: {
      battery_model?: string;
      manufacturer?: string;
      manufacturer_name?: string;
      chemistry?: string;
      battery_chemistry?: string;
      application?: string;
      battery_category?: string;
      carbon_footprint_total?: number;
      carbon_footprint_class?: string;
      manufacturing_date?: string;
    };
  };
};

type PassportCardProps = {
  passport: PassportData;
};

export function PassportCard({ passport }: PassportCardProps) {
  // Support both normalized flat fields AND nested data structure
  const nestedIdentification = passport.data?.identification || {};
  const flatIdentification = passport.identification || {};
  
  const batteryModel = passport.battery_model 
    || nestedIdentification.battery_model 
    || (flatIdentification.battery_model as string | undefined)
    || passport.passport_id 
    || passport.passportId;
    
  const manufacturer = passport.manufacturer_name
    || nestedIdentification.manufacturer 
    || nestedIdentification.manufacturer_name
    || (flatIdentification.manufacturer as string | undefined)
    || (flatIdentification.manufacturer_name as string | undefined);
    
  const category = passport.battery_category
    || nestedIdentification.application 
    || nestedIdentification.battery_category 
    || (flatIdentification.application as string | undefined)
    || (flatIdentification.battery_category as string | undefined)
    || passport.category;
    
  const carbonClass = passport.carbon_footprint_class
    || nestedIdentification.carbon_footprint_class
    || (flatIdentification.carbon_footprint_class as string | undefined);
    
  const carbonTotal = passport.carbon_footprint_total
    ?? nestedIdentification.carbon_footprint_total
    ?? (flatIdentification.carbon_footprint_total as number | undefined);
    
  const createdDate = passport.created_at || passport.createdAt || passport.updated_at || passport.updatedAt;

  return (
    <Link href={`/apps/passports/${passport.passport_id || passport.id}`}>
      <Card className="group cursor-pointer border-slate-200 transition-all hover:border-emerald-300 hover:shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <CarbonFootprintClass cfClass={carbonClass} size="medium" />
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="truncate font-semibold text-slate-900 group-hover:text-emerald-700">
                  {batteryModel}
                </h3>
                <StatusBadge status={passport.status} />
              </div>
              
              {manufacturer && (
                <div className="mb-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <Factory className="h-3.5 w-3.5" />
                  <span className="truncate">{manufacturer}</span>
                </div>
              )}
              
              {category && (
                <div className="mb-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <Battery className="h-3.5 w-3.5" />
                  <span>{category}</span>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                {carbonTotal !== undefined && (
                  <div className="text-sm">
                    <span className="font-semibold text-emerald-600">{carbonTotal}</span>
                    <span className="ml-1 text-slate-400">kg CO₂e/kWh</span>
                  </div>
                )}
                {createdDate && (
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(createdDate), 'PP')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
