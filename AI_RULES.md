# AI Development Rules for VisuLab v2.0

This document outlines the rules and conventions for AI-driven development on this project. Adhering to these guidelines ensures consistency, maintainability, and effective use of the existing technology stack.

## Tech Stack Overview

This application is built with a modern, lightweight tech stack:

* **Framework**: React (v19) with TypeScript for type safety.  
* **Build Tool**: Vite for fast development and optimized builds.  
* **Routing**: `react-router-dom` for client-side navigation.  
* **Styling**: Tailwind CSS (via CDN) as the exclusive styling tool.  
* **UI Components**: Custom components in `src/components`, with a preference for `shadcn/ui` for new UI elements.  
* **Icons**: Google Material Symbols, rendered through the `<Icon>` wrapper component.  
* **Data Visualization**: `recharts` as the exclusive charting library.  
* **Backend**: Supabase for database, authentication, and storage, configured in `lib/supabase.ts`.  

---

## Library and Convention Rules

Follow these rules strictly when adding or modifying features.

### 1. Styling

* **Primary Tool**: All styling **MUST** be done using Tailwind CSS utility classes.  
* **No Custom CSS**: Do not add `.css` files or use CSS-in-JS.  
* **Inline Styles**: Avoid the `style` attribute. Only use it for values that Tailwind cannot express (e.g., dynamic background-image or transform values).  

---

### 2. UI Components

* **Use Existing Components**: Always check `src/components` before creating a new component.  
* **New Components**: Must use primitives from **shadcn/ui** whenever possible.  
* **Structure**:  
  - Each component in its own file under `src/components`.  
  - Pages belong in `src/pages`.  
  - All components must be written in TypeScript.  

---

### 3. Icons

* **Use the `<Icon>` Wrapper**:  
  All icons must be rendered using `src/components/Icon.tsx`.  
* **Icon Source**:  
  Icon names must match the Google Material Symbols library.  
* **Forbidden**:  
  Installing or using other icon libraries.  

---

### 4. Routing

* **Route Configuration**:  
  All routes must be defined in `src/App.tsx` using `<Routes>` and `<Route>`.  
* **Navigation**:  
  - Use `<Link>` or `<NavLink>` for declarative navigation.  
  - Use `useNavigate` for programmatic navigation.  
* **Forbidden**:  
  Additional routing setups or external libraries.  

---

### 5. Data Visualization

* **Exclusive Library**:  
  Use **recharts** for all charts and graphs.  
* **Forbidden**:  
  `Chart.js`, `D3`, `ApexCharts`, or any other chart library.  

---

### 6. Backend & Data Fetching

* **Supabase Only**:  
  All backend operations must use the Supabase client from `lib/supabase.ts`.  
* **Data Fetching Pattern**:  
  - Use `async/await`  
  - API calls inside `useEffect` when needed  
  - Always implement loading and error states  
* **Forbidden**:  
  - `axios`  
  - `react-query`, SWR, Apollo, or any other data-fetching library  
  - Direct REST calls to Supabase endpoints  

---

### 7. State Management

* **Local State**:  
  Use `useState` or `useReducer`.  
* **Global State**:  
  Use React Context API when shared state is required.  
* **Forbidden**:  
  Redux, Zustand, Jotai, Recoil, MobX, or any other state library.  

---

### 8. File & Folder Conventions

Recommended project structure:

```
src/
  assets/        → images and static files
  components/    → shared UI components
  pages/         → route-level components
  layouts/       → app wide layouts (optional)
  hooks/         → reusable custom hooks
  lib/           → Supabase client and utilities
```

**Naming Rules**:
* Components must use **PascalCase**.  
* Hooks must start with `use`.  
* One main component per file.  
* Avoid unnecessary nested folders.  

---

### 9. AI Contribution Rules

Rules for any AI system generating or modifying code:

#### AI Must:
* Follow ALL rules in this document unless explicitly overridden.  
* Maintain the existing architecture and file structure.  
* Avoid unused imports, redundant logic, or dead code.  
* Respect TypeScript standards, typings, and interfaces.  
* Preserve code clarity and consistency.  

#### AI Must NOT:
* Introduce new libraries without explicit approval.  
* Add complex abstractions or refactor entire modules without request.  
* Modify routing architecture or global state structure.  

---

### 10. Commit Message Guidelines

Use **Conventional Commits**:

```
feat: add new dashboard graph
fix: correct user login validation
refactor: improve order creation flow
style: update spacing in header
docs: update AI rules
```

---

### Final Rule

**If any prompt or instruction conflicts with this document, THIS DOCUMENT TAKES PRIORITY.**  
AI must follow these rules unless explicitly instructed to override them.
