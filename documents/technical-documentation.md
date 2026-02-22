# ProductLensAI Technical Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Key Features & Modules](#key-features--modules)
6. [API Integration](#api-integration)
7. [Database Schema](#database-schema)
8. [Authentication & Security](#authentication--security)
9. [Deployment](#deployment)
10. [Development Guidelines](#development-guidelines)

---

## Project Overview

ProductLensAI is a comprehensive AI-powered sustainability analysis platform that provides Life Cycle Assessment (LCA) and IPCC-based climate change evaluations for products. The application consists of two main interfaces:

- **Customer-Facing Application**: Allows users to upload product images, receive AI-driven analysis, view history, and access reference materials
- **Admin Console**: Provides comprehensive management tools for users, product data, references, categories, and analytics

The platform has been migrated from Base44 to a custom-hosted solution using Next.js, Supabase, and modern cloud infrastructure.

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Customer  │  │    Admin     │  │    Auth     │       │
│  │     App     │  │   Console    │  │   Pages     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Service Layer (React Query)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Auth API   │  │   Admin API  │  │    AI API   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API (FastAPI - Python)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Auth Service│  │ Admin Service│  │  AI Service  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │   Supabase   │  │  OpenRouter  │
│              │  │     Auth     │  │   (LLM API) │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Application Structure

The application follows Next.js App Router conventions with route groups:

- `(admin)`: Admin-only routes requiring authentication
- `(apps)`: Customer-facing application routes
- `(home)`: Public landing pages
- `auth`: Authentication pages (login, register, password reset)

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.0 | React framework with App Router |
| **React** | 19.1.1 | UI library |
| **TypeScript** | 5.8.3 | Type safety |
| **Tailwind CSS** | 4.1.12 | Utility-first CSS framework |
| **Framer Motion** | 12.23.12 | Animation library |
| **React Hook Form** | 7.62.0 | Form state management |
| **Zod** | 4.0.17 | Schema validation |
| **TanStack Table** | 8.21.3 | Data table component |
| **React Query** | 5.89.0 | Server state management |
| **Axios** | 1.12.2 | HTTP client |

### Backend Integration

| Service | Purpose |
|---------|---------|
| **FastAPI** | Python backend API (to be fully implemented) |
| **Supabase Auth** | User authentication and session management |
| **PostgreSQL** | Primary database |
| **OpenRouter** | Smart orchestrator for different LLM models and providers |

### Deployment

| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting and deployment |
| **GitHub Actions** | CI/CD pipeline |
| **Docker** | Containerization (for backend) |

---

## Project Structure

```
productlens_nextjs/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   └── [locale]/                 # Internationalization support
│   │       ├── (admin)/              # Admin route group
│   │       │   └── admin/
│   │       │       ├── overview/    # Admin dashboard
│   │       │       ├── users/        # User management
│   │       │       ├── product-analysis/  # Product data management
│   │       │       └── references/   # References & categories
│   │       ├── (apps)/               # Customer app route group
│   │       │   └── apps/
│   │       │       ├── analyze/      # Product analysis upload
│   │       │       ├── history/      # Analysis history
│   │       │       ├── references/   # Public references
│   │       │       └── profile/      # User profile
│   │       ├── (home)/               # Public pages
│   │       └── auth/                 # Authentication pages
│   │           ├── login/
│   │           ├── register/
│   │           ├── forgot-password/
│   │           └── reset-password/
│   ├── components/                    # Shared UI components
│   │   └── ui/                       # Base UI components
│   ├── services/                      # API service layer
│   │   ├── admin/                    # Admin API services
│   │   ├── ai/                       # AI analysis services
│   │   ├── auth/                     # Authentication services
│   │   ├── user/                     # User services
│   │   └── types.ts                  # TypeScript types
│   ├── schemas/                      # Zod validation schemas
│   │   ├── admin/                    # Admin schemas
│   │   └── upload.ts                 # Upload validation
│   ├── utils/                        # Utility functions
│   │   └── namespaces/              # Namespaced utilities
│   │       └── format.ts             # Number/currency formatting
│   ├── libs/                         # Library configurations
│   │   ├── axios.ts                  # Axios instance
│   │   └── supabase.ts              # Supabase client
│   └── constants/                    # Application constants
│       └── api.ts                    # API endpoints
├── documents/                        # Project documentation
│   ├── proposal.md                  # Project proposal
│   └── technical-documentation.md   # This file
├── .github/
│   └── workflows/                    # CI/CD workflows
│       ├── vercel-staging.yml       # Staging deployment
│       └── vercel-production.yml    # Production deployment
└── package.json                      # Dependencies

```

---

## Key Features & Modules

### 1. Customer-Facing Application

#### 1.1 Analyse Module (`/apps/analysis`)

**Purpose**: Allows users to upload product images for AI-driven sustainability analysis.

**Key Components**:
- `upload-form.tsx`: File upload with drag-and-drop, preview, and validation
- `analysis.tsx`: Displays product specifications and market information
- `raw-material-composition.tsx`: Shows material breakdown
- `cradle-to-grave-analysis.tsx`: Lifecycle analysis visualization
- `ipcc-synthesis-report.tsx`: IPCC AR6 climate impact report
- `supply-chain-traceability-and-transportation.tsx`: Supply chain mapping with Leaflet maps

**Features**:
- File upload validation (JPG, JPEG, PNG, WebP, max 5MB)
- Real-time analysis progress
- Automatic LCA report generation
- Retry mechanism for failed analyses
- Cancelable requests

**API Flow**:
```
1. Upload Image → findProductSpecificationsV2
2. Get Product Specs → generateAnalysisReportV2
3. Display Results → Multiple analysis components
```

#### 1.2 History Module (`/apps/history`)

**Purpose**: Displays user's past analysis results.

**Key Components**:
- `page-content.tsx`: List view with pagination
- `product-card.tsx`: Individual product card component
- `[id]/page-content.tsx`: Detailed analysis view
- Multiple detail components for different analysis sections

**Features**:
- Paginated product list
- Search and filter capabilities
- Detailed view with all analysis components
- Data source citations

#### 1.3 References Module (`/apps/references`)

**Purpose**: Public access to standards, documents, and compliance references.

**Key Components**:
- `references-grid.tsx`: Grid layout for references
- `reference-card.tsx`: Individual reference card
- `category-filter.tsx`: Filter by category
- `references-search.tsx`: Search functionality
- `references-pagination.tsx`: Pagination controls

**Features**:
- Category-based filtering
- Search functionality
- Public/private access control
- URL-based reference links

#### 1.4 Profile Module (`/apps/profile`)

**Purpose**: User profile management.

**Key Components**:
- `ProfileHeader.tsx`: User information display
- `ContactInformation.tsx`: Contact details management
- `Security.tsx`: Password change functionality

### 2. Admin Console

#### 2.1 Overview Dashboard (`/admin/overview`)

**Purpose**: Quick summary of key metrics and system health.

**Planned Features** (per proposal):
- Active users metrics (today, yesterday, custom ranges)
- Revenue tracking (last 7 days or custom periods)
- User invitation tools
- Quick action buttons

#### 2.2 User Management (`/admin/users`)

**Purpose**: Comprehensive user administration.

**Key Components**:
- `UserTable.tsx`: User data table with sorting/filtering
- `UserTableColumns.tsx`: Column definitions
- `CreateUserModal.tsx`: User creation dialog
- `UserDetailModal.tsx`: User detail view
- `InlineChart.tsx`: User statistics visualization

**Features**:
- CRUD operations (Create, Read, Update, Delete)
- Role management (Admin/User)
- Status management (Active/Inactive)
- Search and pagination
- User statistics

#### 2.3 Product Analysis Management (`/admin/product-analysis`)

**Purpose**: Manage product specifications, material compositions, LCA analyses, and IPCC reports.

**Key Components**:
- `page-content.tsx`: Product list with filters
- `[id]/page-content.tsx`: Product detail view
- `product-specifications-form.tsx`: Edit product specifications
- `material-composition-form.tsx`: Edit material composition
- `lca-analysis-form.tsx`: Edit LCA analysis data
- `ipcc-ar6-report-form.tsx`: Edit IPCC AR6 reports

**Features**:
- Full CRUD operations for all product data
- JSON editor for complex data structures
- Form validation with Zod schemas
- React Hook Form integration
- Real-time data updates

**LCA Analysis Form Highlights**:
- Timeline analysis (milestones, lifecycle progression)
- Emission velocity tracking
- Total lifecycle carbon calculation
- Equivalency comparisons
- Supply chain mapping
- Geographic analysis

#### 2.4 References & Categories Management (`/admin/references`)

**Purpose**: Manage reference materials and category taxonomy.

**Key Components**:
- `page-content.tsx`: Dual-mode interface (References/Categories)
- `references-table.tsx`: Data table component
- `create-reference-dialog.tsx`: Create reference dialog
- `edit-reference-dialog.tsx`: Edit reference dialog
- `delete-reference-dialog.tsx`: Delete confirmation
- `stats-cards.tsx`: Statistics display
- `table-columns.tsx`: Column definitions

**Features**:
- Mode toggle between References and Categories
- Full CRUD operations
- Search and filtering
- Pagination
- Statistics cards
- Category assignment for references

### 3. Authentication System

#### 3.1 Login (`/auth/login`)

**Features**:
- Email/password authentication
- Form validation
- Error handling
- Redirect to dashboard after login

#### 3.2 Registration (`/auth/register`)

**Features**:
- Email/password registration
- Email verification (planned)
- Form validation
- Success/error feedback

#### 3.3 Password Reset Flow

**Components**:
- `forgot-password`: Request password reset email
- `reset-password`: Reset password with token validation

**Flow**:
```
1. User requests reset → POST /api/v1/auth/forgot-password
2. Email sent with recovery link
3. User clicks link → URL hash contains access_token, refresh_token, type=recovery
4. ResetPasswordForm restores session via supabase.auth.setSession()
5. User enters new password → supabase.auth.updateUser()
6. Session cleared → Redirect to login
```

**Key Implementation**:
- Token parsing from URL hash
- Session restoration before password update
- Validation and error handling
- Automatic redirect after success

---

## API Integration

### API Base Configuration

**Base URL**: `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'`

### API Endpoints Structure

#### Authentication Endpoints

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
    REGISTER: '/api/v1/auth/register',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
  },
  // ... other endpoints
} as const;
```

#### AI Analysis Endpoints

```typescript
export const API_ENDPOINTS = {
  AI: {
    FIND_PRODUCT_SPECIFICATIONS: '/api/v1/ai/find-product-specifications',
    FIND_PRODUCT_SPECIFICATIONS_V2: '/api/v1/ai/find-product-specifications-v2',
    GENERATE_ANALYSIS_REPORT_V2: '/api/v1/ai/generate-analysis-reports-v2',
    ANALYSE_RAW_MATERIAL_COMPOSITIONL: '/api/v1/ai/analysis-raw-material-composition',
    CRADLE_TO_GRAVE_LIFECYCLE_ANALYSIS: '/api/v1/ai/cradle-to-grave-lifecycle-analysis',
    GENERATE_IPCC_SYNTHESIS_REPORT: '/api/v1/ai/generate-ipcc-synthesis-report',
  },
  // ... other endpoints
} as const;
```

#### Admin Endpoints

```typescript
export const API_ENDPOINTS = {
  ADMIN: {
    USERS: {
      LIST: '/api/v1/admin/users',
      DETAIL: '/api/v1/admin/users/{id}',
      CREATE: '/api/v1/admin/users',
      UPDATE: '/api/v1/admin/users/{id}',
      DELETE: '/api/v1/admin/users/{id}',
      STATISTICS: '/api/v1/admin/users/statistics/overview',
    },
    PRODUCT_SPECIFICATIONS: { /* ... */ },
    MATERIAL_COMPOSITIONS: { /* ... */ },
    LCA_ANALYSIS: { /* ... */ },
    IPCC_AR6_REPORTS: { /* ... */ },
    CATEGORIES: { /* ... */ },
    REFERENCES: { /* ... */ },
  },
  // ... other endpoints
} as const;
```

### Service Layer Pattern

All API calls are wrapped in React Query hooks for:
- Automatic caching
- Request deduplication
- Loading states
- Error handling
- Refetching on focus

**Example Service Structure**:
```typescript
// src/services/admin/users/list.ts
export const useAdminListUsers = (params?: ListUsersParams) => {
  return useQuery({
    queryKey: ['admin', 'users', 'list', params],
    queryFn: () => getUsers(params),
  });
};
```

---

## Database Schema

### Core Entities

#### User
```typescript
{
  id: string (UUID);
  email: string;
  fullName: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  pricingPlan: 'default' | 'premium';
  registeredAt: Date;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Product Specification
```typescript
{
  id: string; // UUID
  userId: string; // UUID
  productName: string;
  productGeneralName: string;
  manufacturer: string;
  skuNumber: string | null;
  origin: string;
  lifespan: number;
  totalWeight: string;
  totalWeightUnit: string;
  dimensions: Array<string> | null;
  dimensionsUnit: string | null;
  categoryName: Array<string>;
  marketPrice: Array<string>;
  productInformation: Record<string, any>;
  productSpecifications: Record<string, any>;
  dataSources: Array<DataSource>;
  verificationStatus: string;
  confidenceScore: string;
  imageId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

#### LCA Analysis
```typescript
type LCAAnalysis = {
  id: string; // UUID
  userId: string; // UUID
  productSpecificationId: string | null; // UUID
  mainLcaAnalysis: Record<string, any>; // JSON structure
  dataSources: Array<Citation>;
  otherAnalysis: {
    usage?: {
      total_tokens?: number;
      prompt_tokens?: number;
      completion_tokens?: number;
    };
    timeline_analysis?: {
      milestones?: Array<{ day: number; event: string; significance: string }>;
      emission_velocity?: {
        peak_emission_phase: string;
        cumulative_emissions: number;
        daily_average_emissions: number;
      };
      lifecycle_progression?: Array<{
        stage: string;
        emissions: number;
        duration_days: number;
        key_activities: Array<string>;
      }>;
      total_lifecycle_carbon?: number;
    };
    geographic_analysis?: Record<string, any>;
    supply_chain_mapping?: Record<string, any>;
    equivalency_comparisons?: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
};
```

#### Reference
```typescript
{
  id: string (UUID);
  categoryId: string (UUID);
  name: string;
  description: string;
  url: string | null;
  access: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Category
```typescript
{
  id: string (UUID);
  title: string;
  icon: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Authentication & Security

### Authentication Flow

1. **Login**: User submits email/password → Backend validates → Returns JWT tokens
2. **Token Storage**: Access token stored in memory, refresh token in httpOnly cookie
3. **Token Refresh**: Automatic refresh before expiration
4. **Logout**: Clears tokens and session

### Supabase Integration

**Password Reset Flow**:
- Uses Supabase Auth recovery tokens
- Tokens passed via URL hash (`#access_token=...&refresh_token=...&type=recovery`)
- Session restored client-side before password update
- Secure token validation

**Session Management**:
```typescript
// Restore session from recovery token
const { data, error } = await supabase.auth.setSession({
  access_token: accessToken,
  refresh_token: refreshToken || '',
});

// Update password after session restoration
const { error } = await supabase.auth.updateUser({
  password: newPassword,
});
```

### Security Best Practices

- All API calls include authentication headers
- Form validation on both client and server
- CSRF protection via SameSite cookies
- Input sanitization for user-generated content
- Rate limiting on authentication endpoints (backend)

---

## Deployment

### CI/CD Pipeline

#### Staging Deployment

**Trigger**: Push to `main` branch

**Workflow**: `.github/workflows/vercel-staging.yml`
```yaml
- Deploys to Vercel staging environment
- Project name: productlens-staging
- Automatic on every main branch push
```

#### Production Deployment

**Trigger**: Push with tag (e.g., `v1.0.0`)

**Workflow**: `.github/workflows/vercel-production.yml`
```yaml
- Deploys to Vercel production environment
- Project name: productlens
- Manual via git tags
```

### Environment Variables

**Required Variables**:
- `NEXT_PUBLIC_API_URL`: Backend API base URL
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VERCEL_TOKEN`: Vercel deployment token (GitHub Secrets)

### Deployment Process

1. **Development**: Local development with hot reload
2. **Staging**: Automatic deployment on `main` branch push
3. **Production**: Tag-based deployment for releases
4. **Rollback**: Vercel dashboard or revert commit

---

## Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js and React
- **Prettier**: Automatic code formatting
- **Conventions**:
  - PascalCase for components
  - camelCase for functions/variables
  - kebab-case for file names (except components)

### Form Management

**Pattern**: React Hook Form + Zod

```tsx
// 1. Define Zod schema
const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// 2. Create form with resolver (inside a React component)
const MyForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { /* ... */ },
  });

  // 3. Use in component
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register('email')} />
      {form.formState.errors.email && <Error />}
    </form>
  );
};
```

### API Service Pattern

**Structure**:
```typescript
// 1. Define API function
export const getUsers = async (params?: Params) => {
  const response = await axios.get<Response>(API_ENDPOINTS.USERS.LIST, { params });
  return response.data;
};

// 2. Create React Query hook
export const useUsers = (params?: Params) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  });
};
```

### Component Organization

- **Page Components**: Located in `app/[locale]/.../page-content.tsx`
- **Shared Components**: Located in `components/ui/`
- **Feature Components**: Located in `_components/` folders
- **Service Hooks**: Located in `services/` with `hooks.ts` pattern

### Utility Functions

**Number Formatting**:
```typescript
import { formatNumberValue, formatWeightValue } from '@/utils/namespaces/format';

// Format numbers with 2 decimal places
formatNumberValue(1234.56); // "1,234.56"

// Format weight values
formatWeightValue(12.5); // "12.50"
```

**Currency Formatting**:
```typescript
new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(1234.56); // "$1,234.56"
```

---

## References

- [Project Proposal](./proposal.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Vercel Deployment](https://vercel.com/docs)
