'use client';

import type { IPCCReport } from '@/services/product-specifications/detail';

import { Globe, Leaf, Package, Zap } from 'lucide-react';

type IPCCReportsProps = {
  reports: IPCCReport[];
};

export default function IPCCReports({ reports }: IPCCReportsProps) {
  if (!reports || reports.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {reports.map((report: any) => (
        <div key={report.id} className="space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Globe className="text-blue-600" size={24} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-900">
                  IPCC AR6 Synthesis Report
                </h2>
              </div>
            </div>
          </div>

          {/* Key Environmental Indicators */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Key Environmental Indicators</h3>

            {/* Global Warming Potential */}
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-red-100 p-2">
                    <Zap className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700">Global Warming Potential (GWP100)</h4>
                    <p className="text-sm text-red-600">Total emissions from all lifecycle stages.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-700">
                    {report.globalWarmingTotalEmission}
                    {' '}
                    {report.globalWarmingTotalEmissionUnit}
                  </p>
                  <p className="mt-1 text-xs text-red-600">
                    Condition:
                    {' '}
                    {report.globalWarmingCondition}
                  </p>
                </div>
              </div>
            </div>

            {/* Water Consumption Impact */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Globe className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700">Water Consumption Impact</h4>
                    <p className="text-sm text-blue-600">Water used during production processes.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-700">
                    {Number.parseFloat(report.waterConsumption).toLocaleString()}
                    {' '}
                    {report.waterConsumptionUnit}
                  </p>
                </div>
              </div>
            </div>

            {/* Land Use Impact */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <Package className="text-gray-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Land Use Impact</h4>
                    <p className="text-sm text-gray-600">Area used for raw material sourcing.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-700">
                    {report.landUse}
                    {' '}
                    {report.landUseUnit}
                  </p>
                </div>
              </div>
            </div>

            {/* Biodiversity Impact */}
            <div className="rounded-xl border border-green-200 bg-green-50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Leaf className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700">Biodiversity Impact</h4>
                    <p className="text-sm text-green-600">Impact on ecosystem quality and species diversity.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-700">
                    {report.biodiversity}
                    {' '}
                    {report.biodiversityUnit}
                  </p>
                </div>
              </div>
            </div>

            {/* Air Quality Impact */}
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Zap className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-700">Air Quality Impact</h4>
                    <p className="text-sm text-purple-600">Emissions from production processes.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-700">
                    {report.airEmissions}
                    {' '}
                    {report.airEmissionsUnit}
                  </p>
                </div>
              </div>
            </div>

            {/* Waste Generation */}
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-yellow-100 p-2">
                    <Package className="text-yellow-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-700">Waste Generation</h4>
                    <p className="text-sm text-yellow-600">Waste generated from production and end-of-life disposal.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-700">
                    {report.wasteGeneration}
                    {' '}
                    {report.wasteGenerationUnit}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reference Note */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start space-x-3">
              <Globe className="mt-0.5 text-blue-600" size={16} />
              <p className="text-sm text-blue-700">
                Assessments are aligned with findings from the IPCC Sixth Assessment Report (AR6). See References page for more details.
              </p>
            </div>
          </div>

          {/* Environmental Impact Summary */}
          <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6">
            <div className="flex items-start space-x-4">
              <div className="rounded-lg bg-emerald-100 p-2">
                <Leaf className="text-emerald-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Environmental Impact Summary
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Total Lifecycle Emissions</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {report.globalWarmingTotalEmission}
                      {' '}
                      {report.globalWarmingTotalEmissionUnit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Human Health Impact</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {report.healthImpact}
                      {' '}
                      {report.healthImpactUnit}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Summary */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Overall Summary (IPCC AR6 Context)</h3>
            <p className="text-gray-700">
              {report.overallSummary}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
