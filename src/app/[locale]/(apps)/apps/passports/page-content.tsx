'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Plus,
  Search,
  Battery,
  Grid,
  List,
} from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '@/components/ui';
import { listBatteryPassports } from '@/services/battery-passports/list';
import { PassportCard, StatusBadge, CarbonFootprintClass } from './_components';

type PassportData = {
  id?: string;
  passport_id?: string;
  passportId?: string;
  status?: string;
  category?: string;
  created_at?: string;
  createdAt?: string;
  // Flat fields from normalized list service
  battery_model?: string;
  manufacturer_name?: string;
  battery_category?: string;
  carbon_footprint_class?: string;
  carbon_footprint_total?: number;
  identification?: Record<string, unknown>;
  data?: {
    identification?: {
      battery_model?: string;
      manufacturer?: string;
      manufacturer_name?: string;
      application?: string;
      battery_category?: string;
      carbon_footprint_class?: string;
    };
  };
};

export default function PassportsPageContent() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data, isLoading, error } = useQuery({
    queryKey: ['battery-passports', statusFilter, categoryFilter],
    queryFn: () => listBatteryPassports({
      status: statusFilter !== 'all' ? statusFilter as any : undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      limit: 100,
    }),
  });

  const passports: PassportData[] = useMemo(() => {
    return (data?.data?.passports ?? []) as PassportData[];
  }, [data]);

  const filteredPassports = useMemo(() => {
    return passports.filter((p) => {
      const batteryModel = p.battery_model || p.data?.identification?.battery_model || '';
      const manufacturer = p.manufacturer_name || p.data?.identification?.manufacturer || p.data?.identification?.manufacturer_name || '';
      const passportId = p.passport_id || p.passportId || '';

      const matchesSearch = !search
        || passportId.toLowerCase().includes(search.toLowerCase())
        || batteryModel.toLowerCase().includes(search.toLowerCase())
        || manufacturer.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [passports, search]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700">Failed to load passports. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">Battery Passports</h1>
          <p className="mt-1 text-slate-500">{passports.length} total passports</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-2"
        >
          <Link href="/apps/digital-battery-passport">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full rounded-full px-8 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 sm:w-auto sm:px-10 sm:py-4 sm:text-base lg:px-12 lg:text-lg bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:shadow-2xl hover:shadow-emerald-500/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Plus size={18} className="sm:h-[22px] sm:w-[22px]" />
                New Passport
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search passports..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="EV Battery">EV Battery</SelectItem>
                  <SelectItem value="Industrial Battery">Industrial Battery</SelectItem>
                  <SelectItem value="LMT Battery">LMT Battery</SelectItem>
                  <SelectItem value="Stationary ESS">Stationary ESS</SelectItem>
                  <SelectItem value="Portable Battery">Portable Battery</SelectItem>
                  <SelectItem value="SLI Battery">SLI Battery</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex overflow-hidden rounded-lg border border-slate-200">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-emerald-600' : ''}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-emerald-600' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredPassports.length > 0 ? (
        viewMode === 'grid' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredPassports.map(passport => (
              <PassportCard key={passport.passport_id || passport.passportId || passport.id} passport={passport} />
            ))}
          </motion.div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {filteredPassports.map((passport) => {
                  const batteryModel = passport.battery_model || passport.data?.identification?.battery_model || passport.passport_id || passport.passportId;
                  const manufacturer = passport.manufacturer_name || passport.data?.identification?.manufacturer || passport.data?.identification?.manufacturer_name;
                  const category = passport.battery_category || passport.data?.identification?.application || passport.data?.identification?.battery_category || passport.category;
                  const carbonClass = passport.carbon_footprint_class || passport.data?.identification?.carbon_footprint_class;

                  return (
                    <Link
                      key={passport.passport_id || passport.passportId || passport.id}
                      href={`/apps/passports/${passport.passport_id || passport.passportId || passport.id}`}
                      className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50"
                    >
                      <CarbonFootprintClass cfClass={carbonClass} size="small" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900">
                          {batteryModel}
                        </p>
                        <p className="text-sm text-slate-500">{manufacturer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">{category}</p>
                        <p className="text-xs text-slate-400">
                          {(passport.created_at || passport.createdAt) && format(new Date(passport.created_at || passport.createdAt || ''), 'PP')}
                        </p>
                      </div>
                      <StatusBadge status={passport.status} />
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <Card className="border-2 border-dashed border-slate-200">
          <CardContent className="py-12 text-center">
            <Battery className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <h3 className="mb-2 text-lg font-medium text-slate-700">
              {search || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'No matching passports'
                : 'No passports yet'}
            </h3>
            <p className="mb-4 text-slate-500">
              {search || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first digital battery passport'}
            </p>
            {!search && statusFilter === 'all' && categoryFilter === 'all' && (
              <Link href="/apps/digital-battery-passport">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative rounded-full px-8 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 sm:px-10 sm:py-4 sm:text-base lg:px-12 lg:text-lg bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:shadow-2xl hover:shadow-emerald-500/50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Plus size={18} className="sm:h-[22px] sm:w-[22px]" />
                    Create Passport
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
