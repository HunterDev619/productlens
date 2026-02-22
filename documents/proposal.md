# ProductLensAI Development Proposal

# Introduction

This proposal outlines the scope of work for the continued development and re-platforming of ProductLensAI.

The existing application, built on the no-code platform Base44, provides a basic dashboard but lacks critical features for scalability, robust administration, and full control over hosting and data.

This proposal outlines the migration from Base44 to a custom-hosted solution on your preferred cloud services (GCP, AWS, etc.,) , integration of existing logics, development of a new admin web interface, and enhancement of the main app dashboard with additional user-facing features. My goal is to ensure seamless functionality, improved performance, enhanced security, and monetization capabilities through pricing and payment integrations.

# Current State Analysis

ProductLensAI currently consists of a main app dashboard developed using Base44, providing the following core components:

* **Analyse:** Allows users to upload images for AI-driven detailed analysis.

* **History:** Displays past analysis results for the user's account.

* **References:** Provides access to related standards and documents for indicators and compliances.

Summary of Work Done and To Be Added:

* **Completed**: The main app dashboard is functional on Base44, with core features (Analyse, History, References) implemented. Basic user interaction for image uploads and result viewing is operational, leveraging Base44’s no-code environment for logic execution (e.g., login, AI analysis).
* **To Be Added:**
  * Migration to a custom cloud-hosted environment with PostgreSQL for data storage.
  * Development of a new admin web interface with features like user management, analytics, logs explorer, and web settings.
  * Enhancements to the main app, including user authentication (sign-up/login), pricing and payment integration, and a Data View feature for user-specific and admin-accessible data.

Key limitations include:

* Dependency on Base44 for execution logics (e.g., login, core functionalities), which restricts scalability and customization.
* No dedicated **admin web interface** for management and oversight. (forced to use the current admin web of base44)
* Lack of user registration, authentication, pricing, payment processing, and data viewing capabilities.
* Hosting tied to Base44, preventing integration with custom cloud services and databases.

We will extract and adapt the provided Base44 code for the main dashboard to ensure continuity while migrating to a self-hosted environment.

# Proposed Solution

Our solution involves a phased approach to ensure a smooth transition and comprehensive development.

# Phase 1: Infrastructure Setup & Integration

This phase focuses on establishing a robust and scalable cloud infrastructure and integrating existing application logic.

* **Cloud and Hosting**: Migrate the application to your desired cloud provider (e.g., AWS, Google Cloud, are recommended). This includes setting up virtual servers, load balancers, and auto-scaling for optimal performance.

* **Database Integration**: Implement PostgreSQL as the primary database. We recommend Neon (a serverless PostgreSQL service) for its ease of use, scalability, and branching capabilities, which facilitate development and testing. The database will store user data, analysis results, logs, and configurations.

* **Logic Integration**: Port existing Base44 logics (e.g., login, image analysis) to custom backend services. This involves rewriting or adapting the code to run independently on the cloud infrastructure, ensuring no disruption to core functionalities like AI image analysis.

  * **Login/Authentication:** Migrating and integrating the user login and authentication processes.

  * **Existing Functionalities:** Ensuring seamless operation of the Analyse, History, and References components within the new environment.

# Phase 2: Admin Web Development (total fresh new)

A dedicated admin web interface will be developed to provide comprehensive control and monitoring capabilities.

## Admin Web Modules

| Module | Description |
| :---- | :---- |
| Overview | Quick summary of the main metrics and figures. **Metrics on active users**: Counts for today, yesterday, and custom date ranges. **Revenue tracking**: Total revenue for the last 7 days or custom periods, integrated with payment gateways. **User invitation tools**: Generate shareable invitation links or send bulk emails for user onboarding. |
| User Management | Comprehensive user table with columns for: Role (Admin or User). Email and full name. Status (Active or Inactive). Registration date (registered\_at). Last login timestamp. Pricing plan (Default or Premium). CRUD operations (Create, Read, Update, Delete) for users, with search and pagination. |
| Database Management | Their data and their analysis history  |
| Analytics Page | Filters: Date range and Pages (default: all pages). Key features and visualizations: **Total Unique Users**: Aggregate count based on filters. **Top Users**: List of top 3 users by visit count (sorted descending), showing name and visit counts. **Top Pages**: List of top 3 pages by visits, showing page name and visit counts. **Unique Users Over Time**: Line chart or bar graph showing daily new registered users for the last 7 days. **Total Usage Over Time**: Line chart or bar graph showing daily visit counts for the last 7 days. Data sourced from database logs and user activity tracking. |
| ~~Logs Explorer~~ | ~~Filters: By user email, action type (e.g., login, upload, analysis), or errors only. Interactive table displaying: Action type. User email. Timestamps. Detailed input/output (e.g., JSON payloads for API calls or error messages).~~ |
| Web Settings | Editable fields for site-wide customizations: Upload and manage logos. Edit titles, headings, and content sections across pages. Customize colors (primary, secondary, accents) with live preview. App/page management: Toggle visibility for main app pages, delete apps or pages (with confirmation prompts and backups). |

The admin interface will use a responsive design with React for desktop format access (no mobile app version), integrated with the backend APIs.

# Phase 3: Main App Dashboard Enhancements

The existing main app dashboard will be enhanced with critical new features for improved user experience and functionality.

## New Main App Features

| Feature | Description |
| :---- | :---- |
| Sign up and Login | **Sign-up page**: Email/password registration with email verification. **Login page**: Secure authentication, supporting JWT tokens for session management, only supports authenticating with email and password. **Password reset** via email. |
| Pricing Schemes | **Pricing page**: Display plans  Default: Free/basic features Premium: Advanced analysis, higher limits, priority support (to be defined) **Integration with payment gateways** (e.g., Stripe) for one-time or subscription payments **is not included**. User dashboard section to **view their current plans**. (all users are default user for now) Pricing plan **upgrade** will be handled next time. |
| Data View | **For users**: View only their own data, including *uploaded images, AI analysis results* used in analyses. **For admins**: Full access to all user data via the admin interface. Users’ custom product dataset is not included at this time, we use the open-sourced information from the internet only. *User’s premium privilege* is not defined yet and not implemented at this time. Secure, paginated table with search and filters; options to download or delete personal data. |

# AI Algorithm Enhancement

To elevate the analytical capabilities of ProductLensAI, we will enhance the AI algorithms within the Analyse component to include specialized assessments for Life Cycle Assessment (LCA) and IPCC-based climate change evaluations. These enhancements will ensure compliance with global standards, providing users with accurate, standardized insights into product sustainability and environmental impact.

## Key Enhancements:

* **Life Cycle Assessment (LCA) Implementation**:
  * Build an LCA module aligned with ISO 14040:2006 (principles and framework for LCA) and ISO 14044:2006 (requirements and guidelines). This will cover the four phases: goal and scope definition, inventory analysis, impact assessment, and interpretation.
  * The AI will process uploaded product images to estimate lifecycle stages (e.g., raw material extraction, manufacturing, use, and especially weight), drawing from open-source databases and Claude Vision for image-based data extraction.
  * Outputs will include quantitative metrics such as carbon footprint, resource consumption, and environmental impacts, presented in user-friendly reports.
* IPCC Assessment Integration:
  * Incorporate guidelines from the IPCC Sixth Assessment Report (AR6), particularly the updated Global Warming Potential (GWP) characterization factors for translating greenhouse gas (GHG) emissions into climate impact metrics.
  * This will enable assessments of climate change contributions from products, using AR6's state-of-the-art scientific consensus on emissions, risks, and mitigation strategies.
  * The module will generate reports highlighting alignment with IPCC AR6 recommendations, including scenario-based projections for sustainability improvements.

These enhancements will be integrated into the backend using Python and FastAPI, leveraging Claude as the primary LLM for processing and analysis. Compliance will be verified through internal audits, and improved with prompt engineering, ensuring the algorithms meet ISO and IPCC standards for reliability and transparency.

# Technical Stack

| Component | Description |
| :---- | :---- |
| Frontend | **Nextjs** for both admin and main app, ensuring responsive design |
| Backend | **Python** with FastAPI to handle APIs, authentication, and integrations. |
| Database | **PostgreSQL** hosted on [Neon](https://neon.com/pricing). |
| AI Integration (Claude) | Enhance the existing AI logics for image analysis using **Claude** as the only LLM provider. Integrate the Vision LLM model and Image Search with Claude Vision. |
| Deployment | **Docker** for containerization, CI/CD with GitHub Actions **Vercel** for hosting |

# Estimation of work

| No. | Category | Task | Est. Hour of Work |
| :---- | :---- | :---- | :---- |
| 1 | Phase 1: Infrastructure Setup & Integration | Set up cloud hosting environment (e.g., AWS/Google Cloud) with servers, load balancers, and auto-scaling | 4 |
| 2 |  | Configure PostgreSQL database on Neon and define schema | 2 |
| 3 |  | Remove Base44 dependency logics and port to custom backend \- Base44 login required \- Base44 database \- Base44 LLM service \- Base44 cloud storage \- Base44 user system  \- Other Base44 code In these tasks, they are replaced by mock (fake) data, after actually running them with a custom host and backend, the real backend services will be developed. | 3 |
| 4 |  | PostgreSQL Database and Cloud database integration | 2 |
| 5 |  | LLM (Claude) service API integration: removed the base44 LLM and replace with real Claude SDK | 8 |
| 6 | Phase 2: Admin Web Development | Develop Overview Dashboard (active users, revenue, invitations) | 8 |
| 7 |  | Build User Management module with CRUD operations | 3 |
| 8 |  | Create Analytics Page with filters and visualizations | 4 |
| 9 |  | Develop Logs Explorer with filtering and export features | 4 |
| 10 |  | Implement Web Settings for site customizations | 8 |
| 11 | Phase 3: Main App Dashboard Enhancements | Implement user authentication (sign-up, login, password reset) Support log in with Email and Password | 8 |
| 12 |  | Enhance Analyse component: Implement improved upload file function with progress bars | 3 |
| 13 |  | Create Data View feature for user and admin access | 2 |
| 14 |  | Enhance Analysis History and References components with search functionality | 8 |
| 15 |  | Enhance AI Engine Algorithms with LCA and IPCC Assessment Knowledge | 4 |
| 16 |  | Improve AI Accuracy with Prompt engineering, RAG-based method | 12 |
| 17 | Phase 4: Testing and Support | Conduct integration testing across all components | 4 |
| 18 |  | Deployment and go-live support | 2 |
| 19 |  | Deliver and training (if needed) | 2 |
|  | **TOTAL** |  | **91** |

# Project Timeline

A detailed project timeline will be provided upon agreement on the proposed solution. Below is an estimated timeline for each phase.

| Phase | Estimated Duration |
| :---- | :---- |
| Phase 1: Infrastructure Setup & Integration | 2025-09-08 to 2025-09-14 |
| Phase 2: Admin Web Development | 2025-09-15 to 2025-09-22 |
| Phase 3: Main App Dashboard Enhancements | 2025-09-23 to 2025-09-30 |
| Phase 4: Testing and Support | 2025-10-01 to 2025-10-02 |

* We have **weekly meetings** to keep track of the progress. Time to be defined.

# Next Steps

We recommend scheduling a follow-up meeting to discuss this proposal in detail, answer any questions, and refine the scope as needed.

* **Cloud Provider:** Google Cloud Provider (pay-as-you-go)
* **Hosting Service:** Vercel
* **LLM provider** API key: Claude ([https://console.anthropic.com](https://console.anthropic.com) )
* **Database**: NeonTech
* Buy a domain
* **Code** storage and CI/CD: Github
  * Code will be transferred to client’s Github at phase 4
