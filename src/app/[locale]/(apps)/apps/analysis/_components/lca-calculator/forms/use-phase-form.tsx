'use client';

import { Play, Plus, Trash2 } from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/ui';
import type { LcaCalculatorChangeHandler, LcaCalculatorFormData, LcaUsePhaseScenario } from '@/types/lca-calculator';

import { getString, toNumberOrEmpty } from '../utils';

const DEFAULT_SCENARIO: LcaUsePhaseScenario = {
  scenario_name: '',
  lifespan_years: '',
  energy_kwh_year: '',
  grid_ef: '',
  application: '',
};

export function UsePhaseForm({ formData, onChange }: { formData: LcaCalculatorFormData; onChange: LcaCalculatorChangeHandler }) {
  const scenarios = (formData.use_phase_scenarios ?? []) as LcaUsePhaseScenario[];

  const addScenario = () => onChange('use_phase_scenarios', [...scenarios, { ...DEFAULT_SCENARIO }]);

  const updateScenario = (index: number, changes: Partial<LcaUsePhaseScenario>) => {
    const clone = [...scenarios];
    clone[index] = { ...clone[index], ...changes };
    onChange('use_phase_scenarios', clone);
  };

  const removeScenario = (index: number) => onChange('use_phase_scenarios', scenarios.filter((_, i) => i !== index));

  const scenarioTotal = (scenario: LcaUsePhaseScenario) => {
    const lifespan = Number(scenario.lifespan_years) || 0;
    const annualEnergy = Number(scenario.energy_kwh_year) || 0;
    const gridFactor = Number(scenario.grid_ef) || 0;
    return lifespan * annualEnergy * gridFactor;
  };

  const totalEmissions = scenarios.reduce((sum, scenario) => sum + scenarioTotal(scenario), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-emerald-600" />
          Use Phase
        </CardTitle>
        <CardDescription>LCI Section 5 - Product operation and use phase emissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {scenarios.map((scenario, index) => (
          <div key={`use-${index}`} className="p-4 bg-slate-50 rounded-lg border space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-700">Use Phase Scenario {index + 1}</h4>
              <Button variant="ghost" size="sm" type="button" onClick={() => removeScenario(index)} className="text-red-500 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>Scenario Name</Label>
                <Input
                  value={getString(scenario.scenario_name)}
                  onChange={event => updateScenario(index, { scenario_name: event.target.value })}
                  placeholder="e.g., Primary Use, Second Life"
                />
              </div>
              <div className="space-y-2">
                <Label>Lifespan (years)</Label>
                <Input
                  type="number"
                  value={scenario.lifespan_years ?? ''}
                  onChange={event => updateScenario(index, { lifespan_years: toNumberOrEmpty(event.target.value) })}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label>Energy Use (kWh/year)</Label>
                <Input
                  type="number"
                  value={scenario.energy_kwh_year ?? ''}
                  onChange={event => updateScenario(index, { energy_kwh_year: toNumberOrEmpty(event.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Use Location Grid Factor (kg CO₂/kWh)</Label>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  value={scenario.grid_ef ?? ''}
                  onChange={event => updateScenario(index, { grid_ef: toNumberOrEmpty(event.target.value) })}
                  placeholder="e.g., 0.420"
                />
                <p className="text-xs text-slate-400">Source: IEA 2023. Enter a value or use a national/regional average.</p>
              </div>
              <div className="space-y-2">
                <Label>Application Type</Label>
                <Input
                  value={getString(scenario.application)}
                  onChange={event => updateScenario(index, { application: event.target.value })}
                  placeholder="e.g., EV Passenger Car, ESS Residential"
                />
              </div>
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addScenario} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Use Phase Scenario
        </Button>

        {scenarios.length > 0 && (
          <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-teal-900">Total Use Phase Emissions</p>
                <p className="text-xs text-teal-600">All scenarios combined</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-teal-700">{totalEmissions.toFixed(2)}</p>
                <p className="text-xs text-teal-600">kg CO₂e</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 border-t border-teal-200 pt-3 sm:grid-cols-2">
              {scenarios.map((scenario, index) => {
                const emissions = scenarioTotal(scenario);
                if (!emissions) {
                  return null;
                }
                return (
                  <div key={`summary-${index}`} className="text-xs text-teal-700">
                    <span className="font-medium">{scenario.scenario_name || `Scenario ${index + 1}`}:</span>
                    {' '}
                    {emissions.toFixed(2)}
                    {' '}
                    kg CO₂e
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
