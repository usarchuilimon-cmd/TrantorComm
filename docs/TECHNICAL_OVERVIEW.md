# SyncFlow - SaaS Communication Platform

## Introduction
SyncFlow is a **B2B SaaS platform** designed to centralize and automate communication between businesses and their customers via **WhatsApp Cloud API** and **Facebook Messenger**. 

It serves markets such as **Medical Clinics, Maintenance Companies, and Service Providers**, enabling them to:
-   Manage patient/client inquiries centrally.
-   Send massive marketing campaigns (promotions, reminders) via WhatsApp Templates.
-   Automate responses using chatbots and live agent handoffs.

## Architecture
The application is a Multi-Tenant SaaS built with:
-   **Framework**: React 18+
-   **Build Tool**: Vite
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Routing**: State-based (SPA) with Role-Based Access Control (Super Admin vs. Tenant Admin).

## Core Key Modules

### for Service Providers (Tenants)
1.  **Unified Inbox (`Conversations.tsx`)**: Centralized chat for WhatsApp/Facebook. Supports rich media (files, images) and 24-hour window session management.
2.  **CRM Lite (`Contacts.tsx`)**: Management of Patients/Clients with tagging (e.g., "VIP", "Post-Op").
3.  **Campaign Manager (`Campaigns.tsx`)**: Bulk sending of approved WhatsApp Templates.
4.  **Dashboard**: Metrics on message volume, agent performance, and read rates.

### for Super Admin (Backoffice)
1.  **Tenant Management**: Create and manage client accounts (Clinics, Companies).
2.  **Plan Management**: Control subscription tiers and limits.
3.  **Global Metrics**: System-wide health monitoring.

## Data Models (`types.ts`)
The application is strictly typed. Key SaaS additions:
-   **`Organization`**: Represents a tenant (e.g., "Clínica Dental Monterrey").
-   **`User`**: Now scoped to an Organization with roles (`SUPER_ADMIN`, `ORG_ADMIN`, `AGENT`).
-   **`WhatsAppTemplate`**: Meta API compliant structure.

## Developer Notes
-   **Mock Data**: Currently uses `mockData.ts`.
-   **Icons**: `lucide-react`.
-   **Charts**: `recharts`.
