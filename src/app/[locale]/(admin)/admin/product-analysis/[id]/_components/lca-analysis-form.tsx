'use client';

import type { UpdateLcaAnalysisDTO } from '@/schemas/admin/lca-analysis';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  CircleNotch,
  PencilSimple,
  Plus,
  Trash,
  Warning,
  X,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Input, Label, Textarea } from '@/components/ui';
import { toast } from '@/hooks/use-toast';
import { UpdateLcaAnalysisSchema } from '@/schemas/admin/lca-analysis';
import { useAdminGetLcaAnalysisDetail } from '@/services/admin/lca-analysis/detail';
import { useAdminUpdateLcaAnalysisMutation } from '@/services/admin/lca-analysis/update';
import { cn } from '@/utils';

type LCAAnalysisPropsForm = {
  lcaAnalysis_id: string;
};

type OtherAnalysisData = {
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
  timeline_analysis?: {
    milestones?: Array<{
      day: number;
      event: string;
      significance: string;
    }>;
    emission_velocity?: {
      peak_emission_phase: string;
      cumulative_emissions: number;
      daily_average_emissions: number;
    };
    lifecycle_progression?: Array<{
      stage: string;
      emissions: number;
      duration_days: number;
      key_activities: string[];
    }>;
    total_lifecycle_carbon?: number;
  };
  geographic_analysis?: {
    emission_hotspots?: Array<{
      location: string;
      primary_cause: string;
      emission_intensity: number;
      mitigation_potential: string;
    }>;
    supply_chain_mapping?: {
      raw_materials?: Array<{
        material: string;
        source_countries: string[];
        emissions_by_country?: Record<
          string,
          { co2e: number; intensity: string }
        >;
      }>;
      manufacturing_hubs?: Array<{
        location: string;
        emissions: number;
        processes: string[];
        coordinates: [number, number];
        grid_carbon_intensity?: number;
      }>;
      distribution_routes?: Array<{
        to: string;
        from: string;
        emissions: number;
        distance_km: number;
        transport_mode: string;
        route_coordinates: [number, number][];
      }>;
    };
    regional_impact_intensity?: {
      low_impact_regions?: string[];
      high_impact_regions?: string[];
      medium_impact_regions?: string[];
    };
  };
  supply_chain_mapping?: {
    tier_breakdown?: {
      tier_1_suppliers: number;
      tier_2_suppliers: number;
      tier_3_suppliers: number;
      geographical_spread: string;
    };
    traceability_score?: {
      overall_score: number;
      material_traceability: number;
      supplier_transparency: number;
      certification_coverage: number;
    };
    transportation_network?: Array<{
      mode: string;
      route: string;
      distance_km: number;
      emissions_share: number;
    }>;
  };
  equivalency_comparisons?: {
    visual_metaphors?: Array<{
      metaphor: string;
      impact_type: string;
    }>;
    contextual_benchmarks?: {
      vs_best_in_class: string;
      vs_industry_average: string;
      improvement_potential: string;
    };
    carbon_footprint_equivalents?: {
      coal_pounds: number;
      gasoline_gallons: number;
      cars_driven_miles: number;
      tree_seedlings_grown: number;
    };
  };
};

export default function LCAAnalysisForm({
  lcaAnalysis_id,
}: LCAAnalysisPropsForm) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    data: lcaAnalysisDetail,
    isLoading,
    refetch,
  } = useAdminGetLcaAnalysisDetail(lcaAnalysis_id);
  const { mutateAsync: updateLcaAnalysis, loading: updating }
    = useAdminUpdateLcaAnalysisMutation(lcaAnalysis_id);

  const FormSchema = UpdateLcaAnalysisSchema.extend({
    mainJson: z.string().min(1, 'Main LCA analysis is required'),
  });

  type FormValues = z.infer<typeof FormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mainJson: '',
      mainLcaAnalysis: undefined,
      otherAnalysis: undefined,
      dataSources: [],
      productSpecificationId: undefined,
    },
  });

  const {
    handleSubmit,
    formState: { isDirty, errors },
    reset,
    setValue,
    watch,
    setError,
    clearErrors,
    getValues,
  } = form;

  const otherAnalysis
    = (watch('otherAnalysis') as OtherAnalysisData | undefined) ?? {};
  const mainJsonValue = watch('mainJson');

  // Helper function to transform otherAnalysis from backend format to schema format
  const transformOtherAnalysis = useCallback(
    (otherAnalysisData: any): UpdateLcaAnalysisDTO['otherAnalysis'] => {
      if (!otherAnalysisData) {
        return undefined;
      }
      return {
        ...otherAnalysisData,
      };
    },
    [],
  );

  const getCurrentOtherAnalysis = (): OtherAnalysisData =>
    (getValues('otherAnalysis') as OtherAnalysisData | undefined) ?? {};

  // Load data into form
  useEffect(() => {
    if (lcaAnalysisDetail?.data) {
      const data = lcaAnalysisDetail.data;
      const mainJsonString = JSON.stringify(data.mainLcaAnalysis, null, 2);
      reset({
        mainJson: mainJsonString,
        mainLcaAnalysis: data.mainLcaAnalysis,
        otherAnalysis: transformOtherAnalysis(data.otherAnalysis),
        dataSources: data.dataSources || [],
        productSpecificationId: data.productSpecificationId ?? undefined,
      });
      clearErrors('mainJson');
    }
  }, [lcaAnalysisDetail, reset, clearErrors, transformOtherAnalysis]);

  const handleMainJsonChange = (value: string) => {
    setValue('mainJson', value, { shouldDirty: true });
    clearErrors('mainJson');
    try {
      const parsed = JSON.parse(value);
      setValue('mainLcaAnalysis', parsed, { shouldDirty: true });
    } catch {
      setError('mainJson', { type: 'parse', message: 'Invalid JSON format' });
    }
  };

  const updateOtherAnalysis = (updated: OtherAnalysisData) => {
    setValue('otherAnalysis', transformOtherAnalysis(updated), {
      shouldDirty: true,
    });
  };

  const updateEmissionVelocity = (field: string, value: any) => {
    const current = getCurrentOtherAnalysis();
    updateOtherAnalysis({
      ...current,
      timeline_analysis: {
        ...current.timeline_analysis,
        emission_velocity: {
          ...current.timeline_analysis?.emission_velocity,
          [field]: value,
        } as any,
      },
    });
  };

  const updateTotalLifecycleCarbon = (value: number) => {
    const current = getCurrentOtherAnalysis();
    updateOtherAnalysis({
      ...current,
      timeline_analysis: {
        ...current.timeline_analysis,
        total_lifecycle_carbon: value,
      },
    });
  };

  const addMilestone = () => {
    const current = getCurrentOtherAnalysis();
    const milestones = current.timeline_analysis?.milestones || [];
    updateOtherAnalysis({
      ...current,
      timeline_analysis: {
        ...current.timeline_analysis,
        milestones: [
          ...milestones,
          { day: 0, event: '', significance: '' } as {
            day: number;
            event: string;
            significance: string;
          },
        ],
      },
    });
  };

  const updateMilestone = (index: number, field: string, value: any) => {
    const current = getCurrentOtherAnalysis();
    const milestones = [
      ...(current.timeline_analysis?.milestones || []),
    ] as any[];
    const selected = milestones[index];
    if (!selected) {
      return;
    }
    milestones[index] = {
      ...selected,
      [field]: value,
    };
    updateOtherAnalysis({
      ...current,
      timeline_analysis: {
        ...current.timeline_analysis,
        milestones,
      },
    });
  };

  const removeMilestone = (index: number) => {
    const current = getCurrentOtherAnalysis();
    const milestones
      = current.timeline_analysis?.milestones?.filter(
        (_milestone: any, i: number) => i !== index,
      ) || [];
    updateOtherAnalysis({
      ...current,
      timeline_analysis: {
        ...current.timeline_analysis,
        milestones,
      },
    });
  };

  const addLifecycleProgression = () => {
    const current = getCurrentOtherAnalysis();
    const progression = current.timeline_analysis?.lifecycle_progression || [];
    updateOtherAnalysis({
      ...current,
      timeline_analysis: {
        ...current.timeline_analysis,
        lifecycle_progression: [
          ...progression,
          { stage: '', emissions: 0, duration_days: 0, key_activities: [] } as {
            stage: string;
            emissions: number;
            duration_days: number;
            key_activities: string[];
          },
        ],
      },
    });
  };

  const updateLifecycleProgression = (
    index: number,
    field: string,
    value: any,
  ) => {
    const current = getCurrentOtherAnalysis();
    const progression = [
      ...(current.timeline_analysis?.lifecycle_progression || []),
    ] as any[];
    const selected = progression[index];
    if (!selected) {
      return;
    }
    progression[index] = {
      ...selected,
      [field]: value,
    };
    updateOtherAnalysis({
      ...current,
      timeline_analysis: {
        ...current.timeline_analysis,
        lifecycle_progression: progression,
      },
    });
  };

  const removeLifecycleProgression = (index: number) => {
    const current = getCurrentOtherAnalysis();
    const progression
      = current.timeline_analysis?.lifecycle_progression?.filter(
        (_item: any, i: number) => i !== index,
      ) || [];
    updateOtherAnalysis({
      ...current,
      timeline_analysis: {
        ...current.timeline_analysis,
        lifecycle_progression: progression,
      },
    });
  };

  const updateContextualBenchmarks = (field: string, value: string) => {
    const current = getCurrentOtherAnalysis();
    updateOtherAnalysis({
      ...current,
      equivalency_comparisons: {
        ...current.equivalency_comparisons,
        contextual_benchmarks: {
          ...current.equivalency_comparisons?.contextual_benchmarks,
          [field]: value,
        } as any,
      },
    });
  };

  const updateCarbonFootprintEquivalents = (field: string, value: number) => {
    const current = getCurrentOtherAnalysis();
    updateOtherAnalysis({
      ...current,
      equivalency_comparisons: {
        ...current.equivalency_comparisons,
        carbon_footprint_equivalents: {
          ...current.equivalency_comparisons?.carbon_footprint_equivalents,
          [field]: value,
        } as any,
      },
    });
  };

  const updateTierBreakdown = (field: string, value: number | string) => {
    const current = getCurrentOtherAnalysis();
    updateOtherAnalysis({
      ...current,
      supply_chain_mapping: {
        ...current.supply_chain_mapping,
        tier_breakdown: {
          ...current.supply_chain_mapping?.tier_breakdown,
          [field]: value,
        } as any,
      },
    });
  };

  const updateTraceabilityScore = (field: string, value: number) => {
    const current = getCurrentOtherAnalysis();
    updateOtherAnalysis({
      ...current,
      supply_chain_mapping: {
        ...current.supply_chain_mapping,
        traceability_score: {
          ...current.supply_chain_mapping?.traceability_score,
          [field]: value,
        } as any,
      },
    });
  };

  const onSubmit = async (values: FormValues) => {
    let parsedMain = values.mainLcaAnalysis;

    if (!parsedMain) {
      try {
        parsedMain = JSON.parse(values.mainJson);
      } catch {
        setError('mainJson', { type: 'parse', message: 'Invalid JSON format' });
        return;
      }
    }

    try {
      const payload: UpdateLcaAnalysisDTO = {
        productSpecificationId: values.productSpecificationId,
        mainLcaAnalysis: parsedMain,
        otherAnalysis: values.otherAnalysis,
        dataSources: values.dataSources,
      };

      await updateLcaAnalysis(payload);
      toast({
        title: 'Success',
        description: 'LCA Analysis updated successfully!',
      });
      setIsEditing(false);
      refetch();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update LCA Analysis',
        variant: 'error',
      });
    }
  };

  const handleCancel = () => {
    if (lcaAnalysisDetail?.data) {
      reset({
        mainJson: JSON.stringify(
          lcaAnalysisDetail.data.mainLcaAnalysis,
          null,
          2,
        ),
        mainLcaAnalysis: lcaAnalysisDetail.data.mainLcaAnalysis,
        otherAnalysis: transformOtherAnalysis(
          lcaAnalysisDetail.data.otherAnalysis,
        ),
        dataSources: lcaAnalysisDetail.data.dataSources || [],
        productSpecificationId:
          lcaAnalysisDetail.data.productSpecificationId ?? undefined,
      });
    }
    clearErrors('mainJson');
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <CircleNotch size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">LCA Analysis</h2>
        {!isEditing
          ? (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                variant="primary"
                size="sm"
              >
                <PencilSimple size={16} weight="bold" />
                Edit
              </Button>
            )
          : (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="secondary"
                  size="sm"
                >
                  <X size={16} weight="bold" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="lca-analysis-form"
                  disabled={!isDirty || updating || !!errors.mainJson}
                  variant="primary"
                  size="sm"
                >
                  {updating
                    ? (
                        <>
                          <CircleNotch
                            size={16}
                            className="animate-spin"
                            weight="bold"
                          />
                          Saving...
                        </>
                      )
                    : (
                        <>
                          <Check size={16} weight="bold" />
                          Save Changes
                        </>
                      )}
                </Button>
              </div>
            )}
      </div>

      {/* Form */}
      <form
        id="lca-analysis-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Main LCA Analysis JSON Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Main LCA Analysis Data
            </h3>
            {errors.mainJson && (
              <div className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-1 text-sm text-red-700">
                <Warning size={16} weight="fill" />
                {errors.mainJson.message}
              </div>
            )}
          </div>

          <div className="relative">
            <Label htmlFor="mainLcaAnalysis">JSON Data</Label>
            <Textarea
              id="mainLcaAnalysis"
              value={mainJsonValue}
              onChange={e => handleMainJsonChange(e.target.value)}
              disabled={!isEditing}
              rows={20}
              hasError={!!errors.mainJson}
              className={cn('mt-2 font-mono text-sm')}
              placeholder={'{\n  "key": "value"\n}'}
            />
          </div>

          {isEditing && (
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              <p className="font-medium">Tips for editing:</p>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>
                  Ensure valid JSON syntax (use quotes for strings, commas
                  between items)
                </li>
                <li>The data will be validated before saving</li>
                <li>
                  Use a JSON formatter if you need help structuring the data
                </li>
              </ul>
            </div>
          )}
        </motion.div>

        {/* Other Analysis Data Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Other Analysis Data
          </h3>

          {/* Timeline Analysis Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-base font-semibold text-gray-900">
                Timeline Analysis
              </h4>
              {isEditing && (
                <Button
                  type="button"
                  onClick={addMilestone}
                  variant="primary"
                  size="sm"
                >
                  <Plus size={14} weight="bold" />
                  Add Milestone
                </Button>
              )}
            </div>

            {/* Emission Velocity */}
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="peak_emission_phase">Peak Emission Phase</Label>
                <Input
                  id="peak_emission_phase"
                  value={
                    otherAnalysis.timeline_analysis?.emission_velocity
                      ?.peak_emission_phase ?? ''
                  }
                  onChange={e =>
                    updateEmissionVelocity(
                      'peak_emission_phase',
                      e.target.value,
                    )}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="cumulative_emissions">
                  Cumulative Emissions
                </Label>
                <Input
                  id="cumulative_emissions"
                  type="number"
                  value={
                    otherAnalysis.timeline_analysis?.emission_velocity
                      ?.cumulative_emissions ?? ''
                  }
                  onChange={e =>
                    updateEmissionVelocity(
                      'cumulative_emissions',
                      e.target.value ? Number.parseFloat(e.target.value) : 0,
                    )}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="daily_average_emissions">
                  Daily Average Emissions
                </Label>
                <Input
                  id="daily_average_emissions"
                  type="number"
                  value={
                    otherAnalysis.timeline_analysis?.emission_velocity
                      ?.daily_average_emissions ?? ''
                  }
                  onChange={e =>
                    updateEmissionVelocity(
                      'daily_average_emissions',
                      e.target.value ? Number.parseFloat(e.target.value) : 0,
                    )}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Total Lifecycle Carbon */}
            <div className="mb-6">
              <Label htmlFor="total_lifecycle_carbon">
                Total Lifecycle Carbon
              </Label>
              <Input
                id="total_lifecycle_carbon"
                type="number"
                step="0.01"
                value={
                  otherAnalysis.timeline_analysis?.total_lifecycle_carbon ?? ''
                }
                onChange={e =>
                  updateTotalLifecycleCarbon(
                    e.target.value ? Number.parseFloat(e.target.value) : 0,
                  )}
                disabled={!isEditing}
                className="mt-2"
                placeholder="e.g., 1234.56"
              />
            </div>

            {/* Milestones Table */}
            <div className="mb-6">
              <Label className="mb-2 block">Milestones</Label>
              {otherAnalysis.timeline_analysis?.milestones
                && otherAnalysis.timeline_analysis.milestones.length > 0
                ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                              Day
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                              Event
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                              Significance
                            </th>
                            {isEditing && (
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                                Action
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {otherAnalysis.timeline_analysis.milestones.map(
                            (milestone, index) => (
                              <tr
                                key={`${milestone.event || milestone.significance || 'milestone'}-${milestone.day ?? index}`}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-3 py-2">
                                  <Input
                                    type="number"
                                    value={milestone.day}
                                    onChange={e =>
                                      updateMilestone(
                                        index,
                                        'day',
                                        Number.parseInt(e.target.value),
                                      )}
                                    disabled={!isEditing}
                                    className="min-w-[80px] text-xs"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <Input
                                    value={milestone.event}
                                    onChange={e =>
                                      updateMilestone(
                                        index,
                                        'event',
                                        e.target.value,
                                      )}
                                    disabled={!isEditing}
                                    className="min-w-[150px] text-xs"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <Input
                                    value={milestone.significance}
                                    onChange={e =>
                                      updateMilestone(
                                        index,
                                        'significance',
                                        e.target.value,
                                      )}
                                    disabled={!isEditing}
                                    className="min-w-[200px] text-xs"
                                  />
                                </td>
                                {isEditing && (
                                  <td className="px-3 py-2">
                                    <Button
                                      type="button"
                                      onClick={() => removeMilestone(index)}
                                      variant="secondary"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <Trash size={14} weight="bold" />
                                    </Button>
                                  </td>
                                )}
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  )
                : (
                    <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                      No milestones added. Click &quot;Add Milestone&quot; to add
                      one.
                    </p>
                  )}
            </div>

            {/* Lifecycle Progression */}
            <div className="mb-4 flex items-center justify-between">
              <Label>Lifecycle Progression</Label>
              {isEditing && (
                <Button
                  type="button"
                  onClick={addLifecycleProgression}
                  variant="primary"
                  size="sm"
                >
                  <Plus size={14} weight="bold" />
                  Add Progression
                </Button>
              )}
            </div>
            {otherAnalysis.timeline_analysis?.lifecycle_progression
              && otherAnalysis.timeline_analysis.lifecycle_progression.length > 0
              ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                            Stage
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                            Emissions
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                            Duration (days)
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                            Key Activities
                          </th>
                          {isEditing && (
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                              Action
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {otherAnalysis.timeline_analysis.lifecycle_progression.map(
                          (prog, index) => (
                            <tr
                              key={`${prog.stage || 'stage'}-${prog.duration_days ?? index}-${prog.emissions ?? 'emissions'}`}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-3 py-2">
                                <Input
                                  value={prog.stage}
                                  onChange={e =>
                                    updateLifecycleProgression(
                                      index,
                                      'stage',
                                      e.target.value,
                                    )}
                                  disabled={!isEditing}
                                  className="min-w-[100px] text-xs"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  type="number"
                                  value={prog.emissions}
                                  onChange={e =>
                                    updateLifecycleProgression(
                                      index,
                                      'emissions',
                                      Number.parseFloat(e.target.value),
                                    )}
                                  disabled={!isEditing}
                                  className="min-w-[80px] text-xs"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  type="number"
                                  value={prog.duration_days}
                                  onChange={e =>
                                    updateLifecycleProgression(
                                      index,
                                      'duration_days',
                                      Number.parseInt(e.target.value),
                                    )}
                                  disabled={!isEditing}
                                  className="min-w-[80px] text-xs"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  value={prog.key_activities?.join(', ') ?? ''}
                                  onChange={e =>
                                    updateLifecycleProgression(
                                      index,
                                      'key_activities',
                                      e.target.value
                                        .split(',')
                                        .map(s => s.trim())
                                        .filter(s => s),
                                    )}
                                  disabled={!isEditing}
                                  className="min-w-[150px] text-xs"
                                  placeholder="Comma separated"
                                />
                              </td>
                              {isEditing && (
                                <td className="px-3 py-2">
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      removeLifecycleProgression(index)}
                                    variant="secondary"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Trash size={14} weight="bold" />
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                )
              : (
                  <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                    No lifecycle progression added. Click &quot;Add
                    Progression&quot; to add one.
                  </p>
                )}
          </div>

          {/* Equivalency Comparisons Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-4 text-base font-semibold text-gray-900">
              Equivalency Comparisons
            </h4>

            {/* Contextual Benchmarks */}
            <div className="mb-6">
              <Label className="mb-2 block">Contextual Benchmarks</Label>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="vs_best_in_class">Vs Best in Class</Label>
                  <Input
                    id="vs_best_in_class"
                    value={
                      otherAnalysis.equivalency_comparisons
                        ?.contextual_benchmarks
                        ?.vs_best_in_class ?? ''
                    }
                    onChange={e =>
                      updateContextualBenchmarks(
                        'vs_best_in_class',
                        e.target.value,
                      )}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="vs_industry_average">
                    Vs Industry Average
                  </Label>
                  <Input
                    id="vs_industry_average"
                    value={
                      otherAnalysis.equivalency_comparisons
                        ?.contextual_benchmarks
                        ?.vs_industry_average ?? ''
                    }
                    onChange={e =>
                      updateContextualBenchmarks(
                        'vs_industry_average',
                        e.target.value,
                      )}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="improvement_potential">
                    Improvement Potential
                  </Label>
                  <Input
                    id="improvement_potential"
                    value={
                      otherAnalysis.equivalency_comparisons
                        ?.contextual_benchmarks
                        ?.improvement_potential ?? ''
                    }
                    onChange={e =>
                      updateContextualBenchmarks(
                        'improvement_potential',
                        e.target.value,
                      )}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Carbon Footprint Equivalents */}
            <div>
              <Label className="mb-2 block">Carbon Footprint Equivalents</Label>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label htmlFor="coal_pounds">Coal Pounds</Label>
                  <Input
                    id="coal_pounds"
                    type="number"
                    value={
                      otherAnalysis.equivalency_comparisons
                        ?.carbon_footprint_equivalents
                        ?.coal_pounds ?? ''
                    }
                    onChange={e =>
                      updateCarbonFootprintEquivalents(
                        'coal_pounds',
                        Number.parseFloat(e.target.value),
                      )}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="gasoline_gallons">Gasoline Gallons</Label>
                  <Input
                    id="gasoline_gallons"
                    type="number"
                    value={
                      otherAnalysis.equivalency_comparisons
                        ?.carbon_footprint_equivalents
                        ?.gasoline_gallons ?? ''
                    }
                    onChange={e =>
                      updateCarbonFootprintEquivalents(
                        'gasoline_gallons',
                        Number.parseFloat(e.target.value),
                      )}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="cars_driven_miles">Cars Driven Miles</Label>
                  <Input
                    id="cars_driven_miles"
                    type="number"
                    value={
                      otherAnalysis.equivalency_comparisons
                        ?.carbon_footprint_equivalents
                        ?.cars_driven_miles ?? ''
                    }
                    onChange={e =>
                      updateCarbonFootprintEquivalents(
                        'cars_driven_miles',
                        Number.parseFloat(e.target.value),
                      )}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="tree_seedlings_grown">
                    Tree Seedlings Grown
                  </Label>
                  <Input
                    id="tree_seedlings_grown"
                    type="number"
                    value={
                      otherAnalysis.equivalency_comparisons
                        ?.carbon_footprint_equivalents
                        ?.tree_seedlings_grown
                        ?? ''
                    }
                    onChange={e =>
                      updateCarbonFootprintEquivalents(
                        'tree_seedlings_grown',
                        Number.parseFloat(e.target.value),
                      )}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Supply Chain Mapping Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-4 text-base font-semibold text-gray-900">
              Supply Chain Mapping
            </h4>

            {/* Tier Breakdown */}
            <div className="mb-6">
              <Label className="mb-2 block">Tier Breakdown</Label>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label htmlFor="tier_1_suppliers">Tier 1 Suppliers</Label>
                  <Input
                    id="tier_1_suppliers"
                    type="number"
                    value={
                      otherAnalysis.supply_chain_mapping?.tier_breakdown
                        ?.tier_1_suppliers ?? ''
                    }
                    onChange={e =>
                      updateTierBreakdown(
                        'tier_1_suppliers',
                        Number.parseInt(e.target.value),
                      )}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="tier_2_suppliers">Tier 2 Suppliers</Label>
                  <Input
                    id="tier_2_suppliers"
                    type="number"
                    value={
                      otherAnalysis.supply_chain_mapping?.tier_breakdown
                        ?.tier_2_suppliers ?? ''
                    }
                    onChange={e =>
                      updateTierBreakdown(
                        'tier_2_suppliers',
                        Number.parseInt(e.target.value),
                      )}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="tier_3_suppliers">Tier 3 Suppliers</Label>
                  <Input
                    id="tier_3_suppliers"
                    type="number"
                    value={
                      otherAnalysis.supply_chain_mapping?.tier_breakdown
                        ?.tier_3_suppliers ?? ''
                    }
                    onChange={e =>
                      updateTierBreakdown(
                        'tier_3_suppliers',
                        Number.parseInt(e.target.value),
                      )}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="geographical_spread">
                    Geographical Spread
                  </Label>
                  <Input
                    id="geographical_spread"
                    value={
                      otherAnalysis.supply_chain_mapping?.tier_breakdown
                        ?.geographical_spread ?? ''
                    }
                    onChange={e =>
                      updateTierBreakdown('geographical_spread', e.target.value)}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Traceability Score */}
            <div>
              <Label className="mb-2 block">Traceability Score</Label>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label htmlFor="overall_score">Overall Score</Label>
                  <Input
                    id="overall_score"
                    type="number"
                    step="0.01"
                    value={
                      otherAnalysis.supply_chain_mapping?.traceability_score
                        ?.overall_score ?? ''
                    }
                    onChange={e =>
                      updateTraceabilityScore(
                        'overall_score',
                        Number.parseFloat(e.target.value),
                      )}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="material_traceability">
                    Material Traceability
                  </Label>
                  <Input
                    id="material_traceability"
                    type="number"
                    step="0.01"
                    value={
                      otherAnalysis.supply_chain_mapping?.traceability_score
                        ?.material_traceability ?? ''
                    }
                    onChange={e =>
                      updateTraceabilityScore(
                        'material_traceability',
                        Number.parseFloat(e.target.value),
                      )}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="supplier_transparency">
                    Supplier Transparency
                  </Label>
                  <Input
                    id="supplier_transparency"
                    type="number"
                    step="0.01"
                    value={
                      otherAnalysis.supply_chain_mapping?.traceability_score
                        ?.supplier_transparency ?? ''
                    }
                    onChange={e =>
                      updateTraceabilityScore(
                        'supplier_transparency',
                        Number.parseFloat(e.target.value),
                      )}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="certification_coverage">
                    Certification Coverage
                  </Label>
                  <Input
                    id="certification_coverage"
                    type="number"
                    step="0.01"
                    value={
                      otherAnalysis.supply_chain_mapping?.traceability_score
                        ?.certification_coverage ?? ''
                    }
                    onChange={e =>
                      updateTraceabilityScore(
                        'certification_coverage',
                        Number.parseFloat(e.target.value),
                      )}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </form>

      {/* Display Data Sources */}
      {lcaAnalysisDetail?.data?.dataSources
        && lcaAnalysisDetail.data.dataSources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Data Sources
          </h3>
          <div className="space-y-3">
            {lcaAnalysisDetail.data.dataSources.map((source, idx) => (
              <div
                key={source.url ? `${source.url}-${idx}` : `source-${idx}`}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                {source.title && (
                  <p className="font-medium text-gray-900">
                    {String(source.title)}
                  </p>
                )}
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm text-blue-600 hover:underline"
                  >
                    {source.url}
                  </a>
                )}
                {source.content != null && (
                  <p className="mt-2 text-sm text-gray-600">
                    {typeof source.content === 'string'
                      ? source.content
                      : JSON.stringify(source.content)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
