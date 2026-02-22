'use client';

import type { UpdateProductSpecificationDTO } from '@/schemas/admin/product-specification';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CircleNotch, PencilSimple, X } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, TagInput } from '@/components/ui';
import { toast } from '@/hooks/use-toast';
import { UpdateProductSpecificationSchema } from '@/schemas/admin/product-specification';
import { useAdminGetProductSpecificationDetail } from '@/services/admin/product-specifications/detail';
import { useAdminUpdateProductSpecificationMutation } from '@/services/admin/product-specifications/update';

export default function ProductSpecificationsForm() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const { data: productSpecificationDetail, isLoading, refetch } = useAdminGetProductSpecificationDetail(id as string);
  const { mutateAsync: updateProductSpecification, loading: updating } = useAdminUpdateProductSpecificationMutation(id as string);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
  } = useForm<UpdateProductSpecificationDTO>({
    resolver: zodResolver(UpdateProductSpecificationSchema) as any,
    defaultValues: {
      verificationStatus: 'unverified',
    },
  });

  // Load data into form
  useEffect(() => {
    if (productSpecificationDetail?.data) {
      const data = productSpecificationDetail.data;
      reset({
        productName: data.productName,
        productGeneralName: data.productGeneralName || '',
        manufacturer: data.manufacturer || '',
        skuNumber: data.skuNumber || '',
        origin: data.origin || '',
        lifespan: data.lifespan || undefined,
        totalWeight: data.totalWeight?.toString() || '',
        totalWeightUnit: data.totalWeightUnit || '',
        dimensionsUnit: data.dimensionsUnit || '',
        verificationStatus: String(data.verificationStatus || 'unverified'),
        confidenceScore: data.confidenceScore?.toString() || '0.80',
        categoryName: (data.categoryName || []) as any,
        marketPrice: (data.marketPrice?.map(price => String(price)).join(', ') || '') as any,
        dimensions: (data.dimensions?.join(', ') || '') as any,
      });
    }
  }, [productSpecificationDetail, reset]);

  const onSubmit = async (data: UpdateProductSpecificationDTO) => {
    try {
      await updateProductSpecification(data);
      toast({
        title: 'Success',
        description: 'Product specifications updated successfully!',
      });
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product specifications',
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
        <h2 className="text-2xl font-bold text-gray-900">Product Specifications</h2>
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
                  form="product-spec-form"
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
      <form id="product-spec-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Product Name */}
            <div className="md:col-span-2">
              <Label htmlFor="productName">
                Product Name
                {' '}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="productName"
                {...register('productName')}
                disabled={!isEditing}
                hasError={!!errors.productName}
                className="mt-2"
              />
              {errors.productName && (
                <p className="mt-1 text-sm text-red-600">{errors.productName.message}</p>
              )}
            </div>

            {/* Product General Name */}
            <div>
              <Label htmlFor="productGeneralName">General Name</Label>
              <Input
                id="productGeneralName"
                {...register('productGeneralName')}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            {/* Manufacturer */}
            <div>
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                {...register('manufacturer')}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            {/* SKU Number */}
            <div>
              <Label htmlFor="skuNumber">SKU Number</Label>
              <Input
                id="skuNumber"
                {...register('skuNumber')}
                disabled={!isEditing}
                className="mt-2 font-mono"
              />
            </div>

            {/* Origin */}
            <div>
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                {...register('origin')}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            {/* Lifespan */}
            <div>
              <Label htmlFor="lifespan">Lifespan (years)</Label>
              <Input
                id="lifespan"
                type="number"
                {...register('lifespan', { valueAsNumber: true })}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

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

            {/* Dimensions Unit */}
            <div>
              <Label htmlFor="dimensionsUnit">Dimensions Unit</Label>
              <Input
                id="dimensionsUnit"
                {...register('dimensionsUnit')}
                disabled={!isEditing}
                placeholder="cm"
                className="mt-2"
              />
            </div>
          </div>
        </motion.div>

        {/* Verification Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">Verification</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Verification Status */}
            <div>
              <Label htmlFor="verificationStatus">Verification Status</Label>
              <Controller
                name="verificationStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={!isEditing}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="verificationStatus" className="mt-2">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unverified">Unverified</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Confidence Score */}
            <div>
              <Label htmlFor="confidenceScore">Confidence Score</Label>
              <Input
                id="confidenceScore"
                {...register('confidenceScore')}
                disabled={!isEditing}
                placeholder="0.80"
                className="mt-2"
              />
            </div>
          </div>
        </motion.div>

        {/* Additional Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Categories */}
            <div className="md:col-span-2">
              <Label htmlFor="categoryName">Categories</Label>
              <Controller
                name="categoryName"
                control={control}
                render={({ field }) => (
                  <TagInput
                    value={Array.isArray(field.value) ? field.value : []}
                    onChange={field.onChange}
                    disabled={!isEditing}
                    placeholder="Enter categories..."
                    className="mt-2"
                  />
                )}
              />
              <p className="mt-1 text-xs text-gray-500">
                Press Enter or comma to add a category. Click X to remove.
              </p>
            </div>

            {/* Market Price */}
            <div>
              <Label htmlFor="marketPrice">
                Market Price Range
                <span className="ml-2 text-sm font-normal text-gray-500">(Min, Max)</span>
              </Label>
              <Input
                id="marketPrice"
                {...register('marketPrice')}
                disabled={!isEditing}
                placeholder="100, 200"
                className="mt-2"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter minimum and maximum price separated by commas. Example: 100, 200
              </p>
            </div>

            {/* Dimensions */}
            <div>
              <Label htmlFor="dimensions">
                Dimensions
                <span className="ml-2 text-sm font-normal text-gray-500">(Width, Height, Depth)</span>
              </Label>
              <Input
                id="dimensions"
                {...register('dimensions')}
                disabled={!isEditing}
                placeholder="50, 60, 70"
                className="mt-2"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter dimensions separated by commas. Example: 50, 60, 70
              </p>
            </div>
          </div>
        </motion.div>
      </form>
    </div>
  );
}
