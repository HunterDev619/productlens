'use client';

import type { OtherAnalysis } from '@/services/types';
import ReactECharts from 'echarts-for-react';
import { Factory, MapPin, Recycle, Truck, Users } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { MarkdownConverter } from '@/components/markdown-converter';
import { useGetLcaAnalysisDetail } from '@/services/lca-analysis/detail';
import { formatNumberValue } from '@/utils/namespaces/format';

type CradleToGraveAnalysisProps = {
  lcaAnalysis_id: string;
  productSpecificationId?: string | null;
  materialCompositionId?: string | null;
};

export default function CradleToGraveAnalysis({ lcaAnalysis_id }: CradleToGraveAnalysisProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { data: lcaAnalysisData, isLoading, error } = useGetLcaAnalysisDetail(lcaAnalysis_id);

  const hasDataError = !isLoading && !lcaAnalysisData?.data;
  const hasError = Boolean(error) || hasDataError;

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ref]);

  useEffect(() => {
    if (!hasError) {
      return;
    }

    if (error) {
      console.error('Failed to load cradle-to-grave analysis.', error);
      return;
    }

    console.warn('Failed to load cradle-to-grave analysis: missing lcaAnalysis data.');
  }, [hasError, error]);

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="animate-pulse space-y-3 sm:space-y-4">
          <div className="h-6 w-2/3 rounded bg-gray-200 sm:h-8" />
          <div className="h-20 w-full rounded bg-gray-100 sm:h-24" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <div className="animate-pulse space-y-2 rounded-xl border bg-white p-4 sm:space-y-3 sm:p-6">
            <div className="h-5 w-1/2 rounded bg-gray-200 sm:h-6" />
            <div className="h-32 w-full rounded bg-gray-100 sm:h-40" />
          </div>
          <div className="animate-pulse space-y-2 rounded-xl border bg-white p-4 sm:space-y-3 sm:p-6">
            <div className="h-5 w-1/3 rounded bg-gray-200 sm:h-6" />
            <div className="h-32 w-full rounded bg-gray-100 sm:h-40" />
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return null;
  }

  const lcaData = lcaAnalysisData?.data;
  if (!lcaData) {
    return null;
  }

  const otherAnalysis: OtherAnalysis = lcaData.otherAnalysis;
  const mainAnalysisText = typeof lcaData.mainLcaAnalysis === 'string'
    ? lcaData.mainLcaAnalysis
    : JSON.stringify(lcaData.mainLcaAnalysis);

  // Get analysis sections
  const geographicAnalysis = otherAnalysis.geographic_analysis;
  const timelineAnalysis = otherAnalysis.timeline_analysis;
  const supplyChainMapping = otherAnalysis.supply_chain_mapping;

  // Geographic analysis sub-sections
  const geoSupplyChainMapping = geographicAnalysis?.supply_chain_mapping;
  const regionalImpactIntensity = geographicAnalysis?.regional_impact_intensity;
  const emissionHotspots = geographicAnalysis?.emission_hotspots;

  // Extract lifecycle stages from timeline_analysis if available
  const lifecycleProgression = timelineAnalysis?.lifecycle_progression || [];

  // Map to chart format
  const lifecycleStages = lifecycleProgression.length > 0
    ? lifecycleProgression.map((stage: any, index: number) => ({
        name: stage.stage || 'Unknown',
        value: stage.emissions || 0,
        color: ['#F59E0B', '#F97316', '#3B82F6', '#8B5CF6', '#10B981'][index % 5],
      }))
    : [];

  // Chuẩn hóa tên stage theo yêu cầu hiển thị
  const normalizeStageName = (name: string): string => {
    const trimmed = (name || '').trim();
    if (/distribution\s*&\s*transportation/i.test(trimmed)) {
      return 'Transportation';
    }
    if (/use\s*phase/i.test(trimmed)) {
      return 'Use phase';
    }
    if (/end[-\s]*of[-\s]*life/i.test(trimmed)) {
      return 'End of Life';
    }
    return trimmed;
  };

  const yAxisLabels = lifecycleStages.map(stage => normalizeStageName(stage.name));

  // Chart options for lifecycle emissions
  const barChartOptions = lifecycleStages.length > 0
    ? {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: (params: any) => {
            const data = params[0];
            return `<strong>${data.name}</strong><br/>Emissions: ${data.value.toFixed(2)} kg CO₂e per unit`;
          },
        },
        grid: {
          left: '22%',
          right: '15%',
          top: '15%',
          bottom: '5%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}',
            fontSize: 14,
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e5e7eb',
            },
          },
          max: Math.max(...lifecycleStages.map(s => s.value)) * 1.15,
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: yAxisLabels,
          axisLabel: {
            interval: 0,
            fontSize: 14,
            color: '#6b7280',
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        series: [
          {
            type: 'bar',
            data: lifecycleStages.map((stage, index) => ({
              value: stage.value,
              name: yAxisLabels[index],
              itemStyle: {
                color: stage.color,
                borderRadius: [0, 6, 6, 0],
              },
            })),
            barWidth: '60%',
            label: {
              show: true,
              position: 'right',
              formatter: (params: any) => formatNumberValue(params.value),
              fontSize: 15,
              fontWeight: 'bold',
              color: '#374151',
            },
          },
        ],
      }
    : null;

  // Functional unit info
  // const functionalUnit = {
  //   definition: '1 reclining sofa',
  //   reference_flow: 'Weight of sofa and material consumption',
  //   justification: 'Evaluate environmental impact per unit of product',
  // };

  return (
    <div className="space-y-5 sm:space-y-7 lg:space-y-9" ref={ref}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="rounded-lg bg-blue-100 p-1.5 sm:p-2">
            <Recycle className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Cradle-to-Grave Lifecycle Analysis
          </h2>
        </div>
      </div>

      {/* Functional Unit */}
      {/* <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 sm:p-7">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <div className="rounded-lg bg-blue-100 p-1.5 sm:p-2">
            <Users className="h-[18px] w-[18px] text-blue-600 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:mb-3 sm:text-xl">Functional Unit</h3>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="text-base sm:text-lg">
                <span className="font-semibold text-blue-700">Definition:</span>
                <span className="ml-1.5 text-blue-900 sm:ml-2">{functionalUnit.definition}</span>
              </div>
              <div className="text-base sm:text-lg">
                <span className="font-semibold text-blue-700">Reference Flow:</span>
                <span className="ml-1.5 break-words text-blue-900 sm:ml-2">{functionalUnit.reference_flow}</span>
              </div>
              <div className="text-base sm:text-lg">
                <span className="font-semibold text-blue-700">Justification:</span>
                <span className="ml-1.5 break-words text-blue-900 sm:ml-2">{functionalUnit.justification}</span>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Lifecycle Emissions Chart with embedded title */}
      {lifecycleStages.length > 0 && barChartOptions && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
              Lifecycle CO₂e Emissions Breakdown per Functional Unit
            </h3>
          </div>
          <ReactECharts
            option={barChartOptions}
            style={{ height: '380px', width: '100%' }}
            opts={{ renderer: 'svg', devicePixelRatio: 2 }}
          />
        </div>
      )}

      {/* Key Lifecycle Stages */}
      {lifecycleProgression.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Key Lifecycle Stages</h3>

          {lifecycleProgression.map((stage: any, index: number) => {
            const stageColors = [
              { border: 'border-yellow-200', bg: 'bg-yellow-50', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', textColor: 'text-yellow-700' },
              { border: 'border-orange-200', bg: 'bg-orange-50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', textColor: 'text-orange-700' },
              { border: 'border-blue-200', bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', textColor: 'text-blue-700' },
              { border: 'border-purple-200', bg: 'bg-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', textColor: 'text-purple-700' },
              { border: 'border-green-200', bg: 'bg-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-600', textColor: 'text-green-700' },
            ];
            const color = stageColors[index % 5]!;

            const Icon = index === 0 ? Factory : index === 1 ? Factory : index === 2 ? Truck : index === 3 ? Users : Recycle;

            const lastActivity = stage.key_activities?.[stage.key_activities.length - 1];

            return (
              <div key={stage.stage || `stage-${index}`} className={`rounded-xl border ${color.border} ${color.bg} p-4 sm:p-6`}>
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <div className={`flex-shrink-0 rounded-lg ${color.iconBg} p-1.5 sm:p-2`}>
                    <Icon className={`h-5 w-5 ${color.iconColor} sm:h-6 sm:w-6`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="text-base font-semibold break-words text-gray-900 sm:text-lg">{stage.stage || 'Unknown Stage'}</h4>
                      {stage.emissions !== undefined && stage.emissions !== null && (
                        <span className={`text-sm font-bold whitespace-nowrap ${color.textColor} sm:text-lg`}>
                          {formatNumberValue(stage.emissions)}
                          {' '}
                          kg CO₂e per unit
                        </span>
                      )}
                    </div>
                    {stage.key_activities && stage.key_activities.length > 0 && (
                      <p className="mt-2 text-sm break-words text-gray-700 sm:text-base">
                        {stage.key_activities.join('. ')}
                        {lastActivity && !lastActivity.endsWith('.') ? '.' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lifecycle Summary */}
      {mainAnalysisText && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          {/* <h3 className="mb-2 text-base font-semibold text-gray-900 sm:mb-3 sm:text-lg">Lifecycle Summary</h3> */}
          <MarkdownConverter content={mainAnalysisText} />
        </div>
      )}

      {/* Supply Chain Mapping (moved out; hidden here) */}
      {false && supplyChainMapping && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Supply Chain Mapping</h3>

          {/* Tier Breakdown */}
          {supplyChainMapping.tier_breakdown && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="mb-4 text-lg font-semibold text-gray-900">Supplier Tier Breakdown</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {supplyChainMapping.tier_breakdown.tier_1_suppliers !== undefined && (
                  <div className="rounded-lg bg-blue-50 p-4 text-center">
                    <p className="text-3xl font-bold text-blue-700">
                      {supplyChainMapping.tier_breakdown.tier_1_suppliers}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Tier 1 Suppliers</p>
                  </div>
                )}
                {supplyChainMapping.tier_breakdown.tier_2_suppliers !== undefined && (
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <p className="text-3xl font-bold text-green-700">
                      {supplyChainMapping.tier_breakdown.tier_2_suppliers}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Tier 2 Suppliers</p>
                  </div>
                )}
                {supplyChainMapping.tier_breakdown.tier_3_suppliers !== undefined && (
                  <div className="rounded-lg bg-yellow-50 p-4 text-center">
                    <p className="text-3xl font-bold text-yellow-700">
                      {supplyChainMapping.tier_breakdown.tier_3_suppliers}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Tier 3 Suppliers</p>
                  </div>
                )}
                {supplyChainMapping.tier_breakdown.geographical_spread && (
                  <div className="rounded-lg bg-purple-50 p-4 text-center">
                    <p className="text-sm font-bold text-purple-700">
                      {supplyChainMapping.tier_breakdown.geographical_spread}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Geographical Spread</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Transportation Network */}
          {supplyChainMapping.transportation_network && supplyChainMapping.transportation_network.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              {/* Header with Total Distance */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck size={20} className="text-gray-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Transportation Distance & Emissions</h4>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Distance</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {supplyChainMapping.transportation_network
                      .reduce((sum: number, route: any) => sum + (Number(route.distance_km) || 0), 0)
                      .toFixed(2)}
                    {' '}
                    km
                  </p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-left text-sm font-semibold text-gray-700">Route</th>
                      <th className="pb-3 text-right text-sm font-semibold text-gray-700">Distance (km)</th>
                      <th className="pb-3 text-center text-sm font-semibold text-gray-700">Transport Mode</th>
                      <th className="pb-3 text-right text-sm font-semibold text-gray-700">Emissions (kg CO₂e)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplyChainMapping.transportation_network.map((route: any, index: number) => (
                      <tr key={route.route || `route-${index}`} className="border-b border-gray-100">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-900">{route.route || 'Unknown Route'}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right text-sm text-gray-700">
                          {route.distance_km !== undefined && route.distance_km !== null
                            ? Number(route.distance_km).toFixed(2)
                            : '-'}
                        </td>
                        <td className="py-3 text-center">
                          {route.mode && (
                            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                              {route.mode}
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right text-sm text-gray-700">
                          {route.emissions_share !== undefined && route.emissions_share !== null
                            ? Number(route.emissions_share).toFixed(2)
                            : '-'}
                        </td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                      <td className="py-3 text-sm text-gray-900">Total Transportation</td>
                      <td className="py-3 text-right text-sm text-gray-900">
                        {supplyChainMapping.transportation_network
                          .reduce((sum: number, route: any) => sum + (Number(route.distance_km) || 0), 0)
                          .toFixed(2)}
                        {' '}
                        km
                      </td>
                      <td className="py-3 text-center text-sm text-gray-600">-</td>
                      <td className="py-3 text-right text-sm text-gray-900">
                        {supplyChainMapping.transportation_network
                          .reduce((sum: number, route: any) => sum + (Number(route.emissions_share) || 0), 0)
                          .toFixed(2)}
                        {' '}
                        kg CO₂e
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Info Section */}
              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-xs font-bold text-blue-600">i</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="mb-1 text-sm font-semibold text-gray-900">
                      Complete Traceability & Transportation Analysis
                    </h5>
                    <p className="text-sm text-gray-600">
                      This comprehensive supply chain map traces raw materials from their origins to mass manufacturing
                      locations using open-source databases. Transportation emissions are calculated using Great Circle
                      distances and modal emission factors from GLEC Framework and DEFRA standards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Sources */}
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h6 className="mb-2 text-sm font-semibold text-gray-900">Raw Material Sources</h6>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-blue-600">✓</span>
                      <span>USGS Mineral Commodity Summaries for mining data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-blue-600">✓</span>
                      <span>FAOSTAT for agricultural and forestry products</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className="mb-2 text-sm font-semibold text-gray-900">Transportation Analysis</h6>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-blue-600">✓</span>
                      <span>GLEC Framework for freight emission factors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-blue-600">✓</span>
                      <span>DEFRA conversion factors for transport modes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Traceability Score */}
          {supplyChainMapping.traceability_score && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="mb-4 text-lg font-semibold text-gray-900">Traceability Score</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {supplyChainMapping.traceability_score.overall_score !== undefined && (
                  <div className="rounded-lg bg-blue-50 p-4 text-center">
                    <p className="text-3xl font-bold text-blue-700">
                      {supplyChainMapping.traceability_score.overall_score}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Overall Score</p>
                  </div>
                )}
                {supplyChainMapping.traceability_score.material_traceability !== undefined && (
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <p className="text-3xl font-bold text-green-700">
                      {supplyChainMapping.traceability_score.material_traceability}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Material Traceability</p>
                  </div>
                )}
                {supplyChainMapping.traceability_score.supplier_transparency !== undefined && (
                  <div className="rounded-lg bg-yellow-50 p-4 text-center">
                    <p className="text-3xl font-bold text-yellow-700">
                      {supplyChainMapping.traceability_score.supplier_transparency}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Supplier Transparency</p>
                  </div>
                )}
                {supplyChainMapping.traceability_score.certification_coverage !== undefined && (
                  <div className="rounded-lg bg-purple-50 p-4 text-center">
                    <p className="text-3xl font-bold text-purple-700">
                      {supplyChainMapping.traceability_score.certification_coverage}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Certification Coverage</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Geographic Analysis (moved out; hidden here) */}
      {false && geographicAnalysis && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Geographic Impact Analysis</h3>

          {/* Supply Chain Mapping */}
          {geoSupplyChainMapping && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="mb-4 text-lg font-semibold text-gray-900">Supply Chain Materials</h4>
              {geoSupplyChainMapping?.raw_materials && geoSupplyChainMapping.raw_materials.length > 0
                ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {geoSupplyChainMapping.raw_materials.map((material: any, index: number) => (
                        <div key={material.material || `material-${index}`} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                          <h5 className="font-semibold text-gray-900">{material.material || 'Unknown Material'}</h5>
                          {material.source_countries && material.source_countries.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-600">Source Countries:</p>
                              <div className="flex flex-wrap gap-2">
                                {material.source_countries.map((country: any, countryIndex: number) => {
                                  // Handle both string and object formats
                                  const countryName = typeof country === 'string' ? country : country?.country || 'Unknown';
                                  const key = typeof country === 'string' ? country : `${country?.country || 'unknown'}-${countryIndex}`;

                                  return (
                                    <span
                                      key={key}
                                      className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700"
                                    >
                                      {countryName}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                : (
                    <p className="text-gray-500">No supply chain mapping data available</p>
                  )}
            </div>
          )}

          {/* Regional Impact Intensity */}
          {regionalImpactIntensity && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="mb-4 text-lg font-semibold text-gray-900">Regional Impact Intensity</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-red-50 p-4">
                  <h5 className="font-semibold text-red-700">High Impact Regions</h5>
                  <ul className="mt-2 space-y-1">
                    {regionalImpactIntensity.high_impact_regions && regionalImpactIntensity.high_impact_regions.length > 0
                      ? regionalImpactIntensity.high_impact_regions.map((region: string, index: number) => (
                          <li key={region || `high-${index}`} className="text-sm text-red-600">
                            •
                            {' '}
                            {region}
                          </li>
                        ))
                      : (
                          <li className="text-sm text-gray-500">None</li>
                        )}
                  </ul>
                </div>
                <div className="rounded-lg bg-yellow-50 p-4">
                  <h5 className="font-semibold text-yellow-700">Medium Impact Regions</h5>
                  <ul className="mt-2 space-y-1">
                    {regionalImpactIntensity.medium_impact_regions && regionalImpactIntensity.medium_impact_regions.length > 0
                      ? regionalImpactIntensity.medium_impact_regions.map((region: string, index: number) => (
                          <li key={region || `medium-${index}`} className="text-sm text-yellow-600">
                            •
                            {' '}
                            {region}
                          </li>
                        ))
                      : (
                          <li className="text-sm text-gray-500">None</li>
                        )}
                  </ul>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <h5 className="font-semibold text-green-700">Low Impact Regions</h5>
                  <ul className="mt-2 space-y-1">
                    {regionalImpactIntensity.low_impact_regions && regionalImpactIntensity.low_impact_regions.length > 0
                      ? regionalImpactIntensity.low_impact_regions.map((region: string, index: number) => (
                          <li key={region || `low-${index}`} className="text-sm text-green-600">
                            •
                            {' '}
                            {region}
                          </li>
                        ))
                      : (
                          <li className="text-sm text-gray-500">None</li>
                        )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Emission Hotspots */}
          {emissionHotspots && emissionHotspots.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="mb-4 text-lg font-semibold text-gray-900">Emission Hotspots</h4>
              <div className="space-y-3">
                {emissionHotspots.map((hotspot: any, index: number) => (
                  <div key={hotspot.location || `hotspot-${index}`} className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-gray-900">{hotspot.location || 'Unknown'}</h5>
                      <div className="flex items-center space-x-2">
                        {hotspot.emission_intensity !== undefined && hotspot.emission_intensity !== null && (
                          <span className="text-sm font-medium text-red-700">
                            {Number(hotspot.emission_intensity).toFixed(2)}
                            {' '}
                            kg CO₂e
                          </span>
                        )}
                        {hotspot.mitigation_potential && (
                          <span className={`rounded-full px-2 py-1 text-xs ${
                            hotspot.mitigation_potential === 'high'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                          >
                            {hotspot.mitigation_potential}
                            {' '}
                            potential
                          </span>
                        )}
                      </div>
                    </div>
                    {hotspot.primary_cause && (
                      <p className="mt-2 text-sm text-gray-600">{hotspot.primary_cause}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
