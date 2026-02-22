'use client';

import type { ProductData } from '@/services/ai/find-product-specifications-v2';
import type { Analysis } from '@/services/ai/generate-analysis-report-v2';
import ReactECharts from 'echarts-for-react';
import { Factory, Recycle, Truck, Users } from 'lucide-react';
import { MarkdownConverter } from '@/components/markdown-converter';
import { formatNumberValue } from '@/utils/namespaces/format';
import SupplyChainTraceabilityAndTransportation from './supply-chain-traceability-and-transportation';

type CradleToGraveAnalysisProps = {
  data: {
    analysis: Analysis;
    product_data?: ProductData | null;
  };
};

export default function CradleToGraveAnalysis({ data }: CradleToGraveAnalysisProps) {
  const { analysis, product_data: _product_data } = data;

  // Get analysis sections
  const geographicAnalysis = analysis.geographic_analysis;
  const timelineAnalysis = analysis.timeline_analysis;
  // const equivalencyComparisons = analysis.equivalency_comparisons;
  const supplyChainMapping = analysis.supply_chain_mapping;

  // Geographic analysis sub-sections (Emission Hotspots vẫn hiển thị tại đây)
  const emissionHotspots = geographicAnalysis?.emission_hotspots;

  // Extract lifecycle stages from timeline_analysis if available
  const lifecycleStagesFromData = timelineAnalysis?.lifecycle_progression || [];

  // Map to chart format or use hardcoded data
  const lifecycleStages = lifecycleStagesFromData.length > 0
    ? lifecycleStagesFromData.map((stage, index) => ({
        name: stage.stage || 'Unknown',
        value: stage.emissions || 0,
        color: ['#F59E0B', '#F97316', '#3B82F6', '#8B5CF6', '#10B981'][index % 5],
      }))
    : [
        { name: 'Raw Material Extraction', value: 15.00, color: '#F59E0B' },
        { name: 'Manufacturing', value: 8.00, color: '#F97316' },
        { name: 'Distribution & Transportation', value: 13.31, color: '#3B82F6' },
        { name: 'Use Phase', value: 2.00, color: '#8B5CF6' },
        { name: 'End-of-Life', value: 1.00, color: '#10B981' },
      ];

  // Chuẩn hóa tên stage để hiển thị thống nhất theo yêu cầu UX
  const normalizeStageName = (name: string): string => {
    const trimmed = name?.trim() || '';
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

  // Cấu hình biểu đồ bar chart ngang
  const barChartOptions = lifecycleStages.length > 0
    ? {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: (params: any) => {
            const data = params[0];
            return `<strong>${data.name}</strong><br/>Emissions: ${formatNumberValue(data.value)} kg CO₂e per unit`;
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
          inverse: true, // Hiển thị theo thứ tự từ trên xuống: Raw -> ... -> End of Life
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

  // Lấy thông tin functional unit từ text analysis
  // const functionalUnit = {
  //   definition: '1 reclining sofa',
  //   reference_flow: 'Weight of sofa and material consumption',
  //   justification: 'Evaluate environmental impact per unit of product',
  // };

  return (
    <div className="space-y-5 sm:space-y-7 lg:space-y-9">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="rounded-lg bg-blue-100 p-1.5 sm:p-2">
            <Recycle className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Cradle-to-Grave Lifecycle Analysis
          </h2>
        </div>
        {/* <span className="rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-700">
          10 year lifecycle
        </span> */}
      </div>

      {/* Functional Unit */}
      {/* <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 sm:p-7">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <div className="flex-shrink-0 rounded-lg bg-blue-100 p-1.5 sm:p-2">
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

      {/* Lifecycle Summary */}
      {analysis.main_lca_analysis && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          {/* <h3 className="mb-2 text-base font-semibold text-gray-900 sm:mb-3 sm:text-lg">Lifecycle Summary</h3> */}
          <MarkdownConverter content={analysis.main_lca_analysis} />
        </div>
      )}

      {/* Key Lifecycle Stages */}
      {lifecycleStagesFromData.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Key Lifecycle Stages</h3>

          {lifecycleStagesFromData.map((stage, index) => {
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
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className={`rounded-lg ${color.iconBg} flex-shrink-0 p-1.5 sm:p-2`}>
                    <Icon className={`${color.iconColor} h-5 w-5 sm:h-6 sm:w-6`} />
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
                    {/* TODO: Update key activities */}
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

      {/* Supply Chain Mapping (moved out; hidden here) */}
      {false && supplyChainMapping && (
        <SupplyChainTraceabilityAndTransportation
          supplyChainMapping={supplyChainMapping}
          geographicAnalysis={geographicAnalysis}
        />
      )}

      {/* Emission Hotspots */}
      {emissionHotspots && emissionHotspots.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <h4 className="mb-3 text-lg font-semibold text-gray-900 sm:mb-4 sm:text-xl">Emission Hotspots</h4>
          <div className="space-y-2 sm:space-y-3">
            {emissionHotspots.map((hotspot, index) => (
              <div key={hotspot.location || `hotspot-${index}`} className="rounded-lg border border-red-200 bg-red-50 p-4 sm:p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h5 className="text-base font-semibold break-words text-gray-900 sm:text-lg">{hotspot.location || 'Unknown'}</h5>
                  <div className="flex flex-wrap items-center gap-2">
                    {hotspot.emission_intensity !== undefined && hotspot.emission_intensity !== null && (
                      <span className="text-sm font-medium text-red-700 sm:text-base">
                        {hotspot.emission_intensity}
                        {' '}
                        kg CO₂e
                      </span>
                    )}
                    {hotspot.mitigation_potential && (
                      <span className={`rounded-full px-2 py-0.5 text-sm ${
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
                  <p className="mt-2 text-sm break-words text-gray-600 sm:text-base">{hotspot.primary_cause}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
