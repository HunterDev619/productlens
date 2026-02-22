'use client';

import type { LcaCalculatorFormData, LcaEndOfLifeScenario, LcaManufacturingProcess, LcaUsePhaseScenario } from '@/types/lca-calculator';
import { BarChart3 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';

type SummaryCardProps = {
  formData: LcaCalculatorFormData;
};

const calculateManufacturingEmissions = (processes: LcaManufacturingProcess[] = []) =>
  processes.reduce((total, process) => {
    const energy = Number(process.energy_kwh) || 0;
    const gridFactor = Number(process.grid_ef) || 0;
    const fuel = Number(process.fuel_mj) || 0;
    const fuelFactor = Number(process.fuel_ef) || 0;
    const renewableShare = Number(process.renewable_percent) || 0;

    const electricity = energy * gridFactor * (1 - renewableShare / 100);
    const fuelEmissions = fuel * fuelFactor;
    return total + electricity + fuelEmissions;
  }, 0);

const calculateUsePhaseEmissions = (scenarios: LcaUsePhaseScenario[] = []) =>
  scenarios.reduce((total, scenario) => {
    const lifespan = Number(scenario.lifespan_years) || 0;
    const annualEnergy = Number(scenario.energy_kwh_year) || 0;
    const gridFactor = Number(scenario.grid_ef) || 0;

    return total + lifespan * annualEnergy * gridFactor;
  }, 0);

const calculateEndOfLifeImpact = (scenarios: LcaEndOfLifeScenario[] = []) =>
  scenarios.reduce((total, scenario) => {
    const recycling = Number(scenario.recycling_percent) || 0;
    const incineration = Number(scenario.incineration_percent) || 0;
    const landfill = Number(scenario.landfill_percent) || 0;
    const mass = Number(scenario.product_mass_kg) || 1;

    const recyclingCredit = -0.5;
    const incinerationBurden = 0.2;
    const landfillBurden = 0.4;

    const scenarioImpact = ((recycling / 100) * recyclingCredit + (incineration / 100) * incinerationBurden + (landfill / 100) * landfillBurden) * mass;
    return total + scenarioImpact;
  }, 0);

export function SummaryCard({ formData }: SummaryCardProps) {
  const manufacturingEmissions = calculateManufacturingEmissions(formData.manufacturing_processes as LcaManufacturingProcess[]);
  const usePhaseEmissions = calculateUsePhaseEmissions(formData.use_phase_scenarios as LcaUsePhaseScenario[]);
  const endOfLifeImpact = calculateEndOfLifeImpact(formData.eol_scenarios as LcaEndOfLifeScenario[]);
  const total = manufacturingEmissions + usePhaseEmissions + endOfLifeImpact;

  const hasData =
    manufacturingEmissions > 0
    || usePhaseEmissions > 0
    || (formData.eol_scenarios && formData.eol_scenarios.length > 0);

  if (!hasData) {
    return null;
  }

  return (
    <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-900">
          <BarChart3 className="h-5 w-5 text-emerald-600" />
          LCA Carbon Footprint Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border-2 border-emerald-300 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Carbon Footprint</p>
              <p className="text-xs text-slate-500">Manufacturing + Use Phase + End of Life</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-emerald-700">{total.toFixed(2)}</p>
              <p className="text-sm text-emerald-600">kg CO₂e</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {manufacturingEmissions > 0 && (
            <div className="rounded-lg border border-orange-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-orange-700">Manufacturing</p>
                <p className="text-lg font-bold text-orange-600">{manufacturingEmissions.toFixed(2)}</p>
              </div>
              <div className="mt-2 border-t border-orange-100 pt-2 text-xs text-slate-600">
                Contribution:
                {' '}
                <span className="font-semibold text-orange-700">
                  {((manufacturingEmissions / total) * 100).toFixed(1)}
                  %
                </span>
              </div>
            </div>
          )}
          {usePhaseEmissions > 0 && (
            <div className="rounded-lg border border-teal-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-teal-700">Use Phase</p>
                <p className="text-lg font-bold text-teal-600">{usePhaseEmissions.toFixed(2)}</p>
              </div>
              <div className="mt-2 border-t border-teal-100 pt-2 text-xs text-slate-600">
                Contribution:
                {' '}
                <span className="font-semibold text-teal-700">
                  {((usePhaseEmissions / total) * 100).toFixed(1)}
                  %
                </span>
              </div>
            </div>
          )}
          {(formData.eol_scenarios || []).length > 0 && (
            <div className={`rounded-lg border bg-white p-4 ${endOfLifeImpact < 0 ? 'border-green-200' : 'border-red-200'}`}>
              <div className="flex items-center justify-between">
                <p className={`text-xs font-medium ${endOfLifeImpact < 0 ? 'text-green-700' : 'text-red-700'}`}>
                  End of Life
                  {' '}
                  {endOfLifeImpact < 0 ? '(Credit)' : '(Burden)'}
                </p>
                <p className={`text-lg font-bold ${endOfLifeImpact < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {endOfLifeImpact < 0 && '−'}
                  {Math.abs(endOfLifeImpact).toFixed(2)}
                </p>
              </div>
              <div className="mt-2 border-t border-slate-100 pt-2 text-xs">
                <span className={endOfLifeImpact < 0 ? 'text-green-600' : 'text-red-600'}>
                  Impact:
                  {' '}
                  {endOfLifeImpact < 0 ? 'Credit' : 'Burden'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-2 text-sm font-medium text-slate-700">Input Summary</h4>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 md:grid-cols-3">
            {(formData.manufacturing_processes || []).length > 0 && (
              <div>
                Manufacturing processes:
                {' '}
                <span className="font-semibold text-slate-900">{formData.manufacturing_processes?.length}</span>
              </div>
            )}
            {(formData.use_phase_scenarios || []).length > 0 && (
              <div>
                Use phase scenarios:
                {' '}
                <span className="font-semibold text-slate-900">{formData.use_phase_scenarios?.length}</span>
              </div>
            )}
            {(formData.eol_scenarios || []).length > 0 && (
              <div>
                EoL scenarios:
                {' '}
                <span className="font-semibold text-slate-900">{formData.eol_scenarios?.length}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
