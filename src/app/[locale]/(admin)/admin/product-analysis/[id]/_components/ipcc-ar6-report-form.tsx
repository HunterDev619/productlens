'use client';

import type { UpdateIpccReportDTO } from '@/schemas/admin/ipcc-ar6-reports';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CircleNotch, PencilSimple, X } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/components/ui';
import { toast } from '@/hooks/use-toast';
import { UpdateIpccReportSchema } from '@/schemas/admin/ipcc-ar6-reports';
import { useAdminGetIpccAr6ReportDetail } from '@/services/admin/ipcc-ar6-report/detail';
import { useAdminUpdateIpccReportMutation } from '@/services/admin/ipcc-ar6-report/update';

type IpccAr6ReportPropsForm = {
  report_id: string;
};

export default function IpccAr6ReportForm({ report_id }: IpccAr6ReportPropsForm) {
  const [isEditing, setIsEditing] = useState(false);

  const { data: ipccAr6ReportDetail, isLoading, refetch } = useAdminGetIpccAr6ReportDetail(report_id);
  const { mutateAsync: updateIpccReport, loading: updating } = useAdminUpdateIpccReportMutation(report_id);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
  } = useForm<UpdateIpccReportDTO>({
    resolver: zodResolver(UpdateIpccReportSchema),
  });

  // Load data into form
  useEffect(() => {
    if (ipccAr6ReportDetail?.data) {
      const data = ipccAr6ReportDetail.data;
      reset({
        overallSummary: data.overallSummary || '',
        globalWarmingTotalEmission: data.globalWarmingTotalEmission?.toString() || '',
        globalWarmingTotalEmissionUnit: data.globalWarmingTotalEmissionUnit || 'kg CO2e',
        globalWarmingCondition: data.globalWarmingCondition || 'intermediate',
        globalWarmingDescription: data.globalWarmingDescription || '',
        waterConsumption: data.waterConsumption?.toString() || '',
        waterConsumptionUnit: data.waterConsumptionUnit || 'L',
        waterConsumptionDescription: data.waterConsumptionDescription || '',
        landUse: data.landUse?.toString() || '',
        landUseUnit: data.landUseUnit || 'm²',
        landUseDescription: data.landUseDescription || '',
        biodiversity: data.biodiversity?.toString() || '',
        biodiversityUnit: data.biodiversityUnit || 'index',
        biodiversityDescription: data.biodiversityDescription || '',
        airEmissions: data.airEmissions?.toString() || '',
        airEmissionsUnit: data.airEmissionsUnit || 'kg',
        airEmissionsDescription: data.airEmissionsDescription || '',
        wasteGeneration: data.wasteGeneration?.toString() || '',
        wasteGenerationUnit: data.wasteGenerationUnit || 'kg',
        wasteGenerationDescription: data.wasteGenerationDescription || '',
        resourceDepletion: data.resourceDepletion?.toString() || '',
        resourceDepletionUnit: data.resourceDepletionUnit || '',
        resourceDepletionDescription: data.resourceDepletionDescription || '',
        healthImpact: data.healthImpact?.toString() || '',
        healthImpactUnit: data.healthImpactUnit || '',
        healthImpactDescription: data.healthImpactDescription || '',
        ecosystemImpact: data.ecosystemImpact?.toString() || '',
        ecosystemImpactUnit: data.ecosystemImpactUnit || '',
        ecosystemImpactDescription: data.ecosystemImpactDescription || '',
      });
    }
  }, [ipccAr6ReportDetail, reset]);

  const onSubmit = async (data: UpdateIpccReportDTO) => {
    try {
      await updateIpccReport(data);
      toast({
        title: 'Success',
        description: 'IPCC AR6 Report updated successfully!',
      });
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update IPCC AR6 Report',
        variant: 'error',
      });
      console.error(error);
    }
  };

  const handleCancel = () => {
    reset();
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
        <h2 className="text-2xl font-bold text-gray-900">IPCC AR6 Report</h2>
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
                  form="ipcc-report-form"
                  disabled={!isDirty || updating}
                  variant="primary"
                  size="sm"
                >
                  {updating
                    ? (
                        <>
                          <CircleNotch size={16} className="animate-spin" weight="bold" />
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
      <form id="ipcc-report-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Overall Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">Overall Summary</h3>
          <div>
            <Label htmlFor="overallSummary">Summary</Label>
            <Textarea
              id="overallSummary"
              {...register('overallSummary')}
              disabled={!isEditing}
              rows={4}
              hasError={!!errors.overallSummary}
              className="mt-2"
            />
            {errors.overallSummary && (
              <p className="mt-1 text-sm text-red-600">{errors.overallSummary.message}</p>
            )}
          </div>
        </motion.div>

        {/* Global Warming Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">🌡️ Global Warming</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="globalWarmingTotalEmission">Total Emission</Label>
              <Input
                id="globalWarmingTotalEmission"
                {...register('globalWarmingTotalEmission')}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="globalWarmingTotalEmissionUnit">Unit</Label>
              <Input
                id="globalWarmingTotalEmissionUnit"
                {...register('globalWarmingTotalEmissionUnit')}
                disabled={!isEditing}
                placeholder="kg CO2e"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="globalWarmingCondition">Condition</Label>
              <Controller
                name="globalWarmingCondition"
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={!isEditing}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="globalWarmingCondition" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very low">Very Low</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="very high">Very High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="globalWarmingDescription">Description</Label>
              <Textarea
                id="globalWarmingDescription"
                {...register('globalWarmingDescription')}
                disabled={!isEditing}
                rows={3}
                className="mt-2"
              />
            </div>
          </div>
        </motion.div>

        {/* Water Consumption Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">💧 Water Consumption</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="waterConsumption">Consumption</Label>
              <Input
                id="waterConsumption"
                {...register('waterConsumption')}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="waterConsumptionUnit">Unit</Label>
              <Input
                id="waterConsumptionUnit"
                {...register('waterConsumptionUnit')}
                disabled={!isEditing}
                placeholder="L"
                className="mt-2"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="waterConsumptionDescription">Description</Label>
              <Textarea
                id="waterConsumptionDescription"
                {...register('waterConsumptionDescription')}
                disabled={!isEditing}
                rows={3}
                className="mt-2"
              />
            </div>
          </div>
        </motion.div>

        {/* Land Use Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">🌍 Land Use</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="landUse">Land Use</Label>
              <Input
                id="landUse"
                {...register('landUse')}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="landUseUnit">Unit</Label>
              <Input
                id="landUseUnit"
                {...register('landUseUnit')}
                disabled={!isEditing}
                placeholder="m²"
                className="mt-2"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="landUseDescription">Description</Label>
              <Textarea
                id="landUseDescription"
                {...register('landUseDescription')}
                disabled={!isEditing}
                rows={3}
                className="mt-2"
              />
            </div>
          </div>
        </motion.div>

        {/* Biodiversity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">🦋 Biodiversity</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <Label htmlFor="biodiversity">Impact</Label>
              <Input
                id="biodiversity"
                {...register('biodiversity')}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="biodiversityUnit">Unit</Label>
              <Input
                id="biodiversityUnit"
                {...register('biodiversityUnit')}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            <div className="md:col-span-3">
              <Label htmlFor="biodiversityDescription">Description</Label>
              <Textarea
                id="biodiversityDescription"
                {...register('biodiversityDescription')}
                disabled={!isEditing}
                rows={2}
                className="mt-2"
              />
            </div>
          </div>
        </motion.div>

        {/* Air Emissions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">💨 Air Emissions</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <Label htmlFor="airEmissions">Emissions</Label>
              <Input
                id="airEmissions"
                {...register('airEmissions')}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="airEmissionsUnit">Unit</Label>
              <Input
                id="airEmissionsUnit"
                {...register('airEmissionsUnit')}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            <div className="md:col-span-3">
              <Label htmlFor="airEmissionsDescription">Description</Label>
              <Textarea
                id="airEmissionsDescription"
                {...register('airEmissionsDescription')}
                disabled={!isEditing}
                rows={2}
                className="mt-2"
              />
            </div>
          </div>
        </motion.div>

        {/* Waste Generation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">🗑️ Waste Generation</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <Label htmlFor="wasteGeneration">Waste</Label>
              <Input
                id="wasteGeneration"
                {...register('wasteGeneration')}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="wasteGenerationUnit">Unit</Label>
              <Input
                id="wasteGenerationUnit"
                {...register('wasteGenerationUnit')}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            <div className="md:col-span-3">
              <Label htmlFor="wasteGenerationDescription">Description</Label>
              <Textarea
                id="wasteGenerationDescription"
                {...register('wasteGenerationDescription')}
                disabled={!isEditing}
                rows={2}
                className="mt-2"
              />
            </div>
          </div>
        </motion.div>
      </form>
    </div>
  );
}
