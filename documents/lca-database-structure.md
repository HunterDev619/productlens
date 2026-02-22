# LCA Assessment Database JSON Structure

## API Endpoint
```
POST /api/v1/lca-assessments
```

## Required Fields
The minimum required fields for creating an LCA assessment:

```json
{
  "product_name": "Tesla Model 3 Battery Pack",
  "functional_unit": "1 kWh of battery capacity over 8 years",
  "system_boundary": "Cradle-to-Grave",
  "impact_assessment_method": "IPCC AR6"
}
```

## Complete JSON Structure
Full payload structure with all optional fields:

```json
{
  "assessment_date": "2024-12-23",
  "status": "draft",
  
  "goalAndScope": {
    "productName": "Tesla Model 3 Battery Pack",
    "productCategory": "Lithium-ion Battery",
    "companyOrganisation": "Tesla Inc.",
    "assessorName": "Dr. John Smith",
    "geographicalScope": "Global",
    "goalOfStudy": "To assess the environmental impact of Tesla Model 3 battery production and use",
    "intendedApplication": "Product development and EPD generation",
    "targetAudience": "Internal teams and regulatory bodies",
    "comparativeStudy": false,
    "scopeDescription": "This assessment covers the full lifecycle from raw material extraction to end-of-life recycling",
    "functionalUnit": "1 kWh of battery capacity over 8 years",
    "systemBoundary": "Cradle-to-Grave",
    "impactAssessmentMethod": "IPCC AR6",
    "allocationProcedures": "Mass-based allocation",
    "assumptionsLimitations": "Assumes average grid electricity mix, excludes infrastructure"
  },

  "lifeCycleInventory": {
    "materials": [
      {
        "name": "Lithium Carbonate",
        "quantity_kg": 15.5,
        "source_country": "Chile",
        "extraction_method": "Brine extraction",
        "recycled_content_percent": 5,
        "emission_factor": 8.2,
        "notes": "From Atacama Desert operations"
      },
      {
        "name": "Cobalt",
        "quantity_kg": 8.3,
        "source_country": "DRC",
        "extraction_method": "Mining",
        "recycled_content_percent": 10,
        "emission_factor": 12.5,
        "notes": "Ethically sourced"
      }
    ],
    
    "energyInputs": [
      {
        "energy_type": "Grid Electricity",
        "energy_use_kwh": 450,
        "source": "Regional Grid Mix (EU)",
        "emission_factor": 0.45,
        "notes": "Manufacturing facility consumption"
      },
      {
        "energy_type": "Natural Gas",
        "energy_use_kwh": 120,
        "source": "Pipeline Natural Gas",
        "emission_factor": 0.185,
        "notes": "Heating processes"
      }
    ],

    "emissions": {
      "co2": 850.5,
      "ch4": 2.3,
      "n2o": 0.8,
      "nox": 1.2,
      "so2": 0.5,
      "particulate_matter": 0.3
    },

    "transport": [
      {
        "material_product": "Raw Materials",
        "mode": "Ocean Freight",
        "distance_km": 12000,
        "load_factor_percent": 85,
        "trips": 3,
        "emission_factor": 0.015
      },
      {
        "material_product": "Finished Product",
        "mode": "Road Transport",
        "distance_km": 500,
        "load_factor_percent": 75,
        "trips": 1,
        "emission_factor": 0.062
      }
    ],

    "manufacturingProcesses": [
      {
        "process_name": "Cell Assembly",
        "energy_kwh": 350,
        "fuel_mj": 200,
        "renewable_percent": 30,
        "grid_emission_factor": 0.45,
        "fuel_emission_factor": 0.056,
        "waste_generation_kg": 5.2
      },
      {
        "process_name": "Pack Integration",
        "energy_kwh": 100,
        "fuel_mj": 50,
        "renewable_percent": 30,
        "grid_emission_factor": 0.45,
        "fuel_emission_factor": 0.056,
        "waste_generation_kg": 2.1
      }
    ],

    "usePhaseScenarios": [
      {
        "scenario_name": "Normal Use",
        "application": "Electric Vehicle",
        "lifespan_years": 8,
        "annual_energy_kwh": 3000,
        "grid_emission_factor": 0.45,
        "maintenance_notes": "Minimal maintenance required",
        "emissions_co2_kg": 10800
      }
    ],

    "eolScenarios": [
      {
        "scenario_name": "Standard EOL",
        "product_mass_kg": 450,
        "recycling_percent": 85,
        "incineration_percent": 0,
        "landfill_percent": 15,
        "energy_recovery_percent": 0,
        "notes": "Hydrometallurgical recycling process"
      }
    ]
  },

  "impactAssessment": {
    "method": "IPCC AR6",
    "climateChange_kgCO2e": 12500,
    "acidification_molHeq": 45.2,
    "eutrophication_kgPO4eq": 3.8,
    "resourceDepletion_kgSbeq": 0.15,
    "waterUse_m3": 250,
    "landUse_m2a": 12.5
  },

  "interpretation": {
    "significantIssues": "Manufacturing phase contributes 65% of total emissions",
    "criticalHotspots": "Lithium extraction and cell assembly are major hotspots",
    "sensitivityAnalysisPerformed": true,
    "conclusions": "Battery pack shows favorable environmental profile when powered by renewable energy",
    "recommendations": "Increase recycled content and renewable energy in manufacturing"
  },

  "epdPcr": {
    "epdReferences": [
      {
        "registration_number": "EPD-2023-00234",
        "program_operator": "International EPD System",
        "declaration_holder": "Tesla Inc.",
        "issue_date": "2023-01-15",
        "valid_until": "2028-01-15",
        "version": "1.0",
        "url": "https://example.com/epd/2023-00234",
        "reference_product": "Lithium-ion Battery Pack",
        "functional_unit": "1 kWh capacity over 8 years"
      }
    ],
    
    "pcrReferences": [
      {
        "name": "UN CPC 471 - Batteries",
        "reference_number": "PCR-2022-05",
        "version": "2.1",
        "publication_date": "2022-06-01",
        "valid_until": "2027-06-01",
        "un_cpc_code": "471",
        "url": "https://example.com/pcr/2022-05",
        "product_category": "Lithium-ion Batteries",
        "specific_requirements": "Must include battery management system impacts"
      }
    ]
  },

  "dataQuality": {
    "verification_status": "Third-party verified",
    "verifier_name": "SGS Certification",
    "verification_date": "2024-11-15",
    "verification_certificate": "SGS-LCA-2024-11234",
    "iso_compliance_statement": "ISO 14040:2006, ISO 14044:2006, ISO 14067:2018",
    "data_quality_statement": "Primary data for manufacturing, secondary data for upstream processes",
    "comparability_statement": "Results are comparable to other lithium-ion battery EPDs"
  },

  "additionalInformation": {
    "resource_circular_economy": "85% recyclability at end-of-life with closed-loop material recovery",
    "other_environmental_indicators": "Water stress index, biodiversity impact assessment included",
    "scenario_information": "Base scenario assumes EU grid mix, sensitivity analysis for 100% renewable"
  },

  "metadata": {
    "status": "draft",
    "created_date": "2024-12-23T10:30:00Z",
    "updated_date": "2024-12-23T14:45:00Z",
    "created_by": "user_12345"
  }
}
```

## Field Mapping (Frontend to Backend)

| Frontend Field | Backend Location | Backend Field Name |
|----------------|------------------|-------------------|
| product_name | goalAndScope | productName |
| product_category | goalAndScope | productCategory |
| company_organisation | goalAndScope | companyOrganisation |
| assessor_name | goalAndScope | assessorName |
| functional_unit | goalAndScope | functionalUnit |
| system_boundary | goalAndScope | systemBoundary |
| impact_assessment_method | goalAndScope | impactAssessmentMethod |
| materials | lifeCycleInventory | materials |
| energy_inputs | lifeCycleInventory | energyInputs |
| transport | lifeCycleInventory | transport |
| manufacturing_processes | lifeCycleInventory | manufacturingProcesses |
| use_phase_scenarios | lifeCycleInventory | usePhaseScenarios |
| eol_scenarios | lifeCycleInventory | eolScenarios |
| emissions | lifeCycleInventory | emissions |
| significant_issues | interpretation | significantIssues |
| critical_hotspots | interpretation | criticalHotspots |
| conclusions | interpretation | conclusions |
| recommendations | interpretation | recommendations |

## Validation Rules

1. **Required Fields**: product_name, functional_unit, system_boundary, impact_assessment_method
2. **Status Values**: 'draft', 'submitted', 'reviewed', 'completed'
3. **System Boundary Values**: 'Cradle-to-Grave', 'Cradle-to-Gate', 'Gate-to-Gate'
4. **Percentages**: All percentage fields must be 0-100
5. **Dates**: ISO 8601 format (YYYY-MM-DD)

## Example Minimal Valid Request

```json
{
  "goalAndScope": {
    "productName": "Lithium-ion Battery",
    "functionalUnit": "1 kWh capacity",
    "systemBoundary": "Cradle-to-Grave",
    "impactAssessmentMethod": "IPCC AR6"
  }
}
```

## Response Format

```json
{
  "id": "lca_67890",
  "message": "LCA assessment created successfully",
  "assessment": {
    "id": "lca_67890",
    "goalAndScope": { ... },
    "lifeCycleInventory": { ... },
    "impactAssessment": { ... },
    "interpretation": { ... },
    "metadata": {
      "status": "draft",
      "created_date": "2024-12-23T10:30:00Z",
      "updated_date": "2024-12-23T10:30:00Z"
    }
  }
}
```
