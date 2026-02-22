'use client';

import ReactECharts from 'echarts-for-react';
import { Factory, Leaf, Recycle, TrendingUp, Users } from 'lucide-react';
import { useEffect } from 'react';

import { useGetLcaAnalysisDetail } from '@/services/lca-analysis/detail';

import { formatNumberValue } from '@/utils/namespaces/format';
import DataSources from './data-sources';

type LCAAnalysisProps = {
  lcaAnalysis_id: string;
};

export default function LCAAnalysis({ lcaAnalysis_id }: LCAAnalysisProps) {
  const { data: lcaAnalysisData, isLoading, error } = useGetLcaAnalysisDetail(lcaAnalysis_id);

  const hasError = Boolean(error);

  useEffect(() => {
    if (!hasError) {
      return;
    }

    console.error('Failed to load LCA analysis.', error);
  }, [hasError, error]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="h-20 w-full rounded bg-gray-100" />
        </div>
        <div className="rounded-xl border bg-white p-6">
          <div className="h-64 w-full animate-pulse rounded bg-gray-100" />
        </div>
        <div className="rounded-xl border bg-white p-6">
          <div className="h-80 w-full animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  if (hasError) {
    return null;
  }

  if (!lcaAnalysisData?.data) {
    return null;
  }

  const analysis = lcaAnalysisData?.data;

  // mainLcaAnalysis is a text string, not JSON
  const mainAnalysisText = typeof analysis.mainLcaAnalysis === 'string'
    ? analysis.mainLcaAnalysis
    : JSON.stringify(analysis.mainLcaAnalysis);

  // Extract lifecycle data from otherAnalysis
  const otherAnalysis = analysis.otherAnalysis;
  const lifecycleProgression = otherAnalysis?.timeline_analysis?.lifecycle_progression || [];

  // Build lifecycle stages from progression data
  const lifecycleStages = lifecycleProgression.map((stage: any) => ({
    stage: stage.stage,
    emissions_kg_co2e: stage.emissions,
    percentage_of_total: ((stage.emissions / (otherAnalysis?.timeline_analysis?.emission_velocity?.cumulative_emissions || 1)) * 100),
  }));

  // Check if we have any lifecycle data
  if (lifecycleStages.length === 0) {
    return (
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Recycle className="text-blue-600" size={24} />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-900">Life Cycle Assessment (LCA)</h2>
              <p className="text-sm font-medium text-blue-600">ISO 14040/14044 Standards</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-900">Analysis in Progress</h3>
          <p className="text-gray-600">The LCA analysis data is being generated. Please check back later.</p>
        </div>
      </div>
    );
  }

  // Helper function to assign colors based on stage name
  function getColorForStage(stageName: string): string {
    const name = stageName.toLowerCase();
    if (name.includes('raw') || name.includes('material')) {
      return '#F59E0B';
    }
    if (name.includes('manufactur')) {
      return '#F97316';
    }
    if (name.includes('transport')) {
      return '#3B82F6';
    }
    if (name.includes('use') || name.includes('consumption')) {
      return '#8B5CF6';
    }
    if (name.includes('end') || name.includes('disposal') || name.includes('life')) {
      return '#10B981';
    }
    return '#6B7280';
  }

  // Map lifecycle stages with colors
  const lifecycleStagesWithColors = lifecycleStages.map((stage: any) => ({
    ...stage,
    color: getColorForStage(stage.stage),
  }));

  // Get total emissions from timeline analysis
  const totalEmissions = otherAnalysis?.timeline_analysis?.emission_velocity?.cumulative_emissions || 0;

  // Impact categories data
  const impactCategories = [
    { name: 'Climate Change', value: totalEmissions, unit: 'kg CO2 eq', color: '#EF4444' },
    { name: 'Resource Depletion', value: totalEmissions * 0.02, unit: 'kg Sb eq', color: '#F59E0B' },
    { name: 'Eutrophication', value: totalEmissions * 0.0006, unit: 'kg PO4 eq', color: '#3B82F6' },
    { name: 'Acidification', value: totalEmissions * 0.002, unit: 'kg SO2 eq', color: '#8B5CF6' },
    { name: 'Human Toxicity', value: totalEmissions * 0.09, unit: 'kg 1,4-DB eq', color: '#10B981' },
    { name: 'Ecotoxicity', value: totalEmissions * 0.012, unit: 'kg 1,4-DB eq', color: '#06B6D4' },
  ];

  // Cấu hình biểu đồ bar chart ngang cho lifecycle stages
  const lifecycleChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const data = params[0];
        const stage = lifecycleStagesWithColors.find((s: any) => s.stage === data.name);
        return `<strong>${data.name}</strong><br/>Emissions: ${data.value} kg CO₂e (${stage?.percentage_of_total?.toFixed(1)}%)`;
      },
    },
    grid: {
      left: '25%',
      right: '10%',
      top: '10%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLabel: { formatter: '{value}' },
    },
    yAxis: {
      type: 'category',
      data: lifecycleStagesWithColors.map((stage: any) => stage.stage),
      axisLabel: { interval: 0, fontSize: 11 },
    },
    series: [{
      type: 'bar',
      data: lifecycleStagesWithColors.map((stage: any) => ({
        value: stage.emissions_kg_co2e,
        itemStyle: {
          color: stage.color,
          borderRadius: [0, 4, 4, 0],
        },
      })),
      barWidth: '60%',
      label: {
        show: true,
        position: 'right',
        formatter: '{c}',
        fontSize: 12,
        fontWeight: 'bold',
      },
    }],
  };

  // Cấu hình biểu đồ radar cho impact categories
  const radarChartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `<strong>${params.name}</strong><br/>${params.value} ${impactCategories[params.dataIndex]?.unit}`;
      },
    },
    radar: {
      indicator: impactCategories.map((cat: any) => ({
        name: cat.name,
        max: Math.max(...impactCategories.map((c: any) => c.value)) * 1.2,
      })),
      radius: '70%',
    },
    series: [{
      name: 'Environmental Impact',
      type: 'radar',
      data: [{
        value: impactCategories.map((cat: any) => cat.value),
        name: 'Impact Assessment',
        itemStyle: { color: '#4F46E5' },
        areaStyle: { opacity: 0.3 },
      }],
    }],
  };

  // Extract hotspots from geographic analysis
  const hotspots = otherAnalysis?.geographic_analysis?.emission_hotspots || [];

  // Extract recommendations from contextual benchmarks
  const recommendations = otherAnalysis?.equivalency_comparisons?.contextual_benchmarks
    ? [otherAnalysis.equivalency_comparisons.contextual_benchmarks.improvement_potential]
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center space-x-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <Recycle className="text-blue-600" size={24} />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-900">
              Life Cycle Assessment (LCA)
            </h2>
            <p className="text-sm font-medium text-blue-600">ISO 14040/14044 Standards</p>
          </div>
        </div>
      </div>

      {/* Summary Text */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start space-x-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <Users className="text-blue-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">LCA Summary</h3>
            <p className="leading-relaxed text-gray-700">{mainAnalysisText}</p>
          </div>
        </div>
      </div>

      {/* Lifecycle Emissions Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Lifecycle CO₂e Emissions Breakdown
        </h3>
        <ReactECharts
          option={lifecycleChartOptions}
          style={{ height: '350px', width: '100%' }}
        />
      </div>

      {/* Impact Categories Radar Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Environmental Impact Categories
        </h3>
        <ReactECharts
          option={radarChartOptions}
          style={{ height: '400px', width: '100%' }}
        />
      </div>

      {/* Key Lifecycle Stages */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Key Lifecycle Stages</h3>

        {lifecycleStagesWithColors.map((stage: any) => (
          <div
            key={stage.stage}
            className="rounded-xl border bg-gray-50 p-6"
            style={{ borderColor: `${stage.color}80` }}
          >
            <div className="flex items-start space-x-4">
              <div
                className="rounded-lg p-2"
                style={{ backgroundColor: `${stage.color}20` }}
              >
                <Factory className="text-gray-600" size={24} style={{ color: stage.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">{stage.stage}</h4>
                  <div className="text-right">
                    <span className="text-lg font-bold" style={{ color: stage.color }}>
                      {formatNumberValue(stage.emissions_kg_co2e)}
                      {' '}
                      kg CO₂e
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      (
                      {stage.percentage_of_total?.toFixed(1)}
                      %)
                    </span>
                  </div>
                </div>
                {/* Show key activities from lifecycle progression */}
                {lifecycleProgression.find((p: any) => p.stage === stage.stage)?.key_activities && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Activities: </span>
                      {lifecycleProgression.find((p: any) => p.stage === stage.stage)?.key_activities.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hotspots */}
      {hotspots.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Environmental Hotspots</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {hotspots.map((hotspot: any, index: number) => (
              <div key={`hotspot-${index}`} className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
                <div className="mb-3 flex items-center space-x-3">
                  <TrendingUp className="text-yellow-600" size={20} />
                  <h4 className="font-semibold text-yellow-700">
                    Location:
                    {hotspot.location}
                  </h4>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Primary Cause:</span>
                    <p className="text-sm text-gray-600">{hotspot.primary_cause}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Emission Intensity:</span>
                    <p className="text-sm text-gray-600">
                      {hotspot.emission_intensity}
                      {' '}
                      kg CO₂e
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Mitigation Potential:</span>
                    <p className="text-sm text-gray-600">{hotspot.mitigation_potential}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Improvement Recommendations</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {recommendations.map((recommendation: any, index: number) => (
              <div key={`recommendation-${index}`} className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                <div className="mb-3 flex items-center space-x-3">
                  <TrendingUp className="text-emerald-600" size={20} />
                  <h4 className="font-semibold text-emerald-700">
                    Recommendation #
                    {index + 1}
                  </h4>
                </div>
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Environmental Impact Summary */}
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6">
        <div className="flex items-start space-x-4">
          <div className="rounded-lg bg-emerald-100 p-2">
            <Leaf className="text-emerald-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              LCA Summary
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-gray-600">Total Lifecycle Impact</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {totalEmissions.toFixed(1)}
                  {' '}
                  kg CO₂e
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Primary Hotspot</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {lifecycleStagesWithColors[0]?.stage || 'N/A'}
                  {' '}
                  (
                  {lifecycleStagesWithColors[0]?.percentage_of_total?.toFixed(1)}
                  %)
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Improvement Potential</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {recommendations.length > 0 ? 'High' : 'Moderate'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      {analysis.dataSources && analysis.dataSources.length > 0 && (
        <DataSources dataSources={analysis.dataSources} />
      )}
    </div>
  );
}
