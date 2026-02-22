/**
 * API Configuration Constants
 */

// Base API URL - defaults to localhost for development
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: 'api/v1/auth/login',
    REFRESH: 'api/v1/auth/refresh',
    LOGOUT: 'api/v1/auth/logout',
    REGISTER: 'api/v1/auth/register',
    FORGOT_PASSWORD: 'api/v1/auth/forgot-password',
    RESET_PASSWORD: 'api/v1/auth/reset-password',
    CONFIRM_RESET_PASSWORD: 'api/v1/auth/confirm-reset-password',
    VERIFY_EMAIL: 'api/v1/auth/verify-email',
  },

  // User endpoints
  USER: {
    PROFILE: 'api/v1/auth/profile',
    UPDATE_PROFILE: 'api/v1/auth/update-user',
    CHANGE_PASSWORD: 'api/v1/user/change-password',
  },

  AI: {
    FIND_PRODUCT_SPECIFICATIONS: 'api/v1/ai/find-product-specifications',
    ANALYSE_RAW_MATERIAL_COMPOSITIONL: 'api/v1/ai/analyse-raw-material-composition',
    CRADLE_TO_GRAVE_LIFECYCLE_ANALYSIS: 'api/v1/ai/cradle-to-grave-lifecycle-analysis',
    GENERATE_IPCC_SYNTHESIS_REPORT: 'api/v1/ai/generate-ipcc-synthesis-report',
    FIND_PRODUCT_SPECIFICATIONS_V2: 'api/v1/ai/find-product-specifications-v2',
    GENERATE_ANALYSIS_REPORT_V2: 'api/v1/ai/generate-analysis-reports-v2',
    GENERATE_ANALYSIS_REPORT_V2_START: 'api/v1/ai/generate-analysis-reports-v2/start',
    GENERATE_ANALYSIS_REPORT_V2_STATUS: 'api/v1/ai/generate-analysis-reports-v2/status/{workflowInstanceId}',
    COMBINED_ANALYSIS_V2_START: 'api/v1/ai/combined-analysis-v2/start',
    COMBINED_ANALYSIS_V2_STATUS: 'api/v1/ai/combined-analysis-v2/status/{workflowInstanceId}',
    COMBINED_ANALYSIS_V2_PROGRESS: 'api/v1/ai/combined-analysis-v2/progress/{requestId}',
    IMPORT_PRODUCT_DATA: 'api/v1/ai/import-product-data',
  },

  PRODUCT_SPECIFICATIONS_V2: {
    LIST: 'api/v1/product-specification-v2',
    DETAIL: 'api/v1/product-specification-v2/{id}',
  },

  USER_ANALYSES: {
    LIST: 'api/v1/user-analyses',
    STATS: 'api/v1/user-analyses/stats',
    RECENT: 'api/v1/user-analyses/recent',
    DETAIL: 'api/v1/user-analyses/{analysisId}',
    DELETE: 'api/v1/user-analyses/{analysisId}',
  },

  PRODUCT_SPECIFICATIONS_V3: {
    DETAIL: 'api/v1/product-specification-v3/{id}',
  },

  MATERIAL_COMPOSITIONS: {
    DETAIL: 'api/v1/material-composition/{id}',
  },

  MATERIAL_COMPONENTS: {
    FIND_BY_MATERIAL_COMPOSITION_ID: 'api/v1/material-components/composition/{id}',
  },

  IPCC_AR6_REPORTS: {
    DETAIL: 'api/v1/ipcc-ar6-reports/{id}',
  },

  LCA_ANALYSIS: {
    DETAIL: 'api/v1/lca-analysis/{id}',
  },

  ANALYSIS_V2: {
    FIND_BY_PRODUCT_SPECIFICATION_ID: 'api/v1/analysis-v2/by-product/{productSpecificationId}',
  },

  ANALYSIS: {
    CREATE: 'api/v1/product-specifications',
  },

  // App-specific endpoints (add your own here)
  APPS: {
    ANALYZE: 'api/v1/apps/analyze',
    HISTORY: 'api/v1/apps/history',
    REFERENCES: 'api/v1/apps/references',
  },

  IMAGES: {
    UPLOAD: 'api/v1/images/upload',
    DOWNLOAD: 'api/v1/images/download/{id}',
    METADATA: 'api/v1/images/metadata/{id}',
  },

  BATTERY_PASSPORTS: {
    CREATE: 'api/v1/battery-passports',
    LIST: 'api/v1/battery-passports',
    DETAIL: 'api/v1/battery-passports/{passportId}',
    UPDATE: 'api/v1/battery-passports/{passportId}',
    DELETE: 'api/v1/battery-passports/{passportId}',
  },

  CATEGORIES: {
    LIST: 'api/v1/categories',
    DETAIL: 'api/v1/categories/{id}',
  },

  PUBLIC_REFERENCES: {
    LIST: 'api/v1/public-references',
    DETAIL: 'api/v1/public-references/{id}',
  },

  ADMIN: {
    USERS: {
      LIST: 'api/v1/admin/users',
      DETAIL: 'api/v1/admin/users/{id}',
      CREATE: 'api/v1/admin/users',
      UPDATE: 'api/v1/admin/users/{id}',
      DELETE: 'api/v1/admin/users/{id}',
      PROMOTE_TO_ADMIN: 'api/v1/admin/users/{id}/promote-to-admin',
      DEMOTE_FROM_ADMIN: 'api/v1/admin/users/{id}/demote-from-admin',
      STATISTICS: 'api/v1/admin/users/statistics/overview',
    },
    PRODUCT_SPECIFICATIONS: {
      LIST: 'api/v1/admin/product-specifications',
      DETAIL: 'api/v1/admin/product-specifications/{id}',
      CREATE: 'api/v1/admin/product-specifications',
      UPDATE: 'api/v1/admin/product-specifications/{id}',
      DELETE: 'api/v1/admin/product-specifications/{id}',
    },
    MATERIAL_COMPOSITIONS: {
      DETAIL: 'api/v1/admin/material-compositions/{id}',
      UPDATE: 'api/v1/admin/material-compositions/{id}',
      DELETE: 'api/v1/admin/material-compositions/{id}',
    },
    LCA_ANALYSIS: {
      DETAIL: 'api/v1/admin/lca-analyses/{id}',
      UPDATE: 'api/v1/admin/lca-analyses/{id}',
      DELETE: 'api/v1/admin/lca-analyses/{id}',
    },
    IPCC_AR6_REPORTS: {
      DETAIL: 'api/v1/admin/ipcc-ar6-reports/{id}',
      UPDATE: 'api/v1/admin/ipcc-ar6-reports/{id}',
      DELETE: 'api/v1/admin/ipcc-ar6-reports/{id}',
    },
    CATEGORIES: {
      LIST: 'api/v1/admin/categories',
      DETAIL: 'api/v1/admin/categories/{id}',
      CREATE: 'api/v1/admin/categories',
      UPDATE: 'api/v1/admin/categories/{id}',
      DELETE: 'api/v1/admin/categories/{id}',
    },
    REFERENCES: {
      LIST: 'api/v1/admin/references',
      DETAIL: 'api/v1/admin/references/{id}',
      CREATE: 'api/v1/admin/references',
      UPDATE: 'api/v1/admin/references/{id}',
      DELETE: 'api/v1/admin/references/{id}',
    },
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 1000000; // 10 seconds
