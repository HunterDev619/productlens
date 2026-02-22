'use client';

import { CheckCircle, Cube, Package } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import React from 'react';
import { ComponentsBreakdown } from '@/components/components-breakdown';
import { Badge, Tooltip, TooltipProvider } from '@/components/ui';
import { useImageUrl } from '@/services/images/use-image-url';
import { useGetProductSpecificationV3Detail } from '@/services/product-specifications-v3/detail';
import { formatWeightValue } from '@/utils/namespaces/format';
// import DataSources from './data-sources';

export default function ProductSpecifications() {
  const { id } = useParams();
  const { data: productSpecificationV3Detail, isLoading, error } = useGetProductSpecificationV3Detail(id as string);
  const productData = productSpecificationV3Detail?.data;
  const imageUrl = useImageUrl(productData?.imageId as string);
  const dataSources = productData?.dataSources;
  // Tooltip content for Model and Lifespan badges
  const tooltipContent = React.useMemo(() => {
    if (!productData) {
      return (
        <div className="text-left">
          <div className="font-semibold">Product Name</div>
          <div className="text-xs opacity-90">SKU: N/A</div>
        </div>
      );
    }
    const productName = productData.productName || productData.productGeneralName || 'Product Name';
    const sku = productData.skuNumber || 'N/A';
    return (
      <div className="text-left">
        <div className="font-semibold">{productName}</div>
        <div className="text-xs opacity-90">
          SKU:
          {' '}
          {sku}
        </div>
      </div>
    );
  }, [productData]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6 lg:p-8">
            <div className="mb-4 h-48 w-full animate-pulse rounded-lg bg-gray-100 sm:mb-6 sm:h-64" />
            <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200 sm:h-8" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-gray-100 sm:mt-4" />
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6 lg:p-8">
            <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200 sm:h-8" />
            <div className="mt-3 h-24 animate-pulse rounded bg-gray-100 sm:mt-4 sm:h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !productData) {
    return null;
  }

  const productInfo = productData.productInformation;
  const productSpecs = productData.productSpecifications;

  return (
    <div className="mx-auto space-y-5 sm:space-y-7 lg:space-y-9">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Left Column - Product Information */}
        <div className="space-y-4 sm:space-y-6">
          {/* Product Image and Basic Info */}
          <div className="h-full rounded-xl border bg-white p-5 shadow-sm sm:p-7 lg:p-9">
            {/* Product Image */}
            {imageUrl && (
              <div className="relative mb-4 h-48 w-full sm:mb-6 sm:h-64">
                <Image
                  src={imageUrl || '/assets/images/no-image.webp'}
                  alt={productData.productName}
                  fill
                  className="rounded-lg object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            )}

            {/* Product Name and Details */}
            <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-5 sm:text-3xl lg:text-4xl">
              {productData.productGeneralName || productData.productName || 'Unknown Product'}
            </h2>

            {/* Manufacturer and Origin */}
            {(productData.manufacturer || productData.origin) && (
              <div className="mb-3 flex flex-wrap gap-2 text-sm text-gray-600 sm:mb-4">
                {productData.manufacturer && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Manufacturer:</span>
                    <span>{productData.manufacturer}</span>
                  </span>
                )}
                {productData.manufacturer && productData.origin && (
                  <span className="text-gray-400">•</span>
                )}
                {productData.origin && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Origin:</span>
                    <span>{productData.origin}</span>
                  </span>
                )}
              </div>
            )}

            {/* Missing Manufacturer/Origin Warning */}
            {!productData.manufacturer && !productData.origin && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 sm:mb-4 sm:text-sm">
                Thiếu manufacturer, origin
              </div>
            )}

            {/* Categories */}
            {productData.categoryName && productData.categoryName.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2 sm:mb-5 sm:gap-3">
                {productData.categoryName.map((category: string, index: number) => (
                  <Badge
                    key={`category-${category}-${index}`}
                    variant="secondary"
                    className="bg-blue-50 text-xs text-blue-700 sm:text-sm"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            )}

            {/* Model and Lifespan */}
            <TooltipProvider>
              <div className="mb-4 flex flex-wrap gap-2 sm:mb-5 sm:gap-3">
                {productData.skuNumber && (
                  // @ts-expect-error - Tooltip content type issue with Radix UI
                  <Tooltip content={tooltipContent}>
                    <Badge
                      variant="secondary"
                      className="cursor-help bg-purple-50 text-xs text-purple-700 sm:text-sm"
                    >
                      <span className="hidden sm:inline">Model: </span>
                      {productData.skuNumber}
                    </Badge>
                  </Tooltip>
                )}
                {productData.lifespan && (
                  // @ts-expect-error - Tooltip content type issue with Radix UI
                  <Tooltip content={tooltipContent}>
                    <Badge
                      variant="secondary"
                      className="cursor-help bg-green-50 text-xs text-green-700 sm:text-sm"
                    >
                      {productData.lifespan}
                      {' '}
                      <span className="mx-1 hidden sm:inline">years</span>
                      lifespan
                    </Badge>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>

            {/* Total Weight */}
            {productData.totalWeight && (
              <div className="mb-4 flex items-center gap-2 text-base text-gray-700 sm:mb-5">
                <Package className="h-4 w-4 flex-shrink-0 text-purple-600 sm:h-5 sm:w-5" />
                <span className="text-xs font-medium sm:text-sm">
                  {formatWeightValue(productData.totalWeight)}
                  {' '}
                  {productData.totalWeightUnit || 'kg'}
                  {' '}
                  <span className="hidden sm:inline">total weight</span>
                </span>
              </div>
            )}

            {/* Environmental Alignment / Carbon Footprint Calculation */}
            {productInfo?.alignment_summary && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 sm:p-5">
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle
                    className="h-4 w-4 flex-shrink-0 text-green-600 sm:h-5 sm:w-5"
                    weight="fill"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-green-800 sm:text-base">
                      {productInfo.alignment_summary}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Product Description */}
            <p className="mt-3 text-sm text-gray-700 sm:mt-4 sm:text-base">
              {productInfo?.assessment_description || (
                <>
                  A
                  {' '}
                  {productData.productGeneralName?.toLowerCase() || 'product'}
                  {' '}
                  designed for
                  {' '}
                  {productData.categoryName?.[0]?.toLowerCase() || 'various applications'}
                  {' '}
                  with multiple functionalities and capabilities.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right Column - Specifications & Pricing */}
        <div className="space-y-4 sm:space-y-6">
          {/* Specifications & Pricing Card */}
          <div className="h-full rounded-xl border bg-white p-5 shadow-sm sm:p-7 lg:p-9">
            <div className="mb-4 flex items-center gap-2 sm:mb-6">
              <Cube className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
              <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Specifications & Pricing
              </h3>
            </div>
            <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
              AI-driven market analysis and technical specifications
            </p>

            {/* Market Price */}
            {productData.marketPrice && productData.marketPrice.length > 0 && productData.marketPrice.every((price: any) => price !== null) && (
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-900 sm:mb-3 sm:text-lg">
                      Market Price (USD)
                    </p>
                  </div>
                </div>
                {productData.marketPrice.length > 1 && (
                  <p className="flex items-center gap-2 text-sm sm:text-base">
                    <CheckCircle
                      className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-600 sm:h-4 sm:w-4"
                      weight="fill"
                    />
                    Range:
                    {' '}
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                      Number(productData.marketPrice?.[0] ?? 0),
                    )}
                    {' '}
                    -
                    {' '}
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                      Number(productData.marketPrice?.[1] ?? 0),
                    )}
                  </p>
                )}
                {productInfo?.price_positioning && (
                  <p className="mt-1 text-sm text-green-700 sm:text-base">
                    Positioning:
                    {' '}
                    {productInfo.price_positioning}
                  </p>
                )}
              </div>
            )}

            {/* Key Features */}
            {productSpecs?.key_features && productSpecs.key_features.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h4 className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-900 sm:mb-3 sm:text-lg">
                  {/* <CheckCircle
                    className="h-4 w-4 text-green-600 sm:h-5 sm:w-5"
                    weight="fill"
                  /> */}
                  Key Features
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {productSpecs.key_features
                    .slice(0, 5)
                    .map((feature: string, index: number) => (
                      <li
                        key={`feature-${index}-${feature.substring(0, 20)}`}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle
                          className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-600 sm:h-4 sm:w-4"
                          weight="fill"
                        />
                        <span className="text-sm text-gray-700 sm:text-base">
                          {feature}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Technical Specifications */}
            <div className="mb-4 sm:mb-6">
              <h4 className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-900 sm:mb-3 sm:text-lg">
                <Package className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                Technical Specifications
              </h4>
              <div className="space-y-2 sm:space-y-3">
                {!!productSpecs?.dimensions && productSpecs.dimensions.length > 0 && productSpecs.dimensions.every((dimension: number) => dimension !== null) && (
                  <div className="flex flex-col gap-1 text-base sm:flex-row sm:justify-between sm:text-base">
                    <span className="text-gray-600">Dimensions (L×W×H):</span>
                    <span className="font-medium break-words text-gray-900 sm:text-right">
                      {Array.isArray(productSpecs.dimensions)
                        ? productSpecs.dimensions.join(' × ')
                        : productSpecs.dimensions}
                      {' '}
                      {productSpecs.dimensionsUnit || productSpecs.dimensions_unit || 'm'}
                    </span>
                  </div>
                )}
                {!!productSpecs?.total_capacity && (
                  <div className="flex flex-col gap-1 text-base sm:flex-row sm:justify-between sm:text-base">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium break-words text-gray-900 sm:text-right">
                      {productSpecs.total_capacity}
                      {' '}
                      {productSpecs.total_capacity_unit}
                    </span>
                  </div>
                )}
                {!!productSpecs?.energy_consumption && (
                  <div className="flex flex-col gap-1 text-base sm:flex-row sm:justify-between sm:text-base">
                    <span className="text-gray-600">Energy Consumption:</span>
                    <span className="font-medium break-words text-gray-900 sm:text-right">
                      {productSpecs.energy_consumption}
                      {' '}
                      {productSpecs.energy_consumption_unit}
                    </span>
                  </div>
                )}
                {!!productData.totalWeight && (
                  <div className="flex flex-col gap-1 text-base sm:flex-row sm:justify-between sm:text-base">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium break-words text-gray-900 sm:text-right">
                      {formatWeightValue(productData.totalWeight)}
                      {' '}
                      {productData.totalWeightUnit || 'kg'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Market Data Sources */}
            {dataSources && dataSources.length > 0 && (
              <div>
                <h5 className="mb-1.5 text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  Market Data Sources
                </h5>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {dataSources
                    .slice(0, 3)
                    .map((source: any, index: number) => (
                      <Link href={source.source_url as string} target="_blank" rel="noopener noreferrer" key={`source-${index}-${source.source_title}`}>
                        <Badge
                          key={`source-${index}-${source.source_title}`}
                          variant="secondary"
                          className="text-xs"
                        >
                          {source.source_title || `Source ${index + 1}`}
                        </Badge>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Sources */}
      {/* {dataSources && dataSources.length > 0 && (
        <DataSources dataSources={dataSources} />
      )} */}

      <ComponentsBreakdown list_of_parts={productData?.productSpecifications?.list_of_parts || []} />
    </div>
  );
}
