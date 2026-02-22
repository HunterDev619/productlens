'use client';

import type { UpdateMaterialCompositionDTO } from '@/schemas/admin/material-composition';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CircleNotch, PencilSimple, Plus, Trash, X } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { toast } from '@/hooks/use-toast';
import { UpdateMaterialCompositionSchema } from '@/schemas/admin/material-composition';
import { useAdminGetMaterialCompositionDetail } from '@/services/admin/material-composition/detail';
import { useAdminUpdateMaterialCompositionMutation } from '@/services/admin/material-composition/update';

type MaterialCompositionPropsForm = {
  composition_id: string;
};

type MaterialItem = {
  material_name: string;
  material_type: string | null;
  weight: number | null;
  weight_unit: string | null;
  percentage: number | null;
  carbon_factor: number | null;
  carbon_factor_unit: string | null;
  carbon_emissions: number | null;
  source: string | null;
  sustainability_notes: string | null;
  recyclable: boolean | null;
  renewable: boolean | null;
};

const createEmptyMaterial = (): MaterialItem => ({
  material_name: '',
  material_type: null,
  weight: null,
  weight_unit: null,
  percentage: null,
  carbon_factor: null,
  carbon_factor_unit: null,
  carbon_emissions: null,
  source: null,
  sustainability_notes: null,
  recyclable: null,
  renewable: null,
});

export default function MaterialCompositionForm({ composition_id }: MaterialCompositionPropsForm) {
  const [isEditing, setIsEditing] = useState(false);
  const [materialComposition, setMaterialComposition] = useState<{
    total_weight: number | null;
    total_weight_unit: string | null;
    materials: MaterialItem[];
    summary: any;
  }>({
    total_weight: null,
    total_weight_unit: null,
    materials: [],
    summary: null,
  });

  const { data: materialCompositionDetail, isLoading, refetch } = useAdminGetMaterialCompositionDetail(composition_id);
  const { mutateAsync: updateMaterialComposition, loading: updating } = useAdminUpdateMaterialCompositionMutation(composition_id);

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
    control,
    setValue,
  } = useForm<UpdateMaterialCompositionDTO>({
    resolver: zodResolver(UpdateMaterialCompositionSchema),
  });

  // Load data into form
  useEffect(() => {
    if (materialCompositionDetail?.data) {
      const data = materialCompositionDetail.data;
      const composition = data.materialComposition || {
        total_weight: null,
        total_weight_unit: null,
        materials: [],
        summary: null,
      };
      setMaterialComposition({
        total_weight: composition.total_weight ?? null,
        total_weight_unit: composition.total_weight_unit ?? null,
        materials: composition.materials || [],
        summary: composition.summary || null,
      });
      reset({
        totalWeight: data.totalWeight?.toString() || '',
        totalWeightUnit: data.totalWeightUnit || '',
        totalCarbonFootprint: data.totalCarbonFootprint?.toString() || '',
        carbonFootprintUnit: data.carbonFootprintUnit || 'kg CO2e',
        recyclabilityScore: data.recyclabilityScore?.toString() || '',
        sustainabilityRating: data.sustainabilityRating || '',
        materialComposition: composition,
      });
    }
  }, [materialCompositionDetail, reset]);

  const updateMaterialCompositionState = (updated: typeof materialComposition) => {
    setMaterialComposition(updated);
    setValue('materialComposition', updated, { shouldDirty: true });
  };

  const addMaterial = () => {
    updateMaterialCompositionState({
      ...materialComposition,
      materials: [...materialComposition.materials, createEmptyMaterial()],
    });
  };

  const removeMaterial = (index: number) => {
    updateMaterialCompositionState({
      ...materialComposition,
      materials: materialComposition.materials.filter((_, i) => i !== index),
    });
  };

  const updateMaterial = (index: number, field: keyof MaterialItem, value: any) => {
    const updatedMaterials = [...materialComposition.materials];
    const currentMaterial = updatedMaterials[index];
    if (!currentMaterial) {
      return;
    }

    updatedMaterials[index] = {
      ...currentMaterial,
      [field]: field === 'material_name' ? (value || '') : value,
    } as MaterialItem;

    updateMaterialCompositionState({
      ...materialComposition,
      materials: updatedMaterials,
    });
  };

  const updateTotalWeight = (field: 'total_weight' | 'total_weight_unit', value: any) => {
    updateMaterialCompositionState({
      ...materialComposition,
      [field]: value,
    });
  };

  const onSubmit = async (data: UpdateMaterialCompositionDTO) => {
    try {
      await updateMaterialComposition(data);
      toast({
        title: 'Success',
        description: 'Material composition updated successfully!',
      });
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update material composition',
        variant: 'error',
      });
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (materialCompositionDetail?.data) {
      const composition = materialCompositionDetail.data.materialComposition || {
        total_weight: null,
        total_weight_unit: null,
        materials: [],
        summary: null,
      };
      setMaterialComposition({
        total_weight: composition.total_weight ?? null,
        total_weight_unit: composition.total_weight_unit ?? null,
        materials: composition.materials || [],
        summary: composition.summary || null,
      });
      reset({
        totalWeight: materialCompositionDetail.data.totalWeight?.toString() || '',
        totalWeightUnit: materialCompositionDetail.data.totalWeightUnit || '',
        totalCarbonFootprint: materialCompositionDetail.data.totalCarbonFootprint?.toString() || '',
        carbonFootprintUnit: materialCompositionDetail.data.carbonFootprintUnit || 'kg CO2e',
        recyclabilityScore: materialCompositionDetail.data.recyclabilityScore?.toString() || '',
        sustainabilityRating: materialCompositionDetail.data.sustainabilityRating || '',
        materialComposition: composition,
      });
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Material Composition</h2>
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
                  form="material-composition-form"
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
      <form id="material-composition-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Metrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">Basic Metrics</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Total Weight */}
            <div>
              <Label htmlFor="totalWeight">Total Weight</Label>
              <Input
                id="totalWeight"
                {...register('totalWeight')}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            {/* Weight Unit */}
            <div>
              <Label htmlFor="totalWeightUnit">Weight Unit</Label>
              <Input
                id="totalWeightUnit"
                {...register('totalWeightUnit')}
                disabled={!isEditing}
                placeholder="kg"
                className="mt-2"
              />
            </div>

            {/* Total Carbon Footprint */}
            <div>
              <Label htmlFor="totalCarbonFootprint">Total Carbon Footprint</Label>
              <Input
                id="totalCarbonFootprint"
                {...register('totalCarbonFootprint')}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            {/* Carbon Footprint Unit */}
            <div>
              <Label htmlFor="carbonFootprintUnit">Carbon Footprint Unit</Label>
              <Input
                id="carbonFootprintUnit"
                {...register('carbonFootprintUnit')}
                disabled={!isEditing}
                placeholder="kg CO2e"
                className="mt-2"
              />
            </div>
          </div>
        </motion.div>

        {/* Sustainability Metrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">Sustainability Metrics</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recyclability Score */}
            <div>
              <Label htmlFor="recyclabilityScore">Recyclability Score</Label>
              <Input
                id="recyclabilityScore"
                {...register('recyclabilityScore')}
                disabled={!isEditing}
                placeholder="0.0 - 1.0"
                className="mt-2"
              />
            </div>

            {/* Sustainability Rating */}
            <div>
              <Label htmlFor="sustainabilityRating">Sustainability Rating</Label>
              <Controller
                name="sustainabilityRating"
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={!isEditing}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="sustainabilityRating" className="mt-2">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="very poor">Very Poor</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </motion.div>

        {/* Material Composition Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Material Composition</h3>
            {isEditing && (
              <Button
                type="button"
                onClick={addMaterial}
                variant="primary"
                size="sm"
              >
                <Plus size={16} weight="bold" />
                Add Material
              </Button>
            )}
          </div>

          {/* Total Weight Fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="total_weight">Total Weight</Label>
              <Input
                id="total_weight"
                type="number"
                value={materialComposition.total_weight ?? ''}
                onChange={e => updateTotalWeight('total_weight', e.target.value ? Number.parseFloat(e.target.value) : null)}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="total_weight_unit">Total Weight Unit</Label>
              <Input
                id="total_weight_unit"
                value={materialComposition.total_weight_unit ?? ''}
                onChange={e => updateTotalWeight('total_weight_unit', e.target.value || null)}
                disabled={!isEditing}
                placeholder="kg"
                className="mt-2"
              />
            </div>
          </div>

          {/* Materials Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Material Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Weight</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Unit</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">%</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Carbon Factor</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">CF Unit</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Emissions</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Source</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Recyclable</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Renewable</th>
                  {isEditing && (
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {materialComposition.materials.length === 0
                  ? (
                      <tr>
                        <td colSpan={isEditing ? 12 : 11} className="px-3 py-4 text-center text-sm text-gray-500">
                          No materials added. Click &quot;Add Material&quot; to add one.
                        </td>
                      </tr>
                    )
                  : (
                      materialComposition.materials.map((material, index) => (
                        <tr key={`${material.material_name}-${index}`} className="hover:bg-gray-50">
                          <td className="px-3 py-2">
                            <Input
                              value={material.material_name}
                              onChange={e => updateMaterial(index, 'material_name', e.target.value)}
                              disabled={!isEditing}
                              className="min-w-[120px] text-xs"
                              placeholder="Material name"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={material.material_type ?? ''}
                              onChange={e => updateMaterial(index, 'material_type', e.target.value || null)}
                              disabled={!isEditing}
                              className="min-w-[100px] text-xs"
                              placeholder="Type"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              value={material.weight ?? ''}
                              onChange={e => updateMaterial(index, 'weight', e.target.value ? Number.parseFloat(e.target.value) : null)}
                              disabled={!isEditing}
                              className="min-w-[80px] text-xs"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={material.weight_unit ?? ''}
                              onChange={e => updateMaterial(index, 'weight_unit', e.target.value || null)}
                              disabled={!isEditing}
                              className="min-w-[60px] text-xs"
                              placeholder="kg"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              value={material.percentage ?? ''}
                              onChange={e => updateMaterial(index, 'percentage', e.target.value ? Number.parseFloat(e.target.value) : null)}
                              disabled={!isEditing}
                              className="min-w-[60px] text-xs"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              value={material.carbon_factor ?? ''}
                              onChange={e => updateMaterial(index, 'carbon_factor', e.target.value ? Number.parseFloat(e.target.value) : null)}
                              disabled={!isEditing}
                              className="min-w-[80px] text-xs"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={material.carbon_factor_unit ?? ''}
                              onChange={e => updateMaterial(index, 'carbon_factor_unit', e.target.value || null)}
                              disabled={!isEditing}
                              className="min-w-[80px] text-xs"
                              placeholder="kg CO2e/kg"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              value={material.carbon_emissions ?? ''}
                              onChange={e => updateMaterial(index, 'carbon_emissions', e.target.value ? Number.parseFloat(e.target.value) : null)}
                              disabled={!isEditing}
                              className="min-w-[80px] text-xs"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={material.source ?? ''}
                              onChange={e => updateMaterial(index, 'source', e.target.value || null)}
                              disabled={!isEditing}
                              className="min-w-[100px] text-xs"
                              placeholder="Source"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1">
                              <Select
                                disabled={!isEditing}
                                value={material.recyclable === null ? undefined : material.recyclable ? 'true' : 'false'}
                                onValueChange={val => updateMaterial(index, 'recyclable', val === 'true')}
                              >
                                <SelectTrigger className="h-8 min-w-[80px] text-xs">
                                  <SelectValue placeholder="-" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Yes</SelectItem>
                                  <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                              </Select>
                              {isEditing && material.recyclable !== null && (
                                <Button
                                  type="button"
                                  onClick={() => updateMaterial(index, 'recyclable', null)}
                                  variant="secondary"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  aria-label="Clear recyclable"
                                >
                                  <X size={12} weight="bold" />
                                </Button>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1">
                              <Select
                                disabled={!isEditing}
                                value={material.renewable === null ? undefined : material.renewable ? 'true' : 'false'}
                                onValueChange={val => updateMaterial(index, 'renewable', val === 'true')}
                              >
                                <SelectTrigger className="h-8 min-w-[80px] text-xs">
                                  <SelectValue placeholder="-" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Yes</SelectItem>
                                  <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                              </Select>
                              {isEditing && material.renewable !== null && (
                                <Button
                                  type="button"
                                  onClick={() => updateMaterial(index, 'renewable', null)}
                                  variant="secondary"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  aria-label="Clear renewable"
                                >
                                  <X size={12} weight="bold" />
                                </Button>
                              )}
                            </div>
                          </td>
                          {isEditing && (
                            <td className="px-3 py-2">
                              <Button
                                type="button"
                                onClick={() => removeMaterial(index)}
                                variant="secondary"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Trash size={14} weight="bold" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </form>

      {/* Display Complex Fields (Read-only preview) */}
      {materialCompositionDetail?.data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">Material Details</h3>

          {/* Primary Materials */}
          {materialCompositionDetail.data.primaryMaterials && materialCompositionDetail.data.primaryMaterials.length > 0 && (
            <div>
              <Label>Primary Materials</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {materialCompositionDetail.data.primaryMaterials.map(material => (
                  <span
                    key={material}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
