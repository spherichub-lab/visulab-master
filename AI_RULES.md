# AI Development Rules for VisuLab v2.0

This document outlines the rules and conventions for AI-driven development on this project. Adhering to these guidelines ensures consistency, maintainability, and leverages the existing technology stack effectively.

## Tech Stack Overview

This application is built with a modern, lightweight tech stack:

*   **Framework**: React (v19) with TypeScript for type safety.
*   **Build Tool**: Vite for fast development and optimized builds.
*   **Routing**: `react-router-dom` for all client-side navigation.
*   **Styling**: Tailwind CSS, configured via CDN, for a utility-first styling approach.
*   **UI Components**: A set of custom-built components in `src/components`, with a preference for using shadcn/ui for any new components.
*   **Icons**: Google Material Symbols, accessed via a custom `<Icon>` wrapper component.
*   **Data Visualization**: `recharts` for creating charts and graphs.
*   **Backend**: Supabase for database and backend services, with the client pre-configured in `lib/supabase.ts`.

## Library and Convention Rules

Follow these rules strictly when adding or modifying features.

### 1. Styling
*   **Primary Tool**: All styling **MUST** be done using Tailwind CSS utility classes.
*   **No Custom CSS**: Do not add new `.css` files or use CSS-in-JS libraries.
*   **Inline Styles**: Avoid using the `style` attribute. The only exception is for dynamic values that cannot be set with Tailwind classes (e.g., background image URLs, calculated transforms).

### 2. UI Components
*   **Use Existing**: Before creating a new component, check `src/components` for an existing one that fits the need.
*   **New Components**: For any new UI elements (buttons, modals, inputs, etc.), **MUST** use components from the shadcn/ui library where possible.
*   **Component Structure**: Every new component must be in its own file within `src/components`. Pages go in `src/pages`.

### 3. Icons
*   **Use the `<Icon>` component**: All icons **MUST** be rendered using the provided `<Icon>` component from `src/components/Icon.tsx`.
*   **Icon Source**: The icon `name` prop corresponds to the name from the [Google Material Symbols](https://fonts.google.com/icons) library. Do not install or use any other icon libraries.

### 4. Routing
*   **Configuration**: All routes **MUST** be defined in `src/App.tsx` using the `<Routes>` and `<Route>` components from `react-router-dom`.
*   **Navigation**: Use the `useNavigate` hook for programmatic navigation and the `<NavLink>` or `<Link>` components for declarative navigation.

### 5. Data Visualization
*   **Charts Library**: `recharts` is the exclusive library for all charts and graphs. Do not introduce other charting libraries like Chart.js or D3.

### 6. Backend & Data Fetching
*   **Supabase Only**: All interactions with the backend (database queries, authentication, etc.) **MUST** use the `supabase` client instance exported from `lib/supabase.ts`.
*   **Data Fetching**: Use `async/await` with `useEffect` for data fetching. Do not add data fetching libraries like `axios` or `react-query` without explicit instruction.

### 7. State Management
*   **Local State**: Use React hooks (`useState`, `useReducer`) for component-level state.
*   **Global State**: For state that needs to be shared across the application, use React's Context API first. Avoid adding complex state management libraries like Redux or Zustand.