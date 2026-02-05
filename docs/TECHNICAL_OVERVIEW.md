# SuncFlow - Technical Overview

## Introduction
SyncFlow is a modern, React-based dashboard application designed for streamlining communication and management workflows. It provides a unified interface for managing conversations, contacts, marketing campaigns, and system settings.

## Architecture
The application is a Single Page Application (SPA) built with:
-   **Framework**: React 18+ (React 19 in dependencies)
-   **Build Tool**: Vite
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Routing**: Custom state-based routing (`currentView` in `App.tsx`)

## Core Components

### Layout
-   **`App.tsx`**: The root component. It manages the global application state (`currentView`, `isSidebarCollapsed`) and renders the main layout structure (Sidebar + Content Area). It also includes a custom `ErrorBoundary` for fault tolerance.
-   **`Sidebar.tsx`**: The main navigation component, responsive and collapsible. It handles view switching between different modules.

### Modules
The application is divided into several functional views:

1.  **Dashboard (`Dashboard.tsx`)**: The landing view, likely displaying high-level metrics and KPIs.
2.  **Conversations (`Conversations.tsx`)**: A messaging interface for managing chats across different platforms (WhatsApp, Messenger, Instagram).
3.  **Contacts (`Contacts.tsx`)**: A CRM-lite module for managing user contacts (`Contact` interface).
4.  **Campaigns (`Campaigns.tsx`)**: Tools for creating and managing outreach campaigns (`Campaign` interface), supporting WhatsApp template management.
5.  **Settings (`Settings.tsx`)**: Configuration panel for application preferences.

### Features
-   **Live Assistant (`LiveAssistant.tsx`)**: A floating assistant component available globally across the app.
-   **Error Handling**: Global `ErrorBoundary` catches render errors and provides a user-friendly fallback UI with a reload option.

## Data Models (`types.ts`)

The application is typed strictly with TypeScript. Key interfaces include:

-   **`ViewState`**: Enum defining valid navigation states (`dashboard`, `conversations`, etc.).
-   **`User`**: Represents the current logged-in user or agents.
-   **`Contact`**: Represents external entities/customers, including VIP status and tags.
-   **`Conversation` & `Message`**: Structures for chat capability, supporting text, images, and files.
-   **`Campaign`**: Structure for marketing campaigns, tracking delivery and read rates.
-   **`WhatsAppTemplate`**: Specialized types for handling Meta's WhatsApp API templates.

## Developer Notes
-   **Mock Data**: The application currently uses `mockData.ts` for prototyping. In a production scenario, this should be replaced with API calls.
-   **Icons**: Uses `lucide-react` for a consistent SVG icon set.
-   **Charts**: Uses `recharts` for data visualization in the Dashboard.
