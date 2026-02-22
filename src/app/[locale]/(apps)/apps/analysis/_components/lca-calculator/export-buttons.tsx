'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, Copy, Download, FileText, QrCode } from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import type { LcaCalculatorFormData } from '@/types/lca-calculator';

type ExportType = 'pdf' | 'json';

type LcaExportButtonsProps = {
  assessment: LcaCalculatorFormData;
};

export function generateLCAQRData(assessment: LcaCalculatorFormData) {
  return {
    assessmentId: assessment.id,
    productName: assessment.product_name,
    productCategory: assessment.product_category,
    company: assessment.company_organisation,
    assessmentDate: assessment.assessment_date,
    assessor: assessment.assessor_name,
    climateChange: assessment.impact_climate_change_kg_co2e,
    status: assessment.status,
    accessUrl: `${window.location.origin}/LCADetails?id=${assessment.id}`,
  };
}

export function exportLCAToJSON(assessment: LcaCalculatorFormData) {
  const exportData = {
    $schema: 'https://lca.eu/schema/v1.0',
    lcaVersion: '1.0',
    exportDate: new Date().toISOString(),
    standard: 'ISO 14040/14044',

    productInfo: {
      name: assessment.product_name,
      category: assessment.product_category,
      company: assessment.company_organisation,
      assessmentDate: assessment.assessment_date,
      assessorName: assessment.assessor_name,
    },

    goalAndScope: {
      goalOfStudy: assessment.goal_of_study,
      intendedApplication: assessment.intended_application,
      targetAudience: assessment.target_audience,
      comparativeStudy: assessment.comparative_study,
      scopeDescription: assessment.scope_description,
      functionalUnit: assessment.functional_unit,
      systemBoundary: assessment.system_boundary,
      geographicalScope: assessment.geographical_scope,
      assumptions: assessment.assumptions_limitations,
      allocationProcedures: assessment.allocation_procedures,
      impactMethod: assessment.impact_assessment_method,
    },

    lifeCycleInventory: {
      materials: assessment.materials || [],
      energyInputs: assessment.energy_inputs || [],
      emissions: assessment.emissions || {},
      transport: assessment.transport || [],
      manufacturing: {
        energyKwh: assessment.manufacturing_energy_kwh,
        fuelMj: assessment.manufacturing_fuel_mj,
        renewablePercent: assessment.manufacturing_renewable_percent,
        gridEmissionFactor: assessment.manufacturing_grid_ef,
        fuelEmissionFactor: assessment.manufacturing_fuel_ef,
      },
      usePhase: {
        lifespanYears: assessment.use_phase_lifespan_years,
        energyKwhYear: assessment.use_phase_energy_kwh_year,
        gridEmissionFactor: assessment.use_phase_grid_ef,
        application: assessment.use_phase_application,
        emissionsCo2Kg: assessment.use_phase_emissions_co2_kg,
      },
      endOfLife: {
        recyclingPercent: assessment.eol_recycling_percent,
        incinerationPercent: assessment.eol_incineration_percent,
        landfillPercent: assessment.eol_landfill_percent,
      },
    },

    impactAssessment: {
      method: assessment.impact_assessment_method,
      climateChange_kgCO2e: assessment.impact_climate_change_kg_co2e,
      acidification_molHeq: assessment.impact_acidification_mol_h_eq,
      eutrophication_kgPO4eq: assessment.impact_eutrophication_kg_po4_eq,
      resourceDepletion_kgSbeq: assessment.impact_resource_depletion_kg_sb_eq,
    },

    interpretation: {
      significantIssues: assessment.significant_issues,
      conclusions: assessment.conclusions,
      recommendations: assessment.recommendations,
      criticalHotspots: assessment.critical_hotspots,
      sensitivityAnalysis: assessment.sensitivity_analysis_performed,
    },

    metadata: {
      status: assessment.status,
      createdDate: assessment.created_date,
      updatedDate: assessment.updated_date,
      createdBy: assessment.created_by,
    },
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lca-assessment-${assessment.product_name?.replace(/\s+/g, '-') || assessment.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportLCAToPDF(assessment: LcaCalculatorFormData) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>LCA Report - ${assessment.product_name}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 40px; color: #333; font-size: 11px; }
        .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; border-bottom: 3px solid #10b981; padding-bottom: 20px; }
        .logo { font-size: 22px; font-weight: bold; color: #10b981; }
        .logo-sub { font-size: 11px; color: #666; }
        .report-info { text-align: right; }
        .section { margin-bottom: 20px; page-break-inside: avoid; }
        .section-title { font-size: 13px; font-weight: bold; color: #10b981; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .field { margin-bottom: 8px; }
        .field-label { font-size: 9px; color: #666; text-transform: uppercase; }
        .field-value { font-size: 11px; font-weight: 500; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 15px; font-size: 10px; font-weight: bold; }
        .badge-green { background: #d1fae5; color: #065f46; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        .badge-amber { background: #fef3c7; color: #92400e; }
        .impact-box { text-align: center; padding: 12px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0; }
        .impact-value { font-size: 18px; font-weight: bold; color: #166534; }
        .impact-label { font-size: 9px; color: #15803d; margin-top: 4px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .table th, .table td { border: 1px solid #e5e7eb; padding: 6px 8px; text-align: left; font-size: 10px; }
        .table th { background: #f9fafb; font-weight: 600; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 9px; color: #666; }
        .text-block { background: #f9fafb; padding: 10px; border-radius: 6px; margin-top: 8px; font-size: 10px; line-height: 1.5; }
        @media print { body { padding: 20px; } .section { page-break-inside: avoid; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">📊 Life Cycle Assessment Report</div>
          <div class="logo-sub">ISO 14040/14044 Compliant</div>
        </div>
        <div class="report-info">
          <p style="font-weight: bold; font-size: 14px;">${assessment.product_name || 'Product Assessment'}</p>
          <p style="font-size: 10px; color: #666;">${assessment.company_organisation || ''}</p>
          <span class="badge badge-${assessment.status === 'completed' ? 'green' : assessment.status === 'reviewed' ? 'blue' : 'amber'}">${(assessment.status || 'draft').toUpperCase()}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">1. Goal & Scope Definition</div>
        <div class="grid">
          <div class="field">
            <div class="field-label">Product Category</div>
            <div class="field-value">${assessment.product_category || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">Assessment Date</div>
            <div class="field-value">${assessment.assessment_date || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">Assessor</div>
            <div class="field-value">${assessment.assessor_name || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">Functional Unit</div>
            <div class="field-value">${assessment.functional_unit || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">System Boundary</div>
            <div class="field-value">${assessment.system_boundary || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">Geographical Scope</div>
            <div class="field-value">${assessment.geographical_scope || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">Impact Method</div>
            <div class="field-value">${assessment.impact_assessment_method || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">Comparative Study</div>
            <div class="field-value">${assessment.comparative_study ? 'Yes' : 'No'}</div>
          </div>
        </div>
        ${assessment.goal_of_study ? `<div class="text-block"><strong>Goal:</strong> ${assessment.goal_of_study}</div>` : ''}
        ${assessment.scope_description ? `<div class="text-block"><strong>Scope:</strong> ${assessment.scope_description}</div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">2. Life Cycle Inventory Summary</div>
        <div class="grid-3">
          <div class="field">
            <div class="field-label">Manufacturing Energy</div>
            <div class="field-value">${assessment.manufacturing_energy_kwh || '-'} kWh</div>
          </div>
          <div class="field">
            <div class="field-label">Manufacturing Fuel</div>
            <div class="field-value">${assessment.manufacturing_fuel_mj || '-'} MJ</div>
          </div>
          <div class="field">
            <div class="field-label">Renewable Share</div>
            <div class="field-value">${assessment.manufacturing_renewable_percent || '-'}%</div>
          </div>
          <div class="field">
            <div class="field-label">Use Phase Lifespan</div>
            <div class="field-value">${assessment.use_phase_lifespan_years || '-'} years</div>
          </div>
          <div class="field">
            <div class="field-label">Use Phase Energy</div>
            <div class="field-value">${assessment.use_phase_energy_kwh_year || '-'} kWh/year</div>
          </div>
          <div class="field">
            <div class="field-label">Use Phase CO₂</div>
            <div class="field-value">${assessment.use_phase_emissions_co2_kg || '-'} kg</div>
          </div>
        </div>
        <div class="grid-3" style="margin-top: 15px;">
          <div class="field">
            <div class="field-label">End-of-Life Recycling</div>
            <div class="field-value">${assessment.eol_recycling_percent || '-'}%</div>
          </div>
          <div class="field">
            <div class="field-label">Incineration</div>
            <div class="field-value">${assessment.eol_incineration_percent || '-'}%</div>
          </div>
          <div class="field">
            <div class="field-label">Landfill</div>
            <div class="field-value">${assessment.eol_landfill_percent || '-'}%</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">3. Life Cycle Impact Assessment Results</div>
        <div class="grid-4">
          <div class="impact-box">
            <div class="impact-value">${assessment.impact_climate_change_kg_co2e || '-'}</div>
            <div class="impact-label">Climate Change<br>(kg CO₂ eq)</div>
          </div>
          <div class="impact-box">
            <div class="impact-value">${assessment.impact_acidification_mol_h_eq || '-'}</div>
            <div class="impact-label">Acidification<br>(mol H⁺ eq)</div>
          </div>
          <div class="impact-box">
            <div class="impact-value">${assessment.impact_eutrophication_kg_po4_eq || '-'}</div>
            <div class="impact-label">Eutrophication<br>(kg PO₄ eq)</div>
          </div>
          <div class="impact-box">
            <div class="impact-value">${assessment.impact_resource_depletion_kg_sb_eq || '-'}</div>
            <div class="impact-label">Resource Depletion<br>(kg Sb eq)</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">4. Interpretation</div>
        ${assessment.significant_issues ? `<div class="text-block"><strong>Significant Issues:</strong> ${assessment.significant_issues}</div>` : ''}
        ${assessment.critical_hotspots ? `<div class="text-block"><strong>Critical Hotspots:</strong> ${assessment.critical_hotspots}</div>` : ''}
        ${assessment.conclusions ? `<div class="text-block"><strong>Conclusions:</strong> ${assessment.conclusions}</div>` : ''}
        ${assessment.recommendations ? `<div class="text-block"><strong>Recommendations:</strong> ${assessment.recommendations}</div>` : ''}
        <div class="field" style="margin-top: 10px;">
          <div class="field-label">Sensitivity Analysis Performed</div>
          <div class="field-value">${assessment.sensitivity_analysis_performed ? 'Yes' : 'No'}</div>
        </div>
      </div>

      <div class="footer">
        <p>Generated: ${new Date().toISOString()} | Standards: ISO 14040:2006, ISO 14044:2006, ISO 14067:2018 | Impact Method: ${assessment.impact_assessment_method || 'Not specified'}</p>
        <p style="margin-top: 5px;">This LCA report is for informational purposes. Results should be interpreted considering the defined goal, scope, and limitations.</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  }
}

export function LCAQRCodeDisplay({ assessment }: LcaExportButtonsProps) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrData = generateLCAQRData(assessment);

  useEffect(() => {
    if (canvasRef.current) {
      generateQRCode(canvasRef.current, JSON.stringify(qrData));
    }
  }, [assessment, qrData]);

  const generateQRCode = (canvas: HTMLCanvasElement, data: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const moduleCount = 25;
    const moduleSize = size / moduleCount;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000000';

    const drawPositionPattern = (x: number, y: number) => {
      ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, moduleSize);
      ctx.fillRect(x * moduleSize, (y + 6) * moduleSize, 7 * moduleSize, moduleSize);
      ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, 7 * moduleSize);
      ctx.fillRect((x + 6) * moduleSize, y * moduleSize, moduleSize, 7 * moduleSize);
      ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
    };

    drawPositionPattern(0, 0);
    drawPositionPattern(moduleCount - 7, 0);
    drawPositionPattern(0, moduleCount - 7);

    for (let i = 8; i < moduleCount - 8; i += 2) {
      ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize);
      ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize);
    }

    const hash = data.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
    for (let y = 9; y < moduleCount - 1; y++) {
      for (let x = 9; x < moduleCount - 1; x++) {
        if ((hash + x * y) % 3 === 0) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    for (let y = 1; y < 6; y++) {
      for (let x = 9; x < moduleCount - 1; x++) {
        if ((hash + x + y) % 2 === 0) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(qrData.accessUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `lca-qr-${assessment.product_name?.replace(/\s+/g, '-') || assessment.id}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <QrCode className="w-4 h-4 text-emerald-600" />
          LCA QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="bg-white p-3 rounded-xl inline-block mb-3 shadow-inner border">
          <canvas ref={canvasRef} width={140} height={140} className="rounded" />
        </div>

        <p className="text-xs text-slate-500 mb-3">{assessment.product_name}</p>

        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="w-3 h-3 mr-1 text-emerald-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadQR}>
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function LCAExportButtons({ assessment }: LcaExportButtonsProps) {
  const [exportStatus, setExportStatus] = useState<ExportType | null>(null);

  const handleExport = async (type: ExportType) => {
    setExportStatus(type);

    setTimeout(() => {
      if (type === 'json') {
        exportLCAToJSON(assessment);
      } else if (type === 'pdf') {
        exportLCAToPDF(assessment);
      }

      setTimeout(() => setExportStatus(null), 1500);
    }, 300);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export LCA Report</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          {exportStatus === 'pdf' ? (
            <Check className="w-4 h-4 mr-2 text-emerald-600" />
          ) : (
            <FileText className="w-4 h-4 mr-2" />
          )}
          Export as PDF
          <span className="ml-auto text-xs text-slate-400">Print</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport('json')}>
          {exportStatus === 'json' ? (
            <Check className="w-4 h-4 mr-2 text-emerald-600" />
          ) : (
            <FileText className="w-4 h-4 mr-2" />
          )}
          Export as JSON
          <span className="ml-auto text-xs text-slate-400">Data</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
