'use client';

import ReactECharts from 'echarts-for-react';

import { Tooltip, TooltipProvider } from '@/components/ui';
import { useGetLcaAnalysisDetail } from '@/services/lca-analysis/detail';
import { useGetMaterialCompositionDetail } from '@/services/material-composition/detail';
import { useGetProductSpecificationV3Detail } from '@/services/product-specifications-v3/detail';
import {
  formatNumberValue,
  formatWeightValue,
} from '@/utils/namespaces/format';
import { Info, Recycle, TrendingUp } from 'lucide-react';
import { useEffect, useRef } from 'react';

type MaterialCompositionProps = {
  composition_id: string;
  lcaAnalysisId?: string | null;
  productSpecificationId?: string | null;
};

export default function MaterialCompositionSection({
  composition_id,
  lcaAnalysisId,
  productSpecificationId,
}: MaterialCompositionProps) {
  const {
    data: materialCompositionDetail,
    isLoading,
    error,
  } = useGetMaterialCompositionDetail(composition_id);
  const { data: lcaAnalysisData } = useGetLcaAnalysisDetail(
    lcaAnalysisId || '',
  );
  const { data: productSpecificationData } = useGetProductSpecificationV3Detail(
    productSpecificationId || '',
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ref]);

  if (isLoading || error || !materialCompositionDetail?.data) {
    if (isLoading) {
      return (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="space-y-2 text-center">
            <div className="mx-auto h-6 w-48 animate-pulse rounded bg-gray-200 sm:h-8 sm:w-64" />
            <div className="mx-auto h-4 w-64 animate-pulse rounded bg-gray-100 sm:w-80" />
          </div>
          <div className="rounded-xl border bg-white p-4 sm:p-6">
            <div className="h-64 w-full animate-pulse rounded bg-gray-100 sm:h-80 lg:h-96" />
          </div>
          <div className="rounded-xl border bg-white">
            <div className="h-48 w-full animate-pulse rounded bg-gray-100 sm:h-64" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <div className="h-28 animate-pulse rounded-xl bg-gray-100 sm:h-32" />
            <div className="h-28 animate-pulse rounded-xl bg-gray-100 sm:h-32" />
          </div>
        </div>
      );
    }
    return null;
  }

  const compositionData = materialCompositionDetail.data;
  const composition = compositionData.materialComposition;
  const materials = composition?.materials || [];
  // const summary = composition?.summary;

  // Calculate percentages if not provided
  const materialsWithPercentages = materials.map((material: any) => {
    const totalWeight = compositionData.totalWeight || 1;
    return {
      ...material,
      percentage:
        material.percentage
        || ((material.weight / totalWeight) * 100).toFixed(2),
      materialName: material.material_name,
      materialType: material.material_type,
      carbonEmissions: material.carbon_emissions,
      source: material.source,
      renewable: material.renewable ?? null,
      recyclable: material.recyclable ?? null,
      sustainability_notes: material.sustainability_notes,
    };
  });

  // Get timeline analysis data if available
  const timelineAnalysis
    = lcaAnalysisData?.data?.otherAnalysis?.timeline_analysis;

  const totalWeightUnit = compositionData.totalWeightUnit || 'kg';

  return (
    <div className="space-y-5 sm:space-y-7 lg:space-y-9" ref={ref}>
      {/* Header */}
      <div className="space-y-1.5 text-center sm:space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Raw Materials Composition
        </h2>
        <p className="text-base text-gray-600 sm:text-lg">
          Breakdown of materials by weight and their associated carbon emission
          factors.
        </p>
      </div>

      {/* Pie Chart */}
      {materialsWithPercentages.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <ReactECharts
            option={{
              tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                  const material = materialsWithPercentages.find(
                    (m: any) => m.materialName === params.name,
                  );
                  return `
                    <div style="text-align: left;">
                      <strong>${params.name}</strong><br/>
                      Weight: ${formatWeightValue(material?.weight)} ${material?.weight_unit || 'kg'} (${params.percent}%)<br/>
                      Carbon Emissions: ${material?.carbon_emissions || 'N/A'} ${material?.carbon_factor_unit || 'CO₂e'}<br/>
                      Type: ${material?.materialType || 'N/A'}
                    </div>
                  `;
                },
              },
              legend: {
                orient: 'horizontal',
                bottom: '0%',
                left: 'center',
                textStyle: {
                  fontSize: 16,
                  fontWeight: 500,
                },
                itemWidth: 16,
                itemHeight: 16,
              },
              series: [
                {
                  name: 'Material Composition',
                  type: 'pie',
                  radius: ['40%', '70%'],
                  center: ['50%', '45%'],
                  avoidLabelOverlap: false,
                  itemStyle: {
                    borderRadius: 8,
                    borderColor: '#fff',
                    borderWidth: 2,
                  },
                  label: {
                    show: false,
                    position: 'center',
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: 16,
                      fontWeight: 'bold',
                    },
                  },
                  labelLine: {
                    show: false,
                  },
                  data: materialsWithPercentages.map((material: any) => ({
                    name: material.materialName,
                    value: Number.parseFloat(material.percentage),
                    weight: material.weight || 0,
                    carbon_emissions: material.carbon_emissions || 0,
                    material_type: material.materialType || 'Unknown',
                  })),
                  color: [
                    '#3B82F6',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444',
                    '#8B5CF6',
                    '#06B6D4',
                  ],
                },
              ],
            }}
            style={{ height: '420px', width: '100%' }}
            opts={{ renderer: 'svg', devicePixelRatio: 2 }}
          />
        </div>
      )}

      {/* Materials Table */}
      {materialsWithPercentages.length > 0 && (
        <TooltipProvider>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-900">
                      Material
                    </th>
                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-900">
                      Weight (
                      {totalWeightUnit}
                      )
                    </th>
                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-900">
                      %
                    </th>
                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-900">
                      CO₂e Factor
                    </th>
                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-900">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {materialsWithPercentages.map(
                    (material: any, index: number) => (
                      <tr
                        key={material.materialName || `material-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="mr-3 h-4 w-4 rounded-full"
                              style={{
                                backgroundColor: [
                                  '#3B82F6',
                                  '#10B981',
                                  '#F59E0B',
                                  '#EF4444',
                                  '#8B5CF6',
                                  '#06B6D4',
                                ][index % 6],
                              }}
                            />
                            <div>
                              <div className="text-base font-medium text-gray-900">
                                {material.materialName}
                              </div>
                              <div className="text-base text-gray-500">
                                {material.materialType}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-base whitespace-nowrap text-gray-900">
                          {material.weight
                            ? formatWeightValue(material.weight)
                            : '0.00'}
                        </td>
                        <td className="px-6 py-4 text-base whitespace-nowrap text-gray-900">
                          {material.percentage}
                          %
                        </td>
                        <td className="px-6 py-4 text-base whitespace-nowrap text-gray-900">
                          {material.carbon_factor
                            ? formatNumberValue(material.carbon_factor)
                            : '0.00'}
                        </td>
                        <td className="px-6 py-4 text-base whitespace-nowrap text-gray-500">
                          <div className="flex items-center gap-2">
                            {material.sustainability_notes
                              ? (
                                  <Tooltip
                                    side="top"
                                    // @ts-expect-error - Tooltip content type issue with Radix UI
                                    content={(
                                      <div className="max-w-xs text-sm">
                                        {material.sustainability_notes}
                                      </div>
                                    )}
                                  >
                                    <button
                                      type="button"
                                      className="inline-flex items-center justify-center rounded-full bg-blue-100 p-1.5 text-blue-600 transition-colors hover:bg-blue-200"
                                      aria-label="Sustainability Notes"
                                    >
                                      <Info className="h-4 w-4" />
                                    </button>
                                  </Tooltip>
                                )
                              : null}
                            <span>{material.source || '-'}</span>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}

                  {/* Total Row */}
                  <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-900">
                      Total Material Weight
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-900">
                      {compositionData.totalWeight
                        ? formatWeightValue(compositionData.totalWeight)
                        : '0.00'}
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-900">
                      100.00%
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-900">
                      -
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-500">
                      -
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TooltipProvider>
      )}

      {/* Data Sources */}
      {/* {compositionData.dataSources && compositionData.dataSources.length > 0 && (
        <DataSources dataSources={compositionData.dataSources} />
      )} */}

      {/* Environmental Impact Summary */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        {/* Total Lifecycle Emissions Card */}
        {(() => {
          // Use timeline_analysis.total_lifecycle_carbon from LCA Analysis
          const totalLifecycleCarbon = timelineAnalysis?.total_lifecycle_carbon;

          if (!totalLifecycleCarbon || totalLifecycleCarbon <= 0) {
            return null;
          }

          return (
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 p-6 text-white shadow-lg sm:p-8">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="rounded-lg bg-white/20 p-2 sm:p-3">
                  <Recycle className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1.5 text-sm font-medium tracking-wide text-blue-100 uppercase sm:mb-2 sm:text-base">
                    TOTAL LIFECYCLE EMISSIONS
                  </p>
                  <p className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                    {formatNumberValue(totalLifecycleCarbon)}
                    {' '}
                    <span className="text-xl sm:text-2xl lg:text-3xl">
                      kg CO₂e
                    </span>
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Annual Emissions Card */}
        {(() => {
          // Get lifespan from product specification data
          // API response structure: data.product_data.product_information.lifespan
          const productData = (productSpecificationData?.data as any)
            ?.product_data;
          const productInfo = productData?.product_information;
          const lifespan
            = productInfo?.lifespan
              || productInfo?.product_information?.lifespan
              || productSpecificationData?.data?.lifespan
              || 10; // Default 10 years if not available

          // Use timeline_analysis.total_lifecycle_carbon divided by lifespan for annual emissions
          const totalLifecycleCarbon = timelineAnalysis?.total_lifecycle_carbon;

          if (
            !totalLifecycleCarbon
            || totalLifecycleCarbon <= 0
            || !lifespan
            || lifespan <= 0
          ) {
            return null;
          }

          const annualEmissions = totalLifecycleCarbon / lifespan;

          return (
            <div className="rounded-xl bg-green-500 p-6 text-white shadow-lg sm:p-8">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="rounded-lg bg-white/20 p-2 sm:p-3">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1.5 text-sm font-medium tracking-wide text-green-100 uppercase sm:mb-2 sm:text-base">
                    ANNUAL EMISSIONS
                  </p>
                  <p className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                    {formatNumberValue(annualEmissions)}
                    {' '}
                    <span className="text-xl sm:text-2xl lg:text-3xl">
                      kg CO₂e / year
                    </span>
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Sustainability Summary */}
      {/* {summary && (
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6">
          <div className="flex items-start space-x-4">
            <div className="rounded-lg bg-emerald-100 p-2">
              <Leaf className="text-emerald-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Sustainability Summary
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {summary.recyclability_score !== undefined
                  && summary.recyclability_score !== null && (
                  <div>
                    <p className="text-sm text-gray-600">
                      Recyclability Score
                    </p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {(summary.recyclability_score * 100).toFixed(0)}
                      %
                    </p>
                  </div>
                )}
                {summary.sustainability_rating && (
                  <div>
                    <p className="text-sm text-gray-600">
                      Sustainability Rating
                    </p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {summary.sustainability_rating}
                    </p>
                  </div>
                )}
                {summary.primary_materials
                  && summary.primary_materials.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600">Primary Materials</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {summary.primary_materials.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
