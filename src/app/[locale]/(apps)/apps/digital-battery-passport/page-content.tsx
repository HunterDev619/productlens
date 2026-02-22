"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Battery,
  FileCheck,
  Leaf,
  Package,
  Recycle,
  Save,
  Shield,
  Tag,
  Thermometer,
  Wrench,
  Zap,
} from "lucide-react";

import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useToast } from "@/hooks/use-toast";
import type {
  BatteryPassportFormChangeHandler,
  BatteryPassportFormData,
  BatteryPassportPayload,
} from "@/types/battery-passport";
import { createBatteryPassport } from "@/services/battery-passports/create";
import { BatteryPassportSchema, formatValidationErrors } from "@/schemas/battery-passport";

import {
  CapacityEnergyForm,
  CarbonFootprintForm,
  ComplianceForm,
  EfficiencyForm,
  EndOfLifeForm,
  IdentificationForm,
  LabellingForm,
  MaterialsForm,
  QRCodeFieldsForm,
  RecycledContentForm,
  ResistanceLifetimeForm,
  TemperatureEventsForm,
  VoltagePowerForm,
} from "./_components/forms";

type TabConfig = {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const PASSPORT_TABS: TabConfig[] = [
  { id: "identification", label: "Identification", icon: Battery },
  { id: "qrcode", label: "QR Code / GS1", icon: Tag },
  { id: "labelling", label: "Labelling", icon: Tag },
  { id: "carbon", label: "Carbon", icon: Leaf },
  { id: "materials", label: "Materials", icon: Package },
  { id: "recycled", label: "Recycled Content", icon: Recycle },
  { id: "capacity", label: "Capacity & Energy", icon: Battery },
  { id: "voltage", label: "Voltage & Power", icon: Zap },
  { id: "efficiency", label: "Efficiency", icon: Activity },
  { id: "resistance", label: "Resistance", icon: Shield },
  { id: "temperature", label: "Temperature & Events", icon: Thermometer },
  { id: "compliance", label: "Compliance", icon: FileCheck },
  { id: "endoflife", label: "End of Life", icon: Wrench },
];

const DEFAULT_TAB_ID = PASSPORT_TABS[0]?.id ?? "identification";

const generatePassportId = () => `BP-${Date.now().toString(36).toUpperCase()}`;

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const createInitialFormState = (): BatteryPassportFormData => ({
  passport_id: generatePassportId(),
  status: "draft",
  state_of_health: 100,
  due_diligence_compliant: false,
  second_life_applicable: false,
});

export default function NewPassportPageContent() {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>(DEFAULT_TAB_ID);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<BatteryPassportFormData>(() =>
    createInitialFormState(),
  );

  const mutation = useMutation({
    mutationFn: (payload: BatteryPassportPayload) =>
      createBatteryPassport(payload),
    onSuccess: async (response) => {
      // Invalidate battery passports list to refresh data - await completion
      await queryClient.invalidateQueries({ 
        queryKey: ['battery-passports'],
        refetchType: 'all',
      });
      
      toast({
        title: "Battery passport submitted",
        description:
          response?.message ||
          "Your battery passport was created successfully.",
        variant: "success",
      });
      setFormData(createInitialFormState());
      setActiveTab(DEFAULT_TAB_ID);
      
      // Navigate to passports list after successful creation
      router.push('/apps/passports');
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Please review the data and try again.";
      toast({
        title: "Failed to submit passport",
        description: message,
        variant: "error",
      });
    },
  });

  const handleChange = useCallback<BatteryPassportFormChangeHandler>(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // Transform flat form data to nested structure expected by backend
      const identification: Record<string, any> = {};
      const qrCodeGs1: Record<string, any> = {};
      const topLevel: Record<string, any> = {};
      
      // QR Code/GS1 field names
      const qrCodeFields = [
        'gtin', 'serial_number', 'batch_lot_number', 'expiry_date',
        'gs1_company_prefix', 'gs1_link_domain',
        'qr_error_correction', 'qr_size', 'qr_include_logo',
        'access_layer_public_enabled', 'access_layer_authority_enabled',
        'access_layer_legitimate_enabled'
      ];
      
      Object.entries(formData).forEach(([key, value]) => {
        // Skip empty values
        if (value === "" || value === null || value === undefined) {
          return;
        }
        if (Array.isArray(value) && value.length === 0) {
          return;
        }

        // Map form fields to backend structure
        if (key === 'manufacturer_name') {
          identification.manufacturer = value;
        } else if (key === 'battery_category') {
          identification.application = value;
        } else if (key === 'battery_chemistry') {
          identification.chemistry = value;
        } else if (key === 'passport_id' || key === 'status' || key === 'state_of_health' || 
                   key === 'due_diligence_compliant' || key === 'second_life_applicable') {
          topLevel[key] = value;
        } else if (qrCodeFields.includes(key)) {
          // QR Code/GS1 fields go to qrCodeGs1 section
          qrCodeGs1[key] = value;
        } else {
          // All other fields go to identification
          identification[key] = value;
        }
      });

      const payload = {
        ...topLevel,
        ...(Object.keys(identification).length > 0 ? { identification } : {}),
        ...(Object.keys(qrCodeGs1).length > 0 ? { qrCodeGs1 } : {}),
      } as BatteryPassportPayload;

      // Validate the payload using Zod schema
      const validationResult = BatteryPassportSchema.safeParse(payload);

      if (!validationResult.success) {
        const errorMessages = formatValidationErrors(validationResult.error);
        setValidationErrors(validationResult.error.issues.map(issue => issue.path.join('.')));
        
        toast({
          title: "Validation Failed",
          description: (
            <div className="mt-2 space-y-1">
              <p className="font-semibold">Please fill in all required fields (marked with *):</p>
              <ul className="list-disc list-inside space-y-1 max-h-48 overflow-y-auto">
                {errorMessages.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </div>
          ),
          variant: "error",
          duration: 10000, // Show for 10 seconds so user can read all errors
        });
        return;
      }

      // Clear validation errors on successful validation
      setValidationErrors([]);

      mutation.mutate(payload);
    },
    [formData, mutation, toast],
  );

  const TabTriggers = useMemo(
    () =>
      PASSPORT_TABS.map((tab) => {
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
      }),
    [],
  );

  return (
    <div className={`${inter.className} p-6 lg:p-8 max-w-6xl mx-auto bg-[#f8fafc]`}>
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/apps")}
          className="-ml-2 mb-4"
          type="button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Apps
        </Button>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
          Create Battery Passport
        </h1>
        <p className="text-slate-500 mt-1 text-base">
          EU Regulation 2023/1542 Annex XIII - Complete Data Entry
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
            {TabTriggers}
          </TabsList>

          <TabsContent value="identification">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Identification:</strong> Enter basic battery details including passport ID, operator, manufacturer, and manufacturing information required by Annex VI Part A.
              </p>
            </div>
            <IdentificationForm formData={formData} onChange={handleChange} validationErrors={validationErrors} />
          </TabsContent>
          <TabsContent value="qrcode">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>QR Code / GS1 Digital Link:</strong> Configure ISO/IEC 18004-compliant QR code with GS1 Application Identifiers for machine-readable battery traceability per Annex VI-C.
              </p>
            </div>
            <QRCodeFieldsForm formData={formData} onChange={handleChange} validationErrors={validationErrors} />
          </TabsContent>
          <TabsContent value="labelling">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Labelling & Symbols:</strong> Specify collection symbols, hazard labels, carbon footprint marking, and safety information as per Annex VI Part B.
              </p>
            </div>
            <LabellingForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="carbon">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Carbon Footprint:</strong> Document the battery's lifecycle carbon emissions per kWh and total CO₂e, including breakdown by lifecycle stage and performance class (Annex VII).
              </p>
            </div>
            <CarbonFootprintForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="materials">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Materials & Composition:</strong> List battery chemistry, cathode/anode materials, critical raw materials, and hazardous substances with their safety impact information.
              </p>
            </div>
            <MaterialsForm formData={formData} onChange={handleChange} validationErrors={validationErrors} />
          </TabsContent>
          <TabsContent value="recycled">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Recycled Content:</strong> Report pre-consumer and post-consumer recycled material shares for Nickel, Cobalt, Lithium, and Lead as required by Article 8.
              </p>
            </div>
            <RecycledContentForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="capacity">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Capacity & Energy:</strong> Define rated and remaining capacity (Ah, kWh), state of charge (SoC), state of health (SoH), and capacity fade measurements.
              </p>
            </div>
            <CapacityEnergyForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="voltage">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Voltage & Power:</strong> Specify voltage ranges (min/max/nominal), original and remaining power capability, power-to-energy ratio, and power fade.
              </p>
            </div>
            <VoltagePowerForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="efficiency">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Efficiency:</strong> Record round trip energy efficiency at initial state and 50% cycle life, current efficiency, and self-discharge rates over time.
              </p>
            </div>
            <EfficiencyForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="resistance">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Resistance & Lifetime:</strong> Document internal resistance at cell/module/pack level, expected lifetime (years/cycles), energy throughput, and capacity threshold.
              </p>
            </div>
            <ResistanceLifetimeForm
              formData={formData}
              onChange={handleChange}
            />
          </TabsContent>
          <TabsContent value="temperature">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Temperature & Events:</strong> Track operating temperature ranges, time spent in extreme conditions, deep discharge/overcharge events, and accident information.
              </p>
            </div>
            <TemperatureEventsForm
              formData={formData}
              onChange={handleChange}
            />
          </TabsContent>
          <TabsContent value="compliance">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Compliance:</strong> Provide links to conformity declarations, test reports, due diligence documents, dismantling manuals, and spare parts information.
              </p>
            </div>
            <ComplianceForm formData={formData} onChange={handleChange} />
          </TabsContent>
          <TabsContent value="endoflife">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>End of Life:</strong> Enter EPR producer ID, collection scheme details, second life applicability, and end-user waste prevention guidance.
              </p>
            </div>
            <EndOfLifeForm formData={formData} onChange={handleChange} />
          </TabsContent>
        </Tabs>

        <div className="sticky bottom-6 mt-8 flex justify-end gap-4 border border-slate-200 rounded-xl bg-white/80 p-4 shadow-lg backdrop-blur-sm">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/apps")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#059669] hover:bg-[#047857]"
            disabled={mutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {mutation.isPending ? "Creating..." : "Create Passport"}
          </Button>
        </div>
      </form>
    </div>
  );
}
