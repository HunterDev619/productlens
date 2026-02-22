'use client';

import type {
  DataSource,
  MaterialComposition,
  ProductData,
} from '@/services/ai/find-product-specifications-v2';
import type { Analysis } from '@/services/ai/generate-analysis-report-v2';
import ReactECharts from 'echarts-for-react';
import { Info, Recycle, TrendingUp } from 'lucide-react';

import { Tooltip, TooltipProvider } from '@/components/ui';
import {
  formatNumberValue,
  formatWeightValue,
} from '@/utils/namespaces/format';

type RawMaterialCompositionProps = {
  data: {
    material_composition: MaterialComposition | null;
    data_sources?: DataSource[] | null;
    product_data?: ProductData | null;
    analysis?: Analysis | null;
  };
};

export default function RawMaterialComposition({
  data,
}: RawMaterialCompositionProps) {
  const {
    material_composition,
    data_sources: _,
    product_data,
    analysis,
  } = data;
  // Handle nested structure: material_composition can be nested or direct
  const composition
    = material_composition?.material_composition || material_composition;
  const materials = composition?.materials || [];
  // const summary = composition?.summary || material_composition?.summary;

  // Tạo dữ liệu cho pie chart
  const chartData = materials.map((material) => {
    const name = material.material_name || material.materialName || 'Unknown';
    const percentage = material.percentage || 0;
    return {
      name,
      value: percentage,
      weight: material.weight || 0,
      carbon_emissions:
        material.carbon_emissions || material.carbonEmissions || 0,
      material_type:
        material.material_type || material.materialType || 'Unknown',
    };
  });

  // Cấu hình biểu đồ pie chart
  const pieChartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `
          <div style="text-align: left;">
            <strong>${params.name}</strong><br/>
            Weight: ${params.data.weight} kg (${params.percent}%)<br/>
            Carbon Emissions: ${params.data.carbon_emissions} kg CO₂e<br/>
            Type: ${params.data.material_type}
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
        data: chartData,
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
  };

  // Tính toán thông tin tổng quan
  const totalWeight
    = composition?.total_weight || material_composition?.total_weight || 0;
  const totalWeightUnit
    = composition?.total_weight_unit
      || material_composition?.total_weight_unit
      || 'kg';

  if (!composition) {
    return null;
  }

  return (
    <div className="space-y-5 sm:space-y-7 lg:space-y-9">
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
      {chartData.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <ReactECharts
            option={pieChartOptions}
            style={{ height: '420px', width: '100%' }}
            opts={{ renderer: 'svg', devicePixelRatio: 2 }}
          />
        </div>
      )}

      {/* Materials Table */}
      {materials.length > 0 && (
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
                  {materials.map((material, index) => {
                    const materialName
                      = material.material_name
                        || material.materialName
                        || 'Unknown';
                    const weight = material.weight || 0;
                    const percentage = material.percentage || 0;
                    const carbonFactor
                      = material.carbon_factor || material.carbonFactor || 0;
                    const source = material.source || 'N/A';
                    const materialType
                      = material.material_type
                        || material.materialType
                        || 'Unknown';
                    const sustainabilityNotes
                      = material.sustainability_notes
                        || material.sustainabilityNotes
                        || null;

                    return (
                      <tr
                        key={materialName || `material-${index}`}
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
                                {materialName}
                              </div>
                              <div className="text-base text-gray-500">
                                {materialType}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-base whitespace-nowrap text-gray-900">
                          {formatWeightValue(weight)}
                        </td>
                        <td className="px-6 py-4 text-base whitespace-nowrap text-gray-900">
                          {percentage.toFixed(2)}
                          %
                        </td>
                        <td className="px-6 py-4 text-base whitespace-nowrap text-gray-900">
                          {carbonFactor.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-base whitespace-nowrap text-gray-500">
                          <div className="flex items-center gap-2">
                            {sustainabilityNotes
                              ? (
                                  <Tooltip
                                    side="top"
                                    // @ts-expect-error - Tooltip content type issue with Radix UI
                                    content={(
                                      <div className="max-w-xs text-sm">
                                        {sustainabilityNotes}
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
                            <span>{source}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Total Row */}
                  {totalWeight > 0 && (
                    <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                      <td className="px-6 py-4 text-base whitespace-nowrap text-gray-900">
                        Total Material Weight
                      </td>
                      <td className="px-6 py-4 text-base whitespace-nowrap text-gray-900">
                        {totalWeight.toFixed(2)}
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
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TooltipProvider>
      )}

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

      {/* Environmental Impact Summary */}
      {analysis && (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {/* Total Lifecycle Emissions Card */}
          {(() => {
            const timelineAnalysis = analysis?.timeline_analysis;

            const totalLifecycleCarbon = (timelineAnalysis as any)
              ?.total_lifecycle_carbon;

            if (totalLifecycleCarbon <= 0) {
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
            const productInfo
              = product_data?.product_information?.product_information
                || product_data?.product_information;
            const lifespan = productInfo?.lifespan || 10; // Default 10 years if not available
            const timelineAnalysis = analysis?.timeline_analysis;

            // Priority: timelineAnalysis.total_lifecycle_carbon > summary.total_carbon_footprint > lifecycleStagesTotal > current totalLifecycleEmissions
            const totalLifecycleCarbon = (timelineAnalysis as any)
              ?.total_lifecycle_carbon;

            const annualEmissions = totalLifecycleCarbon / lifespan;

            if (annualEmissions <= 0) {
              return null;
            }

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
      )}

      {/* Data Sources */}
      {/* {data_sources && data_sources.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Data Sources
          </h3>
          <div className="space-y-3">
            {data_sources.slice(0, 3).map((source, index) => (
              <div
                key={source?.source_url || `source-${index}`}
                className="border-l-4 border-blue-500 pl-4"
              >
                <h4 className="font-medium text-gray-900">
                  {source?.source_title || 'Untitled Source'}
                </h4>
                {source?.source_description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {source.source_description}
                  </p>
                )}
                {source?.source_url && source.source_url !== 'not available' && (
                  <a
                    href={source.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Source →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}
