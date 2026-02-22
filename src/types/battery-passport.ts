export type BatteryPassportFormValue = string | number | boolean | null | undefined | string[] | Record<string, unknown>;

export type BatteryPassportFormData = Record<string, BatteryPassportFormValue>;

export type BatteryPassportQRCodeGs1 = {
  gtin?: string;
  serial_number?: string;
  batch_lot_number?: string;
  expiry_date?: string;
  gs1_company_prefix?: string;
  gs1_link_domain?: string;
  qr_error_correction?: string;
  qr_size?: number;
  qr_include_logo?: boolean;
  access_layer_public_enabled?: boolean;
  access_layer_authority_enabled?: boolean;
  access_layer_legitimate_enabled?: boolean;
};

export type BatteryPassportPayload = {
  passport_id?: string;
  status?: string;
  state_of_health?: number;
  due_diligence_compliant?: boolean;
  second_life_applicable?: boolean;
  identification?: Record<string, BatteryPassportFormValue>;
  qrCodeGs1?: BatteryPassportQRCodeGs1;
  [key: string]: BatteryPassportFormValue | Record<string, BatteryPassportFormValue> | BatteryPassportQRCodeGs1 | undefined;
};

export type BatteryPassportFormChangeHandler = (field: string, value: BatteryPassportFormValue) => void;

export type BatteryPassportFormProps = {
  formData: BatteryPassportFormData;
  onChange: BatteryPassportFormChangeHandler;
  errors?: Record<string, string>;
};
