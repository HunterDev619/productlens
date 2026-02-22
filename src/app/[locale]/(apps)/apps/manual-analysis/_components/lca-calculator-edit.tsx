"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  BarChart3,
  Factory,
  FileText,
  Lightbulb,
  Package,
  Play,
  Save,
  Trash2,
  Truck,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from '@/libs/axios';
import { LcaCalculatorSchema, formatLcaValidationErrors } from "@/schemas/lca-calculator";
import type { LcaCalculatorFormData } from "@/types/lca-calculator";

import { LCAExportButtons } from "../../analysis/_components/lca-calculator/export-buttons";
import { EndOfLifeForm } from "../../analysis/_components/lca-calculator/forms/end-of-life-form";
import { EnergyEmissionsForm } from "../../analysis/_components/lca-calculator/forms/energy-emissions-form";
import { EpdPcrForm } from "../../analysis/_components/lca-calculator/forms/epd-pcr-form";
import { GoalScopeForm } from "../../analysis/_components/lca-calculator/forms/goal-scope-form";
import { ImpactForm } from "../../analysis/_components/lca-calculator/forms/impact-form";
import { InterpretationForm } from "../../analysis/_components/lca-calculator/forms/interpretation-form";
import { ManufacturingForm } from "../../analysis/_components/lca-calculator/forms/manufacturing-form";
import { MaterialsForm } from "../../analysis/_components/lca-calculator/forms/materials-form";
import { ReferenceFlowForm } from "../../analysis/_components/lca-calculator/forms/reference-flow-form";
import { SummaryCard } from "../../analysis/_components/lca-calculator/forms/summary-card";
import { TransportForm } from "../../analysis/_components/lca-calculator/forms/transport-form";
import { UsePhaseForm } from "../../analysis/_components/lca-calculator/forms/use-phase-form";

const TABS = [
  { id: "goal", label: "Goal & Scope", icon: FileText },
  { id: "reference", label: "Reference Flow", icon: ArrowLeft },
  { id: "materials", label: "Materials", icon: Package },
  { id: "energy", label: "Energy & Emissions", icon: Zap },
  { id: "transport", label: "Transport", icon: Truck },
  { id: "manufacturing", label: "Manufacturing", icon: Factory },
  { id: "use", label: "Use Phase", icon: Play },
  { id: "eol", label: "End of Life", icon: Trash2 },
  { id: "impact", label: "Impact", icon: BarChart3 },
  { id: "interpretation", label: "Interpretation", icon: Lightbulb },
  { id: "epd-pcr", label: "EPD & PCR", icon: Award },
];

const DEFAULT_TAB_ID = TABS[0]?.id ?? "goal";

// Convert nested backend structure to flat form data
function convertToFormData(assessment: any): LcaCalculatorFormData {
  const data = assessment.data || {};
  const goalAndScope = data.goalAndScope || {};
  const lifeCycleInventory = data.lifeCycleInventory || {};
  const impactAssessment = data.impactAssessment || {};
  const interpretation = data.interpretation || {};
  const epdPcr = data.epdPcr || {};
  const dataQuality = data.dataQuality || {};
  const referenceFlow = data.referenceFlow || {};
  const additionalInfo = data.additionalInfo || {};

  // Convert camelCase keys to snake_case
  const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

  const formData: any = {
    assessment_date: data.assessment_date || "",
    status: data.status || "draft",
    materials: lifeCycleInventory.materials || [],
    energy_inputs: lifeCycleInventory.energyInputs || [],
    transport: lifeCycleInventory.transport || [],
    manufacturing_processes: lifeCycleInventory.manufacturingProcesses || [],
    use_phase_scenarios: lifeCycleInventory.usePhaseScenarios || [],
    eol_scenarios: lifeCycleInventory.eolScenarios || [],
    epd_references: epdPcr.epdReferences || [],
    pcr_references: epdPcr.pcrReferences || [],
    emissions: lifeCycleInventory.emissions || {},
  };

  // Map goalAndScope fields
  Object.entries(goalAndScope).forEach(([key, value]) => {
    formData[toSnakeCase(key)] = value;
  });

  // Map impactAssessment fields with 'impact_' prefix
  Object.entries(impactAssessment).forEach(([key, value]) => {
    formData[`impact_${toSnakeCase(key)}`] = value;
  });

  // Map interpretation fields
  Object.entries(interpretation).forEach(([key, value]) => {
    formData[toSnakeCase(key)] = value;
  });

  // Map dataQuality fields
  Object.entries(dataQuality).forEach(([key, value]) => {
    formData[toSnakeCase(key)] = value;
  });

  // Map referenceFlow fields
  Object.entries(referenceFlow).forEach(([key, value]) => {
    formData[toSnakeCase(key)] = value;
  });

  // Map additionalInfo fields
  Object.entries(additionalInfo).forEach(([key, value]) => {
    formData[toSnakeCase(key)] = value;
  });

  return formData as LcaCalculatorFormData;
}

type LcaCalculatorEditProps = {
  assessment: any;
};

export function LcaCalculatorEdit({ assessment }: LcaCalculatorEditProps) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB_ID);
  const [formData, setFormData] = useState<LcaCalculatorFormData>(() =>
    convertToFormData(assessment),
  );

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosInstance.patch(
        `/api/v1/lca-assessments/${assessment.assessmentId}`,
        payload
      );
      return response.data;
    },
    onSuccess: async () => {
      // Invalidate both list and detail queries - await completion
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['lca-assessments'], refetchType: 'all' }),
        queryClient.invalidateQueries({ queryKey: ['lca-assessment', assessment.assessmentId], refetchType: 'all' }),
      ]);
      
      toast({
        title: "Assessment Updated",
        description: "Your LCA assessment has been updated successfully.",
        variant: "success",
      });
      
      // Navigate back to manual analysis list
      router.push("/apps/manual-analysis");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Please review the data and try again.";
      toast({
        title: "Failed to update assessment",
        description: message,
        variant: "error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(
        `/api/v1/lca-assessments/${assessment.assessmentId}`
      );
      return response.data;
    },
    onSuccess: async () => {
      // Invalidate LCA assessments list - await completion
      await queryClient.invalidateQueries({ 
        queryKey: ['lca-assessments'],
        refetchType: 'all',
      });
      
      toast({
        title: "Assessment Deleted",
        description: "Your LCA assessment has been deleted successfully.",
        variant: "success",
      });
      router.push("/apps/manual-analysis");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete the assessment.";
      toast({
        title: "Delete Failed",
        description: message,
        variant: "error",
      });
    },
  });

  const handleChange = useCallback(
    (field: string, value: any) => {
      // Validate percentage fields in arrays (materials, transport, manufacturing, eol scenarios)
      if (Array.isArray(value)) {
        const validatedArray = value.map((item) => {
          const validatedItem = { ...item };
          
          // Check all keys in the item for percentage fields
          Object.keys(validatedItem).forEach((key) => {
            if (key.includes('percent') || key.includes('_percent')) {
              const numValue = Number(validatedItem[key]);
              
              // If it's a valid number, clamp it between 0 and 100
              if (!isNaN(numValue) && validatedItem[key] !== '' && validatedItem[key] !== null) {
                validatedItem[key] = Math.max(0, Math.min(100, numValue));
              }
            }
          });
          
          return validatedItem;
        });
        
        setFormData((prev) => ({ ...prev, [field]: validatedArray }));
      } else {
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
    },
    [],
  );

  const handleExit = useCallback(() => {
    router.push("/apps/manual-analysis");
  }, [router]);

  const handleDelete = useCallback(() => {
    if (window.confirm(
      `Are you sure you want to delete assessment "${assessment.assessmentId}"? This action cannot be undone.`
    )) {
      deleteMutation.mutate();
    }
  }, [assessment.assessmentId, deleteMutation]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // Transform flat form data to nested structure for backend
      const goalAndScope: Record<string, any> = {};
      const lifeCycleInventory: Record<string, any> = {};
      const impactAssessment: Record<string, any> = {};
      const interpretation: Record<string, any> = {};
      const epdPcr: Record<string, any> = {};
      const dataQuality: Record<string, any> = {};
      const referenceFlow: Record<string, any> = {};
      const additionalInfo: Record<string, any> = {};
      const topLevel: Record<string, any> = {};

      Object.entries(formData).forEach(([key, value]) => {
        // Skip empty values
        if (value === "" || value === null || value === undefined) {
          return;
        }
        if (Array.isArray(value) && value.length === 0) {
          return;
        }

        // Map form fields to backend structure
        // Top-level fields
        if (key === 'assessment_date') {
          topLevel[key] = value;
        }
        // Goal and Scope
        else if (['product_name', 'product_category', 'company_organisation', 'assessor_name', 
                  'geographical_scope', 'goal_of_study', 'intended_application', 'target_audience',
                  'comparative_study', 'scope_description', 'functional_unit', 'system_boundary',
                  'impact_assessment_method', 'allocation_procedures', 'assumptions_limitations'].includes(key)) {
          const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          goalAndScope[camelKey] = value;
        }
        // Life Cycle Inventory
        else if (['materials', 'energy_inputs', 'emissions', 'transport', 'manufacturing_processes',
                  'use_phase_scenarios', 'eol_scenarios'].includes(key)) {
          const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          lifeCycleInventory[camelKey] = value;
        }
        // Impact Assessment - fields starting with impact_
        else if (key.startsWith('impact_')) {
          const cleanKey = key.replace('impact_', '').replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          impactAssessment[cleanKey] = value;
        }
        // Interpretation
        else if (['significant_issues', 'critical_hotspots', 'sensitivity_analysis_performed',
                  'conclusions', 'recommendations'].includes(key)) {
          const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          interpretation[camelKey] = value;
        }
        // EPD/PCR
        else if (['epd_references', 'pcr_references'].includes(key)) {
          const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          epdPcr[camelKey] = value;
        }
        // Data Quality
        else if (['verification_status', 'verifier_name', 'verification_date', 'verification_certificate',
                  'iso_compliance_statement', 'data_quality_statement', 'comparability_statement'].includes(key)) {
          const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          dataQuality[camelKey] = value;
        }
        // Reference Flow
        else if (['reference_product', 'reference_flow_unit', 'reference_flow_quantity', 'product_mass_kg',
                  'conversion_ratio', 'reference_flow_description', 'included_stages', 'exclusions_cutoffs',
                  'allocation_basis'].includes(key)) {
          const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          referenceFlow[camelKey] = value;
        }
        // Additional Environmental Information
        else if (['resource_circular_economy', 'other_environmental_indicators', 'scenario_information'].includes(key)) {
          const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          additionalInfo[camelKey] = value;
        }
      });

      const payload: any = {
        ...topLevel,
        ...(Object.keys(goalAndScope).length > 0 ? { goalAndScope } : {}),
        ...(Object.keys(lifeCycleInventory).length > 0 ? { lifeCycleInventory } : {}),
        ...(Object.keys(impactAssessment).length > 0 ? { impactAssessment } : {}),
        ...(Object.keys(interpretation).length > 0 ? { interpretation } : {}),
        ...(Object.keys(epdPcr).length > 0 ? { epdPcr } : {}),
        ...(Object.keys(dataQuality).length > 0 ? { dataQuality } : {}),
        ...(Object.keys(referenceFlow).length > 0 ? { referenceFlow } : {}),
        ...(Object.keys(additionalInfo).length > 0 ? { additionalInfo } : {}),
      };

      // Validate the payload
      const validationResult = LcaCalculatorSchema.safeParse(formData);

      if (!validationResult.success) {
        const errorMessages = formatLcaValidationErrors(validationResult.error);
        
        toast({
          title: "Validation Failed",
          description: (
            <div className="mt-2 space-y-1">
              <p className="font-semibold">Missing required fields:</p>
              <ul className="list-disc list-inside space-y-1 max-h-48 overflow-y-auto">
                {errorMessages.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </div>
          ),
          variant: "error",
          duration: 10000,
        });
        return;
      }

      mutation.mutate(payload);
    },
    [formData, mutation, toast],
  );

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto bg-[#f8fafc]">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={handleExit}
          className="-ml-2 mb-4"
          type="button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Manual Analysis
        </Button>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
          Edit LCA Assessment
        </h1>
        <p className="text-slate-500 mt-1 text-[16px]">
          Assessment ID: {assessment.assessmentId}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm text-[#737373] data-[state=active]:border-[#a6f3d0] data-[state=active]:bg-[#ecfdf6] data-[state=active]:text-[#047857] [&_svg]:text-[#737373] data-[state=active]:[&_svg]:text-[#047857]"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="goal">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Goal & Scope Definition:</strong> Define the purpose, intended application, functional unit, system boundaries, and methodology for your LCA study per ISO 14040.
              </p>
            </div>
            <GoalScopeForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="reference">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Reference Flow:</strong> Specify the quantified product or service output from your system that fulfills the functional unit, including conversion ratios and system boundary alignment.
              </p>
            </div>
            <ReferenceFlowForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="materials">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Material Inventory:</strong> Document all raw materials, quantities, extraction methods, recycled content, and emission factors for material acquisition and processing.
              </p>
            </div>
            <MaterialsForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="energy">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Energy & Emissions:</strong> Record energy consumption by type and source, plus direct air, water, and solid waste emissions with GHG calculations per IPCC AR6.
              </p>
            </div>
            <EnergyEmissionsForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="transport">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Transportation:</strong> Track all transport activities including mode, distance, load factors, and emission factors for material and product distribution per GLEC Framework.
              </p>
            </div>
            <TransportForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="manufacturing">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Manufacturing:</strong> Detail manufacturing process energy use (electricity and fuel), grid emission factors, renewable energy share, and process-specific emissions.
              </p>
            </div>
            <ManufacturingForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="use">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Use Phase:</strong> Define use scenarios including product lifespan, annual energy consumption, operating location grid factors, and application-specific parameters.
              </p>
            </div>
            <UsePhaseForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="eol">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>End-of-Life:</strong> Specify disposal pathways (recycling, incineration, landfill percentages) to calculate environmental credits from material recovery and burdens from waste treatment.
              </p>
            </div>
            <EndOfLifeForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="impact">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Impact Assessment:</strong> Enter calculated environmental impacts including climate change (CO₂e), acidification, eutrophication, and resource depletion per your selected LCIA method.
              </p>
            </div>
            <ImpactForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="interpretation">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Interpretation:</strong> Review carbon footprint summary, identify significant environmental issues, hotspots, draw conclusions, and provide improvement recommendations.
              </p>
            </div>
            <div className="space-y-6">
              <SummaryCard formData={formData} />
              <InterpretationForm formData={formData} onChange={handleChange} />
            </div>
          </TabsContent>
          <TabsContent value="epd-pcr">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>EPD & PCR Compliance:</strong> Document Environmental Product Declaration and Product Category Rules references, third-party verification, and ISO 14025/14067 compliance statements.
              </p>
            </div>
            <EpdPcrForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="references">
          </TabsContent>
        </Tabs>

        <div className="sticky bottom-6 mt-8 flex flex-col gap-4 border border-slate-200 rounded-md bg-white/80 p-4 shadow-lg backdrop-blur-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <LCAExportButtons assessment={formData} />
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={handleExit}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#059669] hover:bg-[#047857]"
              disabled={mutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {mutation.isPending ? "Updating..." : "Update Assessment"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
