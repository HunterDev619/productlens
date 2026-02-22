'use client';

import { ChartLineUp, FileText, GlobeHemisphereEast } from '@phosphor-icons/react';
import { AlertTriangle, BookOpen, CheckCircle2, Droplets, Factory, Leaf, ListChecks, MapPin, Shield, Target, TrendingDown, Zap } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { MarkdownConverter } from '@/components/markdown-converter';
import { useGetIpccAr6ReportDetail } from '@/services/ipcc-ar6-report/detail';
import { useGetLcaAnalysisDetail } from '@/services/lca-analysis/detail';
import { formatNumberValue } from '@/utils/namespaces/format';

type IPCCReportsDetailedProps = {
  report_id: string;
  lca_analysis_id: string;
};

export default function IPCCReportsDetailed({ report_id, lca_analysis_id }: IPCCReportsDetailedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { data: ipccAr6ReportDetailData, isLoading, error } = useGetIpccAr6ReportDetail(report_id);
  const {
    data: lcaAnalysisData,
    isLoading: _isLcaAnalysisLoading,
    error: _lcaAnalysisError,
  } = useGetLcaAnalysisDetail(lca_analysis_id);

  const hasDataError = !isLoading && !ipccAr6ReportDetailData?.data;
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
      console.error('Failed to load IPCC report.', error);
      return;
    }

    console.warn('Failed to load IPCC report: missing report data.');
  }, [hasError, error]);

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
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

  const report = ipccAr6ReportDetailData?.data;
  if (!report) {
    return null;
  }

  // Determine risk level based on emissions
  const getRiskLevel = (emissions: number) => {
    if (emissions > 1000) {
      return { level: 'High Risk', color: 'red' };
    }
    if (emissions > 500) {
      return { level: 'Medium Risk', color: 'yellow' };
    }
    return { level: 'Low Risk', color: 'green' };
  };

  const totalEmissions = Number.parseFloat(String(report?.globalWarmingTotalEmission || 0));
  const riskAssessment = getRiskLevel(totalEmissions);

  // Calculate sustainability targets based on actual data
  const sustainabilityTargets = {
    carbonReduction: {
      baseline: totalEmissions,
      target: 15.0,
      targetYear: 2030,
      targetEmissions: totalEmissions * 0.85, // 15% reduction
    },
    energyEfficiency: {
      baseline: 'Baseline to be established in 2025 based on actual operational data.',
      targetImprovement: 'Target improvement in energy efficiency to be determined after baseline assessment.',
      targetConsumption: 'Target energy consumption to be set in 2025, aiming for significant reduction.',
    },
    wasteReduction: {
      baseline: 'Baseline waste generation to be established in 2025.',
      targetReduction: 'Target waste reduction percentage to be determined based on industry benchmarks and feasibility.',
      targetWaste: 'Target total waste generation to be set in 2025, focusing on circularity and landfill diversion.',
    },
  };

  // Calculate potential savings based on total emissions
  // const decarbonisationOpportunities = [
  //   {
  //     title: 'Sustainable Material Sourcing',
  //     category: 'Material efficiency',
  //     savings: Math.round(totalEmissions * 0.04), // ~4% of total emissions
  //     description: 'Shift to certified sustainable materials to minimize ecological impact.',
  //     dataSource: 'Sustainable Materials Initiative',
  //   },
  //   {
  //     title: 'Energy Efficient Manufacturing',
  //     category: 'Process optimization',
  //     savings: Math.round(totalEmissions * 0.025), // ~2.5% of total emissions
  //     description: 'Adopt energy-efficient machinery and processes to reduce emissions during production.',
  //     dataSource: 'Lean Manufacturing Principles',
  //   },
  //   {
  //     title: 'Recycling Program',
  //     category: 'Circular economy',
  //     savings: Math.round(totalEmissions * 0.015), // ~1.5% of total emissions
  //     description: 'Implement a take-back program for end-of-life products to promote recycling and reduce landfill waste.',
  //     dataSource: 'Circular Economy Framework',
  //   },
  // ];

  const decarbonisationOpportunities = lcaAnalysisData?.data.otherAnalysis?.decarbonization_pathways;

  // const complianceStatus = {
  //   cbam: {
  //     status: 'Not applicable',
  //     description: 'Product does not fall under current CBAM regulations.',
  //   },
  //   eudr: {
  //     status: 'Under review',
  //     description: 'Awaiting EUDR framework guidelines.',
  //   },
  // };

  return (
    <div className="space-y-5 sm:space-y-7 lg:space-y-9" ref={ref}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <GlobeHemisphereEast size={20} className="h-5 w-5 text-sky-600 sm:h-6 sm:w-6" />
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">IPCC AR6 Synthesis Report</h2>
      </div>

      {/* Key Environmental Indicators */}
      <div className="space-y-4 sm:space-y-5">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 sm:text-xl">
          <ChartLineUp size={16} className="h-4 w-4 text-gray-700 sm:h-[18px] sm:w-[18px]" />
          Key Environmental Indicators
        </h3>

        {/* Global Warming Potential */}
        {report?.globalWarmingTotalEmission && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 sm:p-7">
            <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-4 w-4 text-red-600 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-semibold text-red-700 sm:text-lg">Global Warming Potential (GWP100)</h4>
                  <p className="text-sm text-red-600 sm:text-base">Total emissions from all lifecycle stages.</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-3xl font-bold text-red-700 sm:text-4xl">
                  {formatNumberValue(report.globalWarmingTotalEmission)}
                  {' '}
                  <span className="text-base font-normal sm:text-lg">
                    {report.globalWarmingTotalEmissionUnit}
                  </span>
                </p>
              </div>
            </div>
            {/* {report.globalWarmingDescription && (
              <div className="flex items-start space-x-2 border-t border-red-200 pt-3">
                <span className="text-red-600">★</span>
                <span className="text-base text-red-600">
                  Primary indicator - should match total lifecycle emissions from cradle-to-grave analysis
                </span>
              </div>
            )} */}
          </div>
        )}

        {/* Water Consumption Impact */}
        {report?.waterConsumption && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 sm:h-10 sm:w-10">
                  <Droplets className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-semibold text-blue-700 sm:text-lg">Water Consumption Impact</h4>
                  <p className="text-sm text-blue-600 sm:text-base">
                    Water used during material production and processing.
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-3xl font-bold text-blue-700 sm:text-4xl">
                  {formatNumberValue(report.waterConsumption)}
                  {' '}
                  <span className="text-base font-normal sm:text-lg">
                    {report.waterConsumptionUnit}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Land Use Impact */}
        {report?.landUse && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 sm:h-10 sm:w-10">
                  <MapPin className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-semibold text-gray-800 sm:text-lg">Land Use Impact</h4>
                  <p className="text-xs text-gray-600 sm:text-sm">Area used for raw material sourcing.</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-3xl font-bold text-gray-800 sm:text-4xl">
                  {formatNumberValue(report.landUse)}
                  {' '}
                  <span className="text-base font-normal sm:text-lg">
                    {report.landUseUnit}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Biodiversity Impact */}
        {report?.biodiversity && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 sm:h-10 sm:w-10">
                  <Leaf className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-semibold text-gray-800 sm:text-lg">Biodiversity Impact</h4>
                  <p className="text-sm text-gray-600 sm:text-base">
                    Moderate risk due to potential habitat loss from material sourcing.
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-3xl font-bold text-gray-800 sm:text-4xl">
                  {formatNumberValue(report.biodiversity)}
                  {' '}
                  <span className="text-base font-normal sm:text-lg">risk score</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Air Quality Impact */}
        {report?.airEmissions && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 sm:h-10 sm:w-10">
                  <Factory className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-semibold text-gray-800 sm:text-lg">Air Quality Impact</h4>
                  <p className="text-sm text-gray-600 sm:text-base">Emissions from production processes.</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-3xl font-bold text-gray-800 sm:text-4xl">
                  {formatNumberValue(report.airEmissions)}
                  {' '}
                  <span className="text-base font-normal sm:text-lg">
                    {report.airEmissionsUnit}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Waste Generation */}
        {report?.wasteGeneration && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-semibold text-gray-800 sm:text-lg">Waste Generation</h4>
                  <p className="text-sm text-gray-600 sm:text-base">
                    Waste generated from production and end-of-life disposal.
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-3xl font-bold text-gray-800 sm:text-4xl">
                  {formatNumberValue(report.wasteGeneration)}
                  {' '}
                  <span className="text-base font-normal sm:text-lg">
                    {report.wasteGenerationUnit}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reference Note */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start space-x-3">
          <BookOpen className="mt-0.5 text-blue-600" size={16} />
          <p className="text-sm text-blue-700">
            Assessments are aligned with findings from the IPCC Sixth Assessment Report (AR6). See References page for more details.
          </p>
        </div>
      </div>

      {/* Environmental Risk Assessment and Corporate Sustainability Targets */}
      <div className="grid grid-cols-1 gap-5 sm:gap-7 md:grid-cols-2">
        {/* Environmental Risk Assessment */}
        <div className="rounded-xl border border-yellow-200 bg-white p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`rounded-lg p-2 ${
                riskAssessment.color === 'red'
                  ? 'bg-red-100'
                  : riskAssessment.color === 'yellow' ? 'bg-yellow-100' : 'bg-green-100'
              }`}
              >
                <Shield
                  className={`${
                    riskAssessment.color === 'red'
                      ? 'text-red-600'
                      : riskAssessment.color === 'yellow' ? 'text-yellow-600' : 'text-green-600'
                  }`}
                  size={20}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Environmental Risk Assessment</h3>
            </div>
            <span className={`rounded-full px-3 py-1 text-base font-medium ${
              riskAssessment.color === 'red'
                ? 'bg-red-100 text-red-700'
                : riskAssessment.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
            }`}
            >
              {riskAssessment.level}
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <h4 className="font-semibold text-gray-900">Risk Summary</h4>
              {report?.globalWarmingDescription && (
                <p className="mt-1 text-base text-gray-600">
                  {report.globalWarmingDescription}
                </p>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Key Risk Factors</h4>
              <div className="mt-2 space-y-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle
                    className={`${
                      riskAssessment.color === 'red'
                        ? 'text-red-600'
                        : riskAssessment.color === 'yellow' ? 'text-yellow-600' : 'text-green-600'
                    }`}
                    size={16}
                  />
                  <span className="text-base text-gray-700">High carbon emissions from manufacturing processes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle
                    className={`${
                      riskAssessment.color === 'red'
                        ? 'text-red-600'
                        : riskAssessment.color === 'yellow' ? 'text-yellow-600' : 'text-green-600'
                    }`}
                    size={16}
                  />
                  <span className="text-base text-gray-700">Significant water consumption during production</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle
                    className={`${
                      riskAssessment.color === 'red'
                        ? 'text-red-600'
                        : riskAssessment.color === 'yellow' ? 'text-yellow-600' : 'text-green-600'
                    }`}
                    size={16}
                  />
                  <span className="text-base text-gray-700">Waste generation and end-of-life management challenges</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Sustainability Targets */}
        <div className="rounded-xl border border-green-200 bg-white p-5 sm:p-7">
          <div className="mb-4 flex items-center space-x-3">
            <div className="rounded-lg bg-green-100 p-2">
              <Target className="text-green-600" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Corporate Sustainability Targets</h3>
          </div>

          <div className="space-y-5">
            {/* Carbon Emissions Reduction */}
            {report?.globalWarmingTotalEmission && (
              <div>
                <div className="flex items-center space-x-2">
                  <TrendingDown className="text-green-600" size={16} />
                  <h4 className="font-semibold text-green-700">Carbon Emissions Reduction</h4>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Product Baseline GWP (Current Year)</span>
                    <span className="font-medium">
                      {formatNumberValue(sustainabilityTargets.carbonReduction.baseline)}
                      {' '}
                      kg CO₂e
                    </span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Target Reduction (vs. Baseline)</span>
                    <span className="font-medium">
                      {sustainabilityTargets.carbonReduction.target}
                      % by
                      {' '}
                      {sustainabilityTargets.carbonReduction.targetYear}
                    </span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">
                      Target Emissions (
                      {sustainabilityTargets.carbonReduction.targetYear}
                      )
                    </span>
                    <span className="font-medium">
                      {sustainabilityTargets.carbonReduction.targetEmissions.toFixed(2)}
                      {' '}
                      kg CO₂e
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                    EV100 Target: To convert 100% of owned and leased fleet vehicles to electric vehicles (EVs) by 2030.
                  </div>
                </div>
              </div>
            )}

            {/* Energy Efficiency Improvement */}
            <div>
              <div className="flex items-center space-x-2">
                <Zap className="text-orange-600" size={16} />
                <h4 className="font-semibold text-orange-700">Energy Efficiency Improvement</h4>
              </div>
              <div className="mt-2 space-y-1">
                <div className="text-base">
                  <span className="text-gray-600">Baseline Consumption (2025):</span>
                  <span className="ml-2 font-medium">{sustainabilityTargets.energyEfficiency.baseline}</span>
                </div>
                <div className="text-base">
                  <span className="text-gray-600">Target Improvement (2030):</span>
                  <span className="ml-2 font-medium">{sustainabilityTargets.energyEfficiency.targetImprovement}</span>
                </div>
                <div className="text-base">
                  <span className="text-gray-600">Target Consumption (2030):</span>
                  <span className="ml-2 font-medium">{sustainabilityTargets.energyEfficiency.targetConsumption}</span>
                </div>
              </div>
            </div>

            {/* Waste Reduction */}
            <div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="text-purple-600" size={16} />
                <h4 className="font-semibold text-purple-700">Waste Reduction</h4>
              </div>
              <div className="mt-2 space-y-1">
                <div className="text-base">
                  <span className="text-gray-600">Baseline Waste (2025):</span>
                  <span className="ml-2 font-medium">{sustainabilityTargets.wasteReduction.baseline}</span>
                </div>
                <div className="text-base">
                  <span className="text-gray-600">Target Reduction (2030):</span>
                  <span className="ml-2 font-medium">{sustainabilityTargets.wasteReduction.targetReduction}</span>
                </div>
                <div className="text-base">
                  <span className="text-gray-600">Target Waste (2030):</span>
                  <span className="ml-2 font-medium">{sustainabilityTargets.wasteReduction.targetWaste}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="grid grid-cols-1 gap-5 sm:gap-7 md:grid-cols-2">
        {/* CBAM Compliance */}
        {/* <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Shield className="text-blue-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">CBAM Compliance</h3>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-base font-medium text-gray-700">
              {complianceStatus.cbam.status}
            </span>
          </div>
          <p className="mt-3 text-base text-gray-600">
            {complianceStatus.cbam.description}
          </p>
        </div> */}

        {/* EUDR Compliance */}
        {/* <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Leaf className="text-blue-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">EUDR Compliance</h3>
            </div>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-base font-medium text-yellow-700">
              {complianceStatus.eudr.status}
            </span>
          </div>
          <p className="mt-3 text-base text-gray-600">
            {complianceStatus.eudr.description}
          </p>
        </div> */}
      </div>

      {/* Key Findings & Decarbonisation Opportunities */}
      {decarbonisationOpportunities && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Target className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Key Findings & Decarbonisation Opportunities</h3>
              <p className="text-base text-gray-900">
                {decarbonisationOpportunities.implementation_timeline && (
                  <span>
                    Implementation timeline:
                    {' '}
                    <span className="font-medium text-gray-900">{decarbonisationOpportunities.implementation_timeline}</span>
                    {' • '}
                  </span>
                )}
                {decarbonisationOpportunities.reduction_percentage !== undefined && (
                  <span>
                    Total reduction potential:
                    {' '}
                    <span className="font-medium text-gray-900">
                      {decarbonisationOpportunities.reduction_percentage}
                      %
                    </span>
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {decarbonisationOpportunities.total_reduction_potential !== undefined && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="text-base font-semibold text-gray-900">Total CO₂e Savings</p>
                <p className="mt-2 text-3xl font-bold text-green-800">
                  {formatNumberValue(decarbonisationOpportunities.total_reduction_potential)}
                  {' '}
                  <span className="text-base font-normal">
                    {decarbonisationOpportunities.total_reduction_potential_unit}
                  </span>
                </p>
                <div className="mt-2 flex items-center text-base text-gray-900">
                  <TrendingDown size={16} className="mr-1" />
                  Decarbonisation benefit per functional unit
                </div>
              </div>
            )}
            {decarbonisationOpportunities.priority_ranking && decarbonisationOpportunities.priority_ranking.length > 0 && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-base font-semibold text-gray-900">Priority Ranking Snapshot</p>
                <div className="mt-3 space-y-3">
                  {decarbonisationOpportunities.priority_ranking.slice(0, 2).map(rank => (
                    <div key={rank.strategy || rank.rank} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-blue-600" />
                      <div>
                        <p className="text-base font-semibold text-gray-900">
                          #
                          {rank.rank}
                          {' '}
                          {rank.strategy}
                        </p>
                        <p className="text-sm text-gray-900">{rank.rationale}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {decarbonisationOpportunities.priority_ranking && decarbonisationOpportunities.priority_ranking.length > 0 && (
            <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <ListChecks size={18} className="text-gray-700" />
                <h4 className="text-lg font-semibold text-gray-900">Implementation Priorities</h4>
              </div>
              <div className="space-y-3">
                {decarbonisationOpportunities.priority_ranking.map(rank => (
                  <div key={`${rank.rank}-${rank.strategy}`} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-gray-900">
                        #
                        {rank.rank}
                        {' '}
                        {rank.strategy}
                      </p>
                      <span className="text-sm font-semibold text-gray-900 uppercase">Priority</span>
                    </div>
                    {rank.rationale && <p className="mt-1 text-base text-gray-900">{rank.rationale}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {decarbonisationOpportunities.recommendations && decarbonisationOpportunities.recommendations.length > 0 && (
            <div className="space-y-5">
              {decarbonisationOpportunities.recommendations.map(rec => (
                <div key={rec.strategy_name || rec.category} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xl font-semibold text-gray-900">{rec.strategy_name}</h4>
                      {rec.description && <p className="text-base text-gray-900">{rec.description}</p>}
                    </div>
                    {rec.category && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-900 uppercase">
                        <Zap size={14} className="text-gray-500" />
                        {rec.category}
                      </span>
                    )}
                  </div>

                  {rec.potential_savings !== undefined && (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                      <div className="flex items-center gap-3">
                        <TrendingDown size={28} className="text-green-600" />
                        <div>
                          <p className="text-3xl font-bold text-green-800">
                            {formatNumberValue(rec.potential_savings)}
                            {' '}
                            <span className="text-base font-normal">
                              {rec.potential_savings_unit || 'kg CO₂e'}
                            </span>
                          </p>
                          <p className="text-sm font-medium text-green-700">Potential savings per functional unit</p>
                        </div>
                      </div>
                      {rec.savings_percentage !== undefined && (
                        <p className="mt-2 text-xs font-medium text-green-700">
                          {rec.savings_percentage}
                          %
                          {' '}
                          of baseline impact
                        </p>
                      )}
                    </div>
                  )}

                  {rec.cost_impact && (
                    <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-base text-gray-900">
                      {rec.cost_impact}
                    </div>
                  )}

                  {rec.specific_actions && rec.specific_actions.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-900 uppercase">Specific Actions</p>
                      <ul className="mt-2 space-y-1 text-base text-gray-900">
                        {rec.specific_actions.map(action => (
                          <li key={action} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rec.data_sources && rec.data_sources.length > 0 && (
                    <div className="mt-4 border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase">
                        <BookOpen size={14} className="text-gray-500" />
                        Data Sources & References
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {rec.data_sources.map(source => (
                          <span key={source} className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-900">
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Overall Summary */}
      {report?.overallSummary && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <FileText size={18} className="text-gray-700" />
            <h3 className="text-xl font-semibold text-gray-900">
              <span className="mr-1">Overall Summary</span>
              <span className="text-gray-500">(IPCC AR6 Context)</span>
            </h3>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
            <MarkdownConverter content={report.overallSummary} />
          </div>
        </div>
      )}

      {/* Reference Note */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
        <div className="flex items-start space-x-3">
          <BookOpen className="mt-0.5 text-blue-600" size={16} />
          <p className="text-base text-blue-700">
            This assessment follows IPCC AR6 methodologies and incorporates the latest climate science findings.
            All impact calculations are based on peer-reviewed data sources and industry standards.
          </p>
        </div>
      </div>
    </div>
  );
}
