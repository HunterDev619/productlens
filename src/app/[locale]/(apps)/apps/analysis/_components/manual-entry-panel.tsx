'use client';

import type { FindProductSpecificationsV2Response, MaterialJson, ProductBody } from '@/services/ai/find-product-specifications-v2';
import { CircleNotch, Plus, Trash } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import React from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import { Button, Checkbox, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/components/ui';
import { toast } from '@/hooks/use-toast';
import { queryClient } from '@/libs/query-client';
import { useImportProductData } from '@/services/ai/find-product-specifications-v2';
import { cn } from '@/utils';

export type MaterialFormValue = {
  material_name: string | null;
  origin: string | null;
  weight: number | null;
  percentage: number | null;
  carbon_factor: number | null;
  material_type: string | null; // Material category (Metal, Plastic, Foam, etc.) - will be used for both material_type and type
  recyclable: boolean | null;
  renewable: boolean | null;
  source: string | null;
};

export type ManualFormValues = {
  product_specific_name: string | null;
  product_name: string | null;
  market_price_min: number | null;
  market_price_max: number | null;
  manufacturer: string | null;
  SKU_number: string | null;
  origin: string | null;
  lifespan: number | null;
  total_weight: number | null;
  total_weight_unit: string | null;
  key_features: string | null;
  dimensions_length: number | null;
  dimensions_width: number | null;
  dimensions_height: number | null;
  dimensions_unit: string | null;
  energy_consumption: number | null;
  energy_consumption_unit: string | null;
  total_carbon_footprint: number | null;
  carbon_footprint_unit: string | null;
  materials: MaterialFormValue[];
};

type ManualEntryPanelProps = {
  onSuccessAction: (data: FindProductSpecificationsV2Response['data']) => Promise<void> | void;
  onSavedValuesAction: (values: ManualFormValues) => void;
  onLoadingChangeAction?: (loading: boolean) => void;
};

const FORM_STORAGE_KEY = 'manual-entry-form-values';

const getStoredFormValues = (): Partial<ManualFormValues> | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const stored = localStorage.getItem(FORM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load form values from localStorage:', error);
  }
  return null;
};

const saveFormValues = (values: ManualFormValues) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(values));
  } catch (error) {
    console.error('Failed to save form values to localStorage:', error);
  }
};

const clearFormValues = () => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.removeItem(FORM_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear form values from localStorage:', error);
  }
};

const defaultFormValues: ManualFormValues = {
  product_specific_name: null,
  product_name: null,
  market_price_min: null,
  market_price_max: null,
  manufacturer: '',
  SKU_number: null,
  origin: null,
  lifespan: null,
  total_weight: null,
  total_weight_unit: null,
  key_features: '',
  dimensions_length: null,
  dimensions_width: null,
  dimensions_height: null,
  dimensions_unit: null,
  energy_consumption: null,
  energy_consumption_unit: null,
  total_carbon_footprint: null,
  carbon_footprint_unit: null,
  materials: [],
};

const validateRequiredNumber = (label: string) => (value: any) => {
  const isEmpty = value === '' || value === null || typeof value === 'undefined';
  if (isEmpty) {
    return `${label} is required`;
  }

  const parsedValue = value;

  if (!Number.isFinite(parsedValue)) {
    return `${label} must be a valid number`;
  }

  if (parsedValue === 0) {
    return `${label} cannot be 0`;
  }

  if (parsedValue < 0) {
    return `${label} must be greater than 0`;
  }

  return true;
};

export default function ManualEntryPanel({ onSuccessAction, onSavedValuesAction, onLoadingChangeAction }: ManualEntryPanelProps) {
  const hasLoadedFormValuesRef = React.useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ManualFormValues>({
    defaultValues: defaultFormValues,
  });

  // Load form values from localStorage on mount
  React.useEffect(() => {
    const storedValues = getStoredFormValues();
    if (storedValues) {
      reset({ ...defaultFormValues, ...storedValues });
    }
    hasLoadedFormValuesRef.current = true;
  }, [reset]);

  // Save form values to localStorage when form values change
  React.useEffect(() => {
    const subscription = watch((values) => {
      if (!hasLoadedFormValuesRef.current) {
        return;
      }
      saveFormValues(values as ManualFormValues);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'materials',
  });

  const materials = watch('materials');
  const watchedTotalWeight = watch('total_weight');

  // Function to auto-calculate percentages based on total weight
  const recalculatePercentages = React.useCallback(() => {
    const currentMaterials = watch('materials');
    const formTotalWeight = Number(watch('total_weight')) || 0;

    if (formTotalWeight > 0) {
      currentMaterials.forEach((material, index) => {
        const weight = Number(material.weight) || 0;
        if (weight > 0) {
          const percentage = (weight / formTotalWeight) * 100;
          setValue(`materials.${index}.percentage` as const, Number(percentage.toFixed(2)), {
            shouldValidate: false,
            shouldDirty: false,
          });
        } else {
          setValue(`materials.${index}.percentage` as const, 0, {
            shouldValidate: false,
            shouldDirty: false,
          });
        }
      });
    } else {
      currentMaterials.forEach((_, index) => {
        setValue(`materials.${index}.percentage` as const, 0, {
          shouldValidate: false,
          shouldDirty: false,
        });
      });
    }
  }, [watch, setValue]);

  // Auto-recalculate percentages when materials or total weight change
  React.useEffect(() => {
    recalculatePercentages();
  }, [materials, watchedTotalWeight, recalculatePercentages]);

  const { mutateAsync: importProductData, loading } = useImportProductData();
  const abortControllerRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    onLoadingChangeAction?.(loading);
  }, [loading, onLoadingChangeAction]);

  const buildPayload = (values: ManualFormValues): ProductBody => {
    const formTotalWeight = values.total_weight || 0;

    // Use user-entered percentage for each material
    const materialsWithPercentage = values.materials.map((material): MaterialJson => {
      const rawPercentage = typeof material.percentage === 'number'
        ? material.percentage
        : Number(material.percentage) || 0;
      const clampedPercentage = Math.min(Math.max(rawPercentage, 0), 100);

      return {
        source: material.source,
        material_name: material.material_name,
        type: material.material_type?.toLowerCase() || null, // type = material_type in lowercase
        origin: material.origin,
        weight: material.weight,
        percentage: Number(clampedPercentage.toFixed(2)),
        carbon_factor: material.carbon_factor,
        material_type: material.material_type,
        recyclable: material.recyclable,
        renewable: material.renewable,
      };
    });

    return {
      product_name: values.product_name,
      market_price: [values.market_price_min, values.market_price_max],
      category_name: [], // Set to empty array
      manufacturer: values.manufacturer,
      SKU_number: values.SKU_number,
      origin: values.origin,
      lifespan: values.lifespan,
      total_weight: formTotalWeight,
      key_features: values.key_features ? values.key_features.split(',').map(f => f.trim()).filter(f => f) : [],
      total_capacity: null, // Set to null
      total_capacity_unit: '', // Set to empty string
      dimensions: [values.dimensions_length, values.dimensions_width, values.dimensions_height],
      dimensions_unit: values.dimensions_unit,
      energy_consumption: values.energy_consumption,
      energy_consumption_unit: values.energy_consumption_unit,
      total_carbon_footprint: values.total_carbon_footprint,
      carbon_footprint_unit: values.carbon_footprint_unit,
      materials_json: materialsWithPercentage,
    };
  };

  const onSubmit = async (values: ManualFormValues) => {
    if (!values.materials || values.materials.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one material entry before submitting.',
        variant: 'error',
      });
      return;
    }
    // Validate that sum of material weights equals total weight
    const materialsTotalWeight = values.materials.reduce(
      (sum, material) => sum + (Number(material.weight) || 0),
      0,
    );
    const formTotalWeight = values.total_weight || 0;
    const tolerance = Math.max(formTotalWeight * 0.01, 0.01); // 1% or 0.01 units

    if (Math.abs(materialsTotalWeight - formTotalWeight) > tolerance) {
      toast({
        title: 'Validation Error',
        description: 'Total weight does not match the sum of material weights.',
        variant: 'error',
      });
      return;
    }

    // Validate total percentage of all materials equals 100%
    // if (values.materials && values.materials.length > 0) {
    //   const totalPercentage = values.materials.reduce(
    //     (sum, material) => sum + (Number(material.percentage) || 0),
    //     0,
    //   );
    //   const tolerance = 0.01;
    //   if (Math.abs(totalPercentage - 100) > tolerance) {
    //     setErrorMessage('Total percentage of all materials must equal 100%.');
    //     return;
    //   }
    // }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      const payload = buildPayload(values);
      const response = await importProductData({
        ...payload,
        signal: abortControllerRef.current.signal,
      });
      if (response.data) {
        onSavedValuesAction(values);
        await onSuccessAction(response.data);
        await queryClient.invalidateQueries();
        reset(defaultFormValues);
        clearFormValues();
      }
    } catch (error: any) {
      // Ignore abort errors
      if (error?.name === 'AbortError' || error?.message?.includes('aborted') || error?.code === 'ERR_CANCELED') {
        return;
      }
      toast({
        title: 'Error',
        description: error?.message || 'Failed to save manual entry',
        variant: 'error',
      });
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleReset = () => {
    reset(defaultFormValues);
    clearFormValues();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  // const imageUrl = watch('image_url');

  // Validate URL
  // const isValidUrl = React.useMemo(() => {
  //   if (!imageUrl || imageUrl.trim() === '') {
  //     return false;
  //   }
  //   try {
  //     const url = new URL(imageUrl);
  //     const isHttp = url.protocol === 'http:' || url.protocol === 'https:';
  //     const extensionPattern = /\.(?:jpe?g|jped|png|avif)(?:$|\?)/i;
  //     const hasAllowedExtension = extensionPattern.test(`${url.pathname}${url.search}`);
  //     return isHttp && hasAllowedExtension;
  //   } catch {
  //     return false;
  //   }
  // }, [imageUrl]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Image URL */}

      {/* Product Information */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Product Information</h3>
        <div className="grid gap-4 sm:grid-cols-1">
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Product Name
              {' '}
              <span className="text-red-500">*</span>
              <Input
                type="text"
                {...register('product_name', { required: 'Product name is required' })}
                hasError={!!errors.product_name}
                className="mt-1"
              />
            </Label>
            {errors.product_name && (
              <p className="mt-1 text-xs text-red-600">{errors.product_name.message}</p>
            )}
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Manufacturer
              {' '}
              <Input
                type="text"
                {...register('manufacturer')}
                hasError={!!errors.manufacturer}
                className="mt-1"
              />
            </Label>
            {errors.manufacturer && (
              <p className="mt-1 text-xs text-red-600">{errors.manufacturer.message}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              SKU Number
              <Input
                type="text"
                {...register('SKU_number')}
                hasError={!!errors.SKU_number}
                className="mt-1"
              />
            </Label>
            {errors.SKU_number && (
              <p className="mt-1 text-xs text-red-600">{errors.SKU_number.message}</p>
            )}
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Location of Product Manufacturer
              {' '}
              <span className="text-red-500">*</span>
              <Input
                type="text"
                {...register('origin', { required: 'Location of product manufacturer is required' })}
                hasError={!!errors.origin}
                className="mt-1"
              />
            </Label>
            {errors.origin && (
              <p className="mt-1 text-xs text-red-600">{errors.origin.message}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Lifespan (years)
              {' '}
              <span className="text-red-500">*</span>
              <Controller
                name="lifespan"
                control={control}
                rules={{ validate: validateRequiredNumber('Lifespan') }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="0.0"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^[\d.]*$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value === '') {
                        field.onChange(0);
                      } else {
                        const parsed = Number.parseFloat(value);
                        const numValue = Number.isNaN(parsed) ? 0 : Number.parseFloat(parsed.toFixed(4));
                        field.onChange(numValue);
                      }
                      field.onBlur();
                    }}
                    hasError={!!errors.lifespan}
                    className="mt-1"
                  />
                )}
              />
            </Label>
            {errors.lifespan && (
              <p className="mt-1 text-xs text-red-600">{errors.lifespan.message}</p>
            )}
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Min Market Price ($)
              <Controller
                name="market_price_min"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="0.00"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty, numbers, and partial decimals like "0.", "0.0", etc
                      if (value === '' || /^\d*(?:\.\d*)?$/.test(value)) {
                        field.onChange(value); // Keep as string during typing
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value === '') {
                        field.onChange(null);
                      } else {
                        const parsed = Number.parseFloat(value);
                        const numValue = Number.isNaN(parsed) ? null : Number.parseFloat(parsed.toFixed(4));
                        field.onChange(numValue);
                      }
                      field.onBlur();
                    }}
                    hasError={!!errors.market_price_min}
                    className="mt-1"
                  />
                )}
              />
            </Label>
            {errors.market_price_min && (
              <p className="mt-1 text-xs text-red-600">{errors.market_price_min.message}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Max Market Price ($)
              <Controller
                name="market_price_max"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="0.00"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*(?:\.\d*)?$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value === '') {
                        field.onChange(null);
                      } else {
                        const parsed = Number.parseFloat(value);
                        const numValue = Number.isNaN(parsed) ? null : Number.parseFloat(parsed.toFixed(4));
                        field.onChange(numValue);
                      }
                      field.onBlur();
                    }}
                    hasError={!!errors.market_price_max}
                    className="mt-1"
                  />
                )}
              />
            </Label>
            {errors.market_price_max && (
              <p className="mt-1 text-xs text-red-600">{errors.market_price_max.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Physical Specifications */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Physical Specifications</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Total Weight
              {' '}
              <span className="text-red-500">*</span>
              <Controller
                name="total_weight"
                control={control}
                rules={{ validate: validateRequiredNumber('Total weight') }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="0.00"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^[\d.]*$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value === '') {
                        field.onChange(0);
                      } else {
                        const parsed = Number.parseFloat(value);
                        const numValue = Number.isNaN(parsed) ? 0 : Number.parseFloat(parsed.toFixed(4));
                        field.onChange(numValue);
                      }
                      field.onBlur();
                    }}
                    className="mt-1"
                    hasError={!!errors.total_weight}
                  />
                )}
              />
            </Label>
            {errors.total_weight && (
              <p className="mt-1 text-xs text-red-600">{errors.total_weight.message}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Weight Unit
              <Controller
                name="total_weight_unit"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="lb">lb</SelectItem>
                      <SelectItem value="oz">oz</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Label>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Length
              {' '}
              <Controller
                name="dimensions_length"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="0.00"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^[\d.]*$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value === '') {
                        field.onChange(null);
                      } else {
                        const parsed = Number.parseFloat(value);
                        const numValue = Number.isNaN(parsed) ? null : Number.parseFloat(parsed.toFixed(4));
                        field.onChange(numValue);
                      }
                      field.onBlur();
                    }}
                    hasError={!!errors.dimensions_length}
                    className="mt-1"
                  />
                )}
              />
            </Label>
            {errors.dimensions_length && (
              <p className="mt-1 text-xs text-red-600">{errors.dimensions_length.message}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Width
              {' '}
              <Controller
                name="dimensions_width"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="0.00"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^[\d.]*$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value === '') {
                        field.onChange(null);
                      } else {
                        const parsed = Number.parseFloat(value);
                        const numValue = Number.isNaN(parsed) ? null : Number.parseFloat(parsed.toFixed(4));
                        field.onChange(numValue);
                      }
                      field.onBlur();
                    }}
                    hasError={!!errors.dimensions_width}
                    className="mt-1"
                  />
                )}
              />
            </Label>
            {errors.dimensions_width && (
              <p className="mt-1 text-xs text-red-600">{errors.dimensions_width.message}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Height
              {' '}
              <Controller
                name="dimensions_height"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="0.00"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^[\d.]*$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value === '') {
                        field.onChange(null);
                      } else {
                        const parsed = Number.parseFloat(value);
                        const numValue = Number.isNaN(parsed) ? null : Number.parseFloat(parsed.toFixed(4));
                        field.onChange(numValue);
                      }
                      field.onBlur();
                    }}
                    hasError={!!errors.dimensions_height}
                    className="mt-1"
                  />
                )}
              />
            </Label>
            {errors.dimensions_height && (
              <p className="mt-1 text-xs text-red-600">{errors.dimensions_height.message}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Dimensions Unit
              <Controller
                name="dimensions_unit"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm">mm</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="km">km</SelectItem>
                      <SelectItem value="in">in</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                      <SelectItem value="yd">yd</SelectItem>
                      <SelectItem value="mi">mi</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Label>
          </div>
        </div>
      </div>

      {/* Materials */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Materials</h3>
          <Button
            type="button"
            onClick={() => append({
              material_name: '',
              origin: '',
              weight: 0,
              percentage: 0,
              carbon_factor: 0,
              material_type: '',
              recyclable: false,
              renewable: false,
              source: '',
            })}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm"
          >
            <Plus size={16} />
            Add Material
          </Button>
        </div>
        {fields.length === 0 && (
          <p className="text-sm text-gray-500">No materials added. Click "Add Material" to add one.</p>
        )}
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border border-gray-300 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700">
                  Material
                  {' '}
                  {index + 1}
                </h4>
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash size={16} />
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Material Name
                    {' '}
                    <span className="text-red-500">*</span>
                    <Input
                      type="text"
                      {...register(`materials.${index}.material_name` as const, { required: 'Material name is required' })}
                      hasError={!!errors.materials?.[index]?.material_name}
                      className="mt-1"
                    />
                  </Label>
                  {errors.materials?.[index]?.material_name && (
                    <p className="mt-1 text-xs text-red-600">{errors.materials[index]?.material_name?.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Material Type
                    {' '}
                    <span className="text-red-500">*</span>
                    <span className="ml-1 text-xs font-normal text-gray-500">(e.g., metal, plastic, foam)</span>
                    <Input
                      type="text"
                      placeholder="metal, plastic, foam..."
                      {...register(`materials.${index}.material_type` as const, { required: 'Material type is required' })}
                      hasError={!!errors.materials?.[index]?.material_type}
                      className="mt-1"
                    />
                  </Label>
                  {errors.materials?.[index]?.material_type && (
                    <p className="mt-1 text-xs text-red-600">{errors.materials[index]?.material_type?.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Material Origin
                    {' '}
                    <span className="text-rose-500">*</span>
                    <Input
                      type="text"
                      placeholder="e.g., US, China"
                      {...register(`materials.${index}.origin` as const, {
                        required: 'Material origin is required',
                        minLength: {
                          value: 2,
                          message: 'Material origin must be at least 2 characters',
                        },
                      })}
                      hasError={!!errors.materials?.[index]?.origin}
                      className="mt-1"
                    />
                  </Label>
                  {errors.materials?.[index]?.origin && (
                    <p className="mt-1 text-xs text-rose-600">{errors.materials[index]?.origin?.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor={`material-weight-${index}`} className="text-sm font-semibold text-gray-700">
                    Weight
                    {' '}
                    <span className="text-red-500">*</span>
                    <Controller
                      name={`materials.${index}.weight` as const}
                      control={control}
                      rules={{ validate: validateRequiredNumber('Weight') }}
                      render={({ field }) => (
                        <Input
                          id={`material-weight-${index}`}
                          type="text"
                          placeholder="0.00"
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || /^[\d.]*$/.test(value)) {
                              field.onChange(value);
                            }
                            // Trigger recalculation when weight changes
                            setTimeout(() => {
                              recalculatePercentages();
                            }, 0);
                          }}
                          onBlur={(e) => {
                            const value = e.target.value.trim();
                            if (value === '') {
                              field.onChange(0);
                            } else {
                              const parsed = Number.parseFloat(value);
                              const numValue = Number.isNaN(parsed) ? 0 : Number.parseFloat(parsed.toFixed(4));
                              field.onChange(numValue);
                            }
                            field.onBlur();
                          }}
                          hasError={!!errors.materials?.[index]?.weight}
                          className="mt-1"
                        />
                      )}
                    />
                  </Label>
                  {errors.materials?.[index]?.weight && (
                    <p className="mt-1 text-xs text-red-600">{errors.materials[index]?.weight?.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Percentage (%)
                    {' '}
                    <span className="text-xs font-normal text-gray-500">(auto-calculated)</span>
                    <Input
                      type="text"
                      {...register(`materials.${index}.percentage` as const, {
                        valueAsNumber: true,
                        min: { value: 0, message: 'Percentage must be at least 0' },
                        max: { value: 100, message: 'Percentage cannot exceed 100' },
                      })}
                      className="mt-1 bg-gray-100"
                      hasError={!!errors.materials?.[index]?.percentage}
                      readOnly
                    />
                  </Label>
                  {errors.materials?.[index]?.percentage && (
                    <p className="mt-1 text-xs text-red-600">{errors.materials[index]?.percentage?.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Carbon Emission Factor
                    {' '}
                    <span className="text-red-500">*</span>
                    <Controller
                      name={`materials.${index}.carbon_factor` as const}
                      control={control}
                      rules={{ validate: validateRequiredNumber('Carbon factor') }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="0.00"
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || /^[\d.]*$/.test(value)) {
                              field.onChange(value);
                            }
                          }}
                          onBlur={(e) => {
                            const value = e.target.value.trim();
                            if (value === '') {
                              field.onChange(0);
                            } else {
                              const parsed = Number.parseFloat(value);
                              const numValue = Number.isNaN(parsed) ? 0 : Number.parseFloat(parsed.toFixed(4));
                              field.onChange(numValue);
                            }
                            field.onBlur();
                          }}
                          hasError={!!errors.materials?.[index]?.carbon_factor}
                          className="mt-1"
                        />
                      )}
                    />
                  </Label>
                  {errors.materials?.[index]?.carbon_factor && (
                    <p className="mt-1 text-xs text-red-600">{errors.materials[index]?.carbon_factor?.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Source of Reference
                    {' '}
                    <span className="text-red-500">*</span>
                    <Input
                      type="text"
                      placeholder="Dataset, supplier report, etc."
                      {...register(`materials.${index}.source` as const, {
                        required: 'Source of reference is required',
                        minLength: { value: 2, message: 'Source must be at least 2 characters' },
                      })}
                      hasError={!!errors.materials?.[index]?.source}
                      className="mt-1"
                    />
                  </Label>
                  {errors.materials?.[index]?.source && (
                    <p className="mt-1 text-xs text-red-600">{errors.materials[index]?.source?.message}</p>
                  )}
                </div>
                <div className="col-span-2 mt-2 flex items-center gap-4">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Controller
                      name={`materials.${index}.recyclable` as const}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    Recyclable
                  </Label>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Controller
                      name={`materials.${index}.renewable` as const}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    Renewable
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Energy & Environmental */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Energy & Environmental</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Energy Consumption
              {' '}
              <Controller
                name="energy_consumption"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="0.00"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^[\d.]*$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value === '') {
                        field.onChange(null);
                      } else {
                        const parsed = Number.parseFloat(value);
                        const numValue = Number.isNaN(parsed) ? null : Number.parseFloat(parsed.toFixed(4));
                        field.onChange(numValue);
                      }
                      field.onBlur();
                    }}
                    hasError={!!errors.energy_consumption}
                    className="mt-1"
                  />
                )}
              />
            </Label>
            {errors.energy_consumption && (
              <p className="mt-1 text-xs text-red-600">{errors.energy_consumption.message}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Energy Unit
              <Controller
                name="energy_consumption_unit"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kWh">kWh</SelectItem>
                      <SelectItem value="Wh">Wh</SelectItem>
                      <SelectItem value="J">J</SelectItem>
                      <SelectItem value="MJ">MJ</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Label>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Total Carbon Footprint
              {' '}
              <Controller
                name="total_carbon_footprint"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="0.00"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^[\d.]*$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value === '') {
                        field.onChange(null);
                      } else {
                        const parsed = Number.parseFloat(value);
                        const numValue = Number.isNaN(parsed) ? null : Number.parseFloat(parsed.toFixed(4));
                        field.onChange(numValue);
                      }
                      field.onBlur();
                    }}
                    hasError={!!errors.total_carbon_footprint}
                    className="mt-1"
                  />
                )}
              />
            </Label>
            {errors.total_carbon_footprint && (
              <p className="mt-1 text-xs text-red-600">{errors.total_carbon_footprint.message}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Carbon Footprint Unit
              <Controller
                name="carbon_footprint_unit"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg CO₂e">kg CO₂e</SelectItem>
                      <SelectItem value="g CO₂e">g CO₂e</SelectItem>
                      <SelectItem value="t CO₂e">t CO₂e</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Label>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Key Features</h3>
        <div>
          <Label className="text-sm font-semibold text-gray-700">
            Key Features (comma-separated)
            <Textarea
              {...register('key_features')}
              rows={3}
              hasError={!!errors.key_features}
              className="mt-1"
            />
          </Label>
          {errors.key_features && (
            <p className="mt-1 text-xs text-red-600">{errors.key_features.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        {loading && (
          <motion.button
            type="button"
            onClick={handleCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'group relative w-full rounded-full px-8 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 sm:w-auto sm:px-10 sm:py-4 sm:text-base lg:px-12 lg:text-lg',
              'bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700',
              'hover:shadow-2xl hover:shadow-gray-500/50',
              'cursor-pointer',
            )}
          >
            <span className="relative z-10">Cancel</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.button>
        )}
        {!loading && (
          <motion.button
            type="button"
            onClick={handleReset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'group relative w-full rounded-full px-8 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 sm:w-auto sm:px-10 sm:py-4 sm:text-base lg:px-12 lg:text-lg',
              'bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700',
              'hover:shadow-2xl hover:shadow-gray-500/50',
              'cursor-pointer',
            )}
          >
            <span className="relative z-10">Reset</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.button>
        )}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className={cn(
            'group relative w-full rounded-full px-8 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 sm:w-auto sm:px-10 sm:py-4 sm:text-base lg:px-12 lg:text-lg',
            'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600',
            'hover:shadow-2xl hover:shadow-emerald-500/50',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
            loading ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          {loading
            ? (
                <span className="flex items-center justify-center gap-2">
                  <CircleNotch size={18} className="animate-spin sm:h-[22px] sm:w-[22px]" />
                  Analysing...
                </span>
              )
            : (
                <>
                  <span className="relative z-10">Analyse Product</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 transition-opacity group-hover:opacity-100" />
                </>
              )}
        </motion.button>
      </div>
    </form>
  );
}
