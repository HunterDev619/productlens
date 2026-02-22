'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Inter } from 'next/font/google';
import {
  Plus,
  Search,
  FlaskConical,
  Grid,
  List,
  BarChart3,
  Calendar,
  Building2,
} from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  Input,
  Skeleton,
} from '@/components/ui';
import { listLcaAssessments, type LcaAssessment } from '@/services/lca-assessments';
import { LcaCalculator } from '../analysis/_components/lca-calculator';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

function AssessmentCard({ assessment }: { assessment: LcaAssessment }) {
  const data = assessment.data || {};
  const goalAndScope = data.goalAndScope || {};
  const productName = goalAndScope.productName || assessment.assessmentId;
  const companyName = goalAndScope.companyOrganisation || 'N/A';
  const impactMethod = goalAndScope.impactAssessmentMethod || 'Not specified';

  return (
    <Link href={`/apps/manual-analysis/${assessment.assessmentId}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <Card className="h-full cursor-pointer border-slate-200 transition-all hover:border-emerald-300 hover:shadow-md">
          <CardContent className="p-5">
            <div className="mb-3 flex items-start justify-between">
              <div className="rounded-lg bg-emerald-100 p-2">
                <FlaskConical className="h-5 w-5 text-emerald-600" />
              </div>
            </div>

            <h3 className="mb-2 line-clamp-2 font-semibold text-slate-900">
              {productName}
            </h3>

            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-500" />
                <span className="truncate">{companyName}</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-slate-500" />
                <span className="truncate">{impactMethod}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span>{format(new Date(assessment.createdAt), 'PP')}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-600">ID: {assessment.assessmentId}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

export default function ManualAnalysisPageContent() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['lca-assessments'],
    queryFn: () => listLcaAssessments({
      limit: 100,
    }),
  });

  const assessments: LcaAssessment[] = useMemo(() => {
    return data?.assessments ?? [];
  }, [data]);

  const filteredAssessments = useMemo(() => {
    return assessments.filter((a) => {
      const goalAndScope = a.data?.goalAndScope || {};
      const productName = goalAndScope.productName || '';
      const companyName = goalAndScope.companyOrganisation || '';

      const matchesSearch = !search
        || a.assessmentId?.toLowerCase().includes(search.toLowerCase())
        || productName.toLowerCase().includes(search.toLowerCase())
        || companyName.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [assessments, search]);

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
        <p className="text-red-700">Failed to load assessments. Please try again.</p>
      </div>
    );
  }

  return (
    <div className={`${inter.className} min-h-screen bg-[#f8fafc]`}>
      <div className="min-h-screen px-3 py-6 sm:px-4 sm:py-8 lg:py-12">
        <div className="mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header Section */}
          <div className="space-y-2 text-center sm:space-y-3 lg:space-y-4">
            <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl lg:text-4xl">
              Manual LCA Analysis
            </h1>
          </div>

          {showForm ? (
            <LcaCalculator onExit={() => setShowForm(false)} />
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">My Assessments</h2>
                  <p className="mt-1 text-sm text-slate-600 sm:text-base">{assessments.length} total assessments</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => setShowForm(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full rounded-full px-8 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 sm:w-auto sm:px-10 sm:py-4 sm:text-base lg:px-12 lg:text-lg bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:shadow-2xl hover:shadow-emerald-500/50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Plus size={18} className="sm:h-[22px] sm:w-[22px]" />
                      New Assessment
                    </span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 transition-opacity group-hover:opacity-100" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Filters */}
              <Card className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 lg:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="Search assessments..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
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
              {filteredAssessments.length > 0 ? (
                viewMode === 'grid' ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                  >
                    {filteredAssessments.map(assessment => (
                      <AssessmentCard key={assessment.id} assessment={assessment} />
                    ))}
                  </motion.div>
                ) : (
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y divide-slate-100">
                        {filteredAssessments.map((assessment) => {
                          const goalAndScope = assessment.data?.goalAndScope || {};
                          const productName = goalAndScope.productName || assessment.assessmentId;
                          const companyName = goalAndScope.companyOrganisation || 'N/A';
                          const impactMethod = goalAndScope.impactAssessmentMethod || 'Not specified';

                          return (
                            <Link
                              key={assessment.id}
                              href={`/apps/manual-analysis/${assessment.assessmentId}`}
                              className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50"
                            >
                              <div className="rounded-lg bg-emerald-100 p-2">
                                <FlaskConical className="h-5 w-5 text-emerald-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-slate-900">
                                  {productName}
                                </p>
                                <p className="text-sm text-slate-600">{companyName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-slate-700 truncate max-w-[200px]">{impactMethod}</p>
                                <p className="text-xs text-slate-500">
                                  {format(new Date(assessment.createdAt), 'PP')}
                                </p>
                              </div>
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
                    <FlaskConical className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                    <h3 className="mb-2 text-lg font-medium text-slate-800">
                      {search
                        ? 'No matching assessments'
                        : 'No assessments yet'}
                    </h3>
                    <p className="mb-4 text-slate-600">
                      {search
                        ? 'Try adjusting your filters'
                        : 'Create your first LCA assessment'}
                    </p>
                    {!search && (
                      <motion.button
                        type="button"
                        onClick={() => setShowForm(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative rounded-full px-8 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 sm:px-10 sm:py-4 sm:text-base lg:px-12 lg:text-lg bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:shadow-2xl hover:shadow-emerald-500/50"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Plus size={18} className="sm:h-[22px] sm:w-[22px]" />
                          Create Assessment
                        </span>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 transition-opacity group-hover:opacity-100" />
                      </motion.button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
