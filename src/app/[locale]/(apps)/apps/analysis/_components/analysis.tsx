'use client';

import type { ProductData } from '@/services/ai/find-product-specifications-v2';
import { CheckCircle, Cube, Package } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ComponentsBreakdown } from '@/components/components-breakdown';
import { Badge, Tooltip, TooltipProvider } from '@/components/ui';
import { useDownloadImage } from '@/services/images/download';
import { formatWeightValue } from '@/utils/namespaces/format';

type AnalysisResult = {
  product_data: ProductData | null;
  image_id?: string | null;
  timestamp?: string | null;
};

type AnalysisProps = {
  result: AnalysisResult | null;
};

export default function Analysis({ result }: AnalysisProps) {
  const { data: image } = useDownloadImage(result?.image_id || '');
  const { product_data } = result || {};
  const productInfo
    = product_data?.product_information?.product_information
      || product_data?.product_information;

  // Tooltip content for Model and Lifespan badges
  const tooltipContent = React.useMemo(() => {
    if (!productInfo) {
      return (
        <div className="text-left">
          <div className="font-semibold">Product Name</div>
          <div className="text-xs opacity-90">SKU: N/A</div>
        </div>
      );
    }
    const productName = productInfo?.product_name || productInfo?.product_general_name || 'Product Name';
    const sku = (productInfo as any)?.sku_number || 'N/A';
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
  }, [productInfo]);

  if (!result?.product_data || !product_data) {
    return null;
  }

  const productSpecs = product_data.product_specifications;
  const materialComp = product_data.material_composition;
  const summary
    = materialComp?.summary || materialComp?.material_composition?.summary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mx-auto space-y-5 sm:space-y-7 lg:space-y-9"
    >
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Left Column - Product Information */}
        <div className="space-y-4 sm:space-y-6">
          {/* Product Image and Basic Info */}
          <div className="h-full rounded-xl border bg-white p-5 shadow-sm sm:p-7 lg:p-9">
            {/* Product Image */}
            {image?.url && (
              <div className="relative mb-4 h-48 w-full sm:mb-6 sm:h-56 lg:h-64">
                <Image
                  src={image.url}
                  alt={productInfo?.product_name || 'Product'}
                  fill
                  className="rounded-lg object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            )}

            {/* Product Name and Details */}
            <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-5 sm:text-3xl lg:text-4xl">
              {productInfo?.product_general_name
                || productInfo?.product_name
                || 'Unknown Product'}
            </h2>

            {/* Manufacturer and Origin */}
            {(productInfo?.manufacturer || productInfo?.origin) && (
              <div className="mb-3 flex flex-wrap gap-2 text-sm text-gray-600 sm:mb-4">
                {productInfo?.manufacturer && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Manufacturer:</span>
                    <span>{productInfo.manufacturer}</span>
                  </span>
                )}
                {productInfo?.manufacturer && productInfo?.origin && (
                  <span className="text-gray-400">•</span>
                )}
                {productInfo?.origin && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Origin:</span>
                    <span>{productInfo.origin}</span>
                  </span>
                )}
              </div>
            )}

            {/* Missing Manufacturer/Origin Warning */}
            {!productInfo?.manufacturer && !productInfo?.origin && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 sm:mb-4 sm:text-sm">
                Thiếu manufacturer, origin
              </div>
            )}

            {/* Categories */}
            {productInfo?.category_name
              && productInfo.category_name.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2 sm:mb-5 sm:gap-3">
                {productInfo.category_name.map((category, index) => (
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
                {(productInfo as any)?.sku_number && (
                  // @ts-expect-error - Tooltip content type issue with Radix UI
                  <Tooltip content={tooltipContent}>
                    <Badge
                      variant="secondary"
                      className="cursor-help bg-purple-50 text-xs text-purple-700 sm:text-sm"
                    >
                      <span className="hidden sm:inline">Model: </span>
                      {(productInfo as any).sku_number}
                    </Badge>
                  </Tooltip>
                )}
                {productInfo?.lifespan && (
                  // @ts-expect-error - Tooltip content type issue with Radix UI
                  <Tooltip content={tooltipContent}>
                    <Badge
                      variant="secondary"
                      className="cursor-help bg-green-50 text-xs text-green-700 sm:text-sm"
                    >
                      {productInfo.lifespan}
                      {' '}
                      <span className="mx-1 hidden sm:inline">years</span>
                      lifespan
                    </Badge>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>

            {/* Total Weight */}
            {productInfo?.total_weight && (
              <div className="mb-4 flex items-center gap-2 text-base text-gray-700 sm:mb-5">
                <Package className="h-4 w-4 flex-shrink-0 text-purple-600 sm:h-5 sm:w-5" />
                <span className="text-xs font-medium sm:text-sm">
                  {formatWeightValue(productInfo.total_weight)}
                  {' '}
                  {productInfo.total_weight_unit || 'kg'}
                  {' '}
                  <span className="hidden sm:inline">total weight</span>
                </span>
              </div>
            )}

            {/* Carbon Footprint Calculation */}
            {summary?.total_carbon_footprint && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 sm:p-5">
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle
                    className="h-4 w-4 flex-shrink-0 text-green-600 sm:h-5 sm:w-5"
                    weight="fill"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium break-words text-green-800 sm:text-base">
                      Calculations Aligned: Lifecycle analysis and GWP100 values
                      are consistent (
                      {summary.total_carbon_footprint.toFixed(2)}
                      {' '}
                      {summary.carbon_footprint_unit || 'kg CO₂e'}
                      ).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Product Description */}
            <p className="mt-3 text-sm text-gray-700 sm:mt-4 sm:text-base">
              A
              {' '}
              {productInfo?.product_general_name?.toLowerCase() || 'product'}
              {' '}
              designed for
              {' '}
              {productInfo?.category_name?.[0]?.toLowerCase()
                || 'various applications'}
              {' '}
              with multiple functionalities and capabilities.
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
            {productInfo?.market_price && productInfo.market_price.length > 0 && productInfo.market_price.every((price: any) => price !== null) && (
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-900 sm:mb-3 sm:text-lg">
                      Market Price (USD)
                    </p>
                  </div>
                </div>
                {productInfo.market_price.length > 1 && (
                  <p className="flex items-center gap-2 text-sm sm:text-base">
                    <CheckCircle
                      className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-600 sm:h-4 sm:w-4"
                      weight="fill"
                    />
                    Range:
                    {' '}
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                      Number(productInfo.market_price?.[0] ?? 0),
                    )}
                    {' '}
                    -
                    {' '}
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                      Number(productInfo.market_price?.[1] ?? 0),
                    )}
                  </p>
                )}
                <p className="mt-1 text-sm text-green-700 sm:text-base">
                  Positioning: Premium specialized equipment
                </p>
              </div>
            )}

            {/* Key Features */}
            {productSpecs?.key_features
              && productSpecs.key_features.length > 0 && (
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
                    .map((feature, index) => (
                      <li
                        key={`feature-${index}-${feature.substring(0, 20)}`}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle
                          className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-600 sm:h-4 sm:w-4"
                          weight="fill"
                        />
                        <span className="text-sm break-words text-gray-700 sm:text-base">
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
                {productSpecs?.dimensions
                  && productSpecs.dimensions.length > 0 && productSpecs.dimensions.every((dimension: number) => dimension !== null) && (
                  <div className="flex flex-col gap-1 text-base sm:flex-row sm:justify-between sm:text-base">
                    <span className="text-gray-600">Dimensions (L×W×H):</span>
                    <span className="font-medium break-words text-gray-900 sm:text-right">
                      {productSpecs.dimensions.join(' × ')}
                      {' '}
                      {productSpecs.dimensions_unit || 'm'}
                    </span>
                  </div>
                )}
                {productSpecs?.total_capacity && (
                  <div className="flex flex-col gap-1 text-base sm:flex-row sm:justify-between sm:text-base">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium break-words text-gray-900 sm:text-right">
                      {productSpecs.total_capacity}
                      {' '}
                      {productSpecs.total_capacity_unit}
                    </span>
                  </div>
                )}
                {productSpecs?.energy_consumption && (
                  <div className="flex flex-col gap-1 text-base sm:flex-row sm:justify-between sm:text-base">
                    <span className="text-gray-600">Energy Consumption:</span>
                    <span className="font-medium break-words text-gray-900 sm:text-right">
                      {productSpecs.energy_consumption}
                      {' '}
                      {productSpecs.energy_consumption_unit}
                    </span>
                  </div>
                )}
                {productInfo?.total_weight && (
                  <div className="flex flex-col gap-1 text-base sm:flex-row sm:justify-between sm:text-base">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium break-words text-gray-900 sm:text-right">
                      {formatWeightValue(productInfo.total_weight)}
                      {' '}
                      {productInfo.total_weight_unit || 'kg'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Market Data Sources */}
            {product_data?.data_sources
              && product_data.data_sources.length > 0 && (
              <div>
                <h5 className="mb-1.5 text-base font-medium text-gray-700 sm:mb-2 sm:text-sm">
                  Market Data Sources
                </h5>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product_data.data_sources
                    .slice(0, 3)
                    .map((source, index) => (
                      <Link href={source.source_url as string} target="_blank" rel="noopener noreferrer" key={`source-${index}-${source.source_title}`}>
                        <Badge
                          key={`source-${index}-${source.source_title}`}
                          variant="secondary"
                          className=""
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

      {/* Data Sources - Full Width */}
      {/* {product_data.data_sources && product_data.data_sources.length > 0 && (
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-xl font-bold text-gray-900">Data Sources</h3>
          <div className="space-y-3">
            {product_data.data_sources.map((source, index) => (
              <div
                key={`datasource-${index}-${source.source_title}`}
                className="border-l-4 border-blue-500 pl-4"
              >
                <h4 className="font-medium text-gray-900">
                  {source.source_title || 'Untitled Source'}
                </h4>
                {source.source_description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {source.source_description}
                  </p>
                )}
                {source.source_url && source.source_url !== 'not available' && (
                  <Link
                    href={source.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Source →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Analysis Timestamp */}
      {/* {result.timestamp && (
        <div className="text-center text-sm text-gray-500">
          Analysis completed on
          {' '}
          {new Date(result.timestamp).toLocaleString()}
        </div>
      )} */}

      <ComponentsBreakdown list_of_parts={productSpecs?.list_of_parts || []} />
    </motion.div>
  );
}
