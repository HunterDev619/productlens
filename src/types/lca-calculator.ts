export type LcaMaterial = {
  name?: string;
  quantity_kg?: number | '';
  source_country?: string;
  extraction_method?: string;
  recycled_content_percent?: number | '';
  emission_factor?: number | '';
  data_source?: string;
  notes?: string;
};

export type LcaEnergyInput = {
  energy_type?: string;
  energy_use_kwh?: number | '';
  source?: string;
  emission_factor?: number | '';
  data_source?: string;
  notes?: string;
};

export type LcaTransportEntry = {
  material_product?: string;
  mode?: string;
  distance_km?: number | '';
  load_factor_percent?: number | '';
  trips?: number | '';
  emission_factor?: number | '';
};

export type LcaManufacturingProcess = {
  process_name?: string;
  energy_kwh?: number | '';
  grid_ef?: number | '';
  fuel_mj?: number | '';
  fuel_ef?: number | '';
  renewable_percent?: number | '';
  grid_emission_factor?: number | '';
  fuel_emission_factor?: number | '';
  waste_generation_kg?: number | '';
};

export type LcaUsePhaseScenario = {
  scenario_name?: string;
  application?: string;
  lifespan_years?: number | '';
  energy_kwh_year?: number | '';
  annual_energy_kwh?: number | '';
  grid_ef?: number | '';
  grid_emission_factor?: number | '';
  maintenance_notes?: string;
  emissions_co2_kg?: number | '';
};

export type LcaEndOfLifeScenario = {
  scenario_name?: string;
  product_mass_kg?: number | '';
  recycling_percent?: number | '';
  incineration_percent?: number | '';
  landfill_percent?: number | '';
  energy_recovery_percent?: number | '';
  notes?: string;
};

export type LcaEpdReference = {
  registration_number?: string;
  program_operator?: string;
  declaration_holder?: string;
  issue_date?: string;
  valid_until?: string;
  version?: string;
  url?: string;
  reference_product?: string;
  functional_unit?: string;
};

export type LcaPcrReference = {
  name?: string;
  reference_number?: string;
  version?: string;
  publication_date?: string;
  valid_until?: string;
  un_cpc_code?: string;
  url?: string;
  product_category?: string;
  specific_requirements?: string;
};

export type LcaEmissions = Record<string, number | ''>;

export type LcaCalculatorFormData = {
  assessment_date?: string;
  status?: string;
  product_name?: string;
  product_category?: string;
  company_organisation?: string;
  assessor_name?: string;
  geographical_scope?: string;
  goal_of_study?: string;
  intended_application?: string;
  target_audience?: string;
  comparative_study?: boolean;
  scope_description?: string;
  functional_unit?: string;
  system_boundary?: string;
  impact_assessment_method?: string;
  allocation_procedures?: string;
  assumptions_limitations?: string;

  // Reference Flow fields
  reference_product?: string;
  reference_flow_unit?: string;
  reference_flow_quantity?: number | '';
  product_mass_kg?: number | '';
  conversion_ratio?: number | '';
  reference_flow_description?: string;
  included_stages?: string;
  exclusions_cutoffs?: string;
  allocation_basis?: string;

  materials?: LcaMaterial[];
  energy_inputs?: LcaEnergyInput[];
  emissions?: LcaEmissions;
  transport?: LcaTransportEntry[];
  manufacturing_processes?: LcaManufacturingProcess[];
  use_phase_scenarios?: LcaUsePhaseScenario[];
  eol_scenarios?: LcaEndOfLifeScenario[];
  epd_references?: LcaEpdReference[];
  pcr_references?: LcaPcrReference[];
  verification_status?: string;
  verifier_name?: string;
  verification_date?: string;
  verification_certificate?: string;
  iso_compliance_statement?: string;
  data_quality_statement?: string;
  comparability_statement?: string;
  resource_circular_economy?: string;
  other_environmental_indicators?: string;
  scenario_information?: string;
  significant_issues?: string;
  critical_hotspots?: string;
  sensitivity_analysis_performed?: boolean;
  conclusions?: string;
  recommendations?: string;

  [key: string]: any;
};

export type LcaCalculatorChangeHandler = <T = any>(field: string, value: T) => void;
