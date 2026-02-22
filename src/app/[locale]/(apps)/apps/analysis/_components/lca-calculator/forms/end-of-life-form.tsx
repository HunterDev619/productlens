import type { LcaCalculatorChangeHandler, LcaCalculatorFormData, LcaEndOfLifeScenario } from '@/types/lca-calculator';
import { Plus, Trash2 } from 'lucide-react';
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

import { toNumberOrEmpty } from '../utils';

const DEFAULT_SCENARIO: LcaEndOfLifeScenario = {
  scenario_name: '',
  product_mass_kg: '',
  recycling_percent: '',
  incineration_percent: '',
  landfill_percent: '',
};

type EndOfLifeFormProps = {
  formData: LcaCalculatorFormData;
  onChange: LcaCalculatorChangeHandler;
};

export function EndOfLifeForm({ formData, onChange }: EndOfLifeFormProps) {
  const scenarios = (formData.eol_scenarios ?? []) as LcaEndOfLifeScenario[];

  const addScenario = () => {
    onChange('eol_scenarios', [...scenarios, { ...DEFAULT_SCENARIO }]);
  };

  const updateScenario = (index: number, payload: Partial<LcaEndOfLifeScenario>) => {
    const next = [...scenarios];
    next[index] = { ...next[index], ...payload };
    onChange('eol_scenarios', next);
  };

  const removeScenario = (index: number) => {
    onChange('eol_scenarios', scenarios.filter((_, i) => i !== index));
  };

  const scenarioImpact = (scenario: LcaEndOfLifeScenario) => {
    const recyclingPercent = Number(scenario.recycling_percent) || 0;
    const incinerationPercent = Number(scenario.incineration_percent) || 0;
    const landfillPercent = Number(scenario.landfill_percent) || 0;
    const productMass = Number(scenario.product_mass_kg) || 1;
    const recyclingCredit = -0.5;
    const incinerationEF = 0.2;
    const landfillEF = 0.4;

    return (
      ((recyclingPercent / 100) * recyclingCredit
        + (incinerationPercent / 100) * incinerationEF
        + (landfillPercent / 100) * landfillEF)
      * productMass
    );
  };

  const totalImpact = scenarios.reduce((sum, scenario) => sum + scenarioImpact(scenario), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-emerald-600" />
          End-of-Life
        </CardTitle>
        <CardDescription>LCI Section 6 - Disposal pathways and recycling</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {scenarios.map((scenario, index) => (
          <div key={`eol-${index}`} className="p-4 bg-slate-50 rounded-lg border space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-700">
                End-of-Life Scenario
                {' '}
                {index + 1}
              </h4>
              <Button variant="ghost" size="sm" type="button" onClick={() => removeScenario(index)} className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>Scenario Name</Label>
                <Input
                  value={scenario.scenario_name ?? ''}
                  onChange={event => updateScenario(index, { scenario_name: event.target.value })}
                  placeholder="Primary EOL, Second Life EOL"
                />
              </div>
              <div className="space-y-2">
                <Label>Product Mass (kg)</Label>
                <Input
                  type="number"
                  value={scenario.product_mass_kg ?? ''}
                  onChange={event => updateScenario(index, { product_mass_kg: toNumberOrEmpty(event.target.value) })}
                  placeholder="1.0"
                />
              </div>
              <div className="space-y-2">
                <Label>Recycling (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={scenario.recycling_percent ?? ''}
                  onChange={event => {
                    const val = event.target.value;
                    if (val === '') {
                      updateScenario(index, { recycling_percent: '' });
                    } else {
                      const num = Number(val);
                      updateScenario(index, { recycling_percent: Math.max(0, Math.min(100, num)) });
                    }
                  }}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Incineration (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={scenario.incineration_percent ?? ''}
                  onChange={event => {
                    const val = event.target.value;
                    if (val === '') {
                      updateScenario(index, { incineration_percent: '' });
                    } else {
                      const num = Number(val);
                      updateScenario(index, { incineration_percent: Math.max(0, Math.min(100, num)) });
                    }
                  }}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Landfill (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={scenario.landfill_percent ?? ''}
                  onChange={event => {
                    const val = event.target.value;
                    if (val === '') {
                      updateScenario(index, { landfill_percent: '' });
                    } else {
                      const num = Number(val);
                      updateScenario(index, { landfill_percent: Math.max(0, Math.min(100, num)) });
                    }
                  }}
                  placeholder="0"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400">Percentages should total 100%</p>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addScenario} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add End-of-Life Scenario
        </Button>

        {scenarios.length > 0 && (
          <div className={`mt-6 p-4 rounded-lg border ${totalImpact < 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${totalImpact < 0 ? 'text-green-900' : 'text-red-900'}`}>
                  Total End-of-Life Impact
                  {' '}
                  {totalImpact < 0 ? '(Credit)' : '(Burden)'}
                </p>
                <p className={`text-xs ${totalImpact < 0 ? 'text-green-600' : 'text-red-600'}`}>All scenarios combined</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${totalImpact < 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {totalImpact < 0 && '−'}
                  {Math.abs(totalImpact).toFixed(2)}
                </p>
                <p className={`text-xs ${totalImpact < 0 ? 'text-green-600' : 'text-red-600'}`}>kg CO₂e</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-200 pt-3 sm:grid-cols-2">
              {scenarios.map((scenario, index) => {
                const impact = scenarioImpact(scenario);
                return (
                  <div key={`eol-summary-${index}`} className="text-xs">
                    <span className={impact < 0 ? 'text-green-600' : 'text-red-600'}>
                      {scenario.scenario_name || `Scenario ${index + 1}`}
                      :
                    </span>
                    <span className={`ml-1 font-medium ${impact < 0 ? 'text-green-800' : 'text-red-800'}`}>
                      {impact < 0 && '−'}
                      {Math.abs(impact).toFixed(2)}
                      {' '}
                      kg CO₂e
                    </span>
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
