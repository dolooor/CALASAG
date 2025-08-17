## Purpose

This file gives focused, repository-specific instructions to an AI coding agent so it can be immediately productive editing or extending the CALASAG front-end.

## Quick summary

- Tech stack: React + TypeScript, built with Vite. Styling is Tailwind CSS (utility classes inside JSX). Icons use `react-icons`. Charts use `react-chartjs-2` + Chart.js registration inside chart-using files (see `AdminDashboard.tsx`).
- App composition: top-level router lives in `src/App.tsx`. Pages are single-file components under `src/Components/Pages/*` (e.g. `Dashboard.tsx`, `AdminDashboard.tsx`).
- No global state manager present (no Redux/MobX). Components use local React state and `localStorage` for minimal auth (`user` and `userRole`).

## How to run / build

- Start dev server (fast refresh): `npm run dev` (Vite)
- Build production bundle: `npm run build` (runs `tsc -b` then `vite build`)
- Lint: `npm run lint` (project has `eslint.config.js`)
- Preview built site: `npm run preview`

## Key files to inspect when making changes

- `src/App.tsx` — routing and `ProtectedRoute` logic (uses `localStorage.getItem('userRole')`). Update routes here when adding pages.
- `src/main.tsx` — app entry.
- `src/Components/Pages/*` — individual page components; conventions below.
- `package.json`, `vite.config.ts`, `tsconfig.*.json` — tooling configs.
- `eslint.config.js` — lint rules to follow.

## Repository conventions and patterns

- Pages: single-file React functional components, default export. Name matches file (PascalCase). Example: `Dashboard.tsx` exports a React.FC and controls its own local state.
- Styling: use Tailwind utility classes directly in JSX. Preserve existing utility-class patterns (rounded-2xl, bg-gradient-to-br, `#005524`/`#f69f00` color accents).
- Icons: use `react-icons` imports at top of file. When a component maps icon names to elements (see `Dashboard.tsx` iconMap), follow that convention.
- Charts: Chart.js must be registered before use — you'll find `ChartJS.register(...)` in chart files like `AdminDashboard.tsx`.
- Modals & overlays: use conditional rendering (boolean state) and fixed positioned containers; copy existing modal markup for consistent accessibility and animation classes.
- Routing access control: use `ProtectedRoute` wrapper in `App.tsx` for role-restricted pages. Use `localStorage` keys `user` and `userRole` consistently when adding auth logic.

## Developer workflow notes

- Type-checking: `npm run build` runs `tsc -b` — use this before large refactors to catch type errors across project references.
- Linting: run `npm run lint`. ESLint configuration aims for TypeScript-aware rules in `eslint.config.js`.
- Runtime: Vite dev server enables HMR; most UI tweaks are visible instantly.

## Integration and external touchpoints

- No backend API clients are present in the repo. Current examples that interact with external systems are minimal (e.g. `window.open('tel:911')`). If adding APIs, follow the existing simple separation: keep service calls out of page markup (create `src/services` when needed).
- Icons and assets: images live in `src/Components/Images` and `public/`. Import images with relative paths used in current pages.

## Naming & PR guidance for AI edits

- Small UI/UX changes: edit the page file in `src/Components/Pages/*` and run `npm run dev` to confirm visual behavior.
- Adding a new page: create `src/Components/Pages/NewPage.tsx` (default export React.FC), then add a route in `src/App.tsx` (use `ProtectedRoute` if restricted). Example:

```tsx
// src/Components/Pages/NewPage.tsx
const NewPage: React.FC = () => <div>New Page</div>;
export default NewPage;
// then in App.tsx add <Route path="/new" element={<NewPage/>} />
```

## Helpful search terms and places to edit

- `localStorage.getItem('userRole')` — find auth gating
- `ChartJS.register` — find chart setup
- `bg-gradient-to-br from-[#005524]` — find primary branded UI sections
- `src/Components/Pages` — primary development surface

## If something is missing

- No tests found: add lightweight unit tests beside modified components if you change business logic. If you add test infra, document `npm test` in `package.json` and the README.
- If a global state or API client is needed, propose adding `src/services/api.ts` and `src/state/` (Context or Zustand) and include a short migration plan.

## Questions for a maintainer (if you hit them)

1. Are there any private API endpoints or environment variables not in the repo? (I saw none.)
2. Preferred rule for shared colors vs inline hex values? Should we extract a Tailwind theme now or keep inline hex values used across pages?

Done — ask me to iterate on any unclear section or to expand examples for a specific change (routing, charts, or adding services).
