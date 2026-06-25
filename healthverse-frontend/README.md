# HealthVerse AI — Frontend (Angular 19 standalone + Tailwind)

> **Note on this codebase:** written against standard Angular 19 standalone
> APIs (signals, functional guards/interceptors, the new `@if`/`@for` control
> flow). Every `.ts` file was run through the TypeScript compiler and every
> import/templateUrl path was verified to resolve — but `npm install` and
> `ng serve` were **not** run in the environment that generated this code (no
> internet access there to fetch @angular packages). Run it locally and tell
> me about any error you hit.

## 1. Setup

```bash
npm install
```

This installs Angular 19, Tailwind, and everything else from `package.json`.

## 2. Configure the API URL

- Local dev: `src/environments/environment.development.ts` already points to
  `http://localhost:8000/api` — matches the Django backend's default.
- Production: edit `src/environments/environment.ts` with your deployed
  Render backend URL before building/deploying.

## 3. Run it

```bash
npm start
```

Visit `http://localhost:4200`. Make sure the Django backend is running on
`http://localhost:8000` first (see the backend README), and that its
`CORS_ALLOWED_ORIGINS` includes `http://localhost:4200`.

## 4. Build for production

```bash
npm run build
```

Output goes to `dist/healthverse-frontend/browser` — this is what you deploy
to Vercel.

---

## What's included

| Requirement | Where |
|---|---|
| Angular folder structure | `src/app/core` (services/guards/interceptors/models), `src/app/features` (pages), `src/app/shared` (navbar) |
| Authentication service (JWT) | `core/services/auth.service.ts` — login/register/refresh/logout, exposes `currentUser`/`isAuthenticated`/`role` as signals |
| Route guards | `core/guards/auth.guard.ts` (must be logged in), `core/guards/role.guard.ts` (must have a specific role) |
| Login page | `features/auth/login/` |
| Register page | `features/auth/register/` — role-conditional fields for Patient vs Doctor |
| Patient dashboard | `features/patient-dashboard/` |
| Doctor dashboard | `features/doctor-dashboard/` — appointment status management + inline prescription issuing |
| AI Symptom Checker | `features/symptom-checker/` |
| Appointment Booking | `features/appointment-booking/` |
| Prescription History | `features/prescription-history/` |
| API service layer | `core/services/*.service.ts` — one per backend resource |
| Environment configuration | `src/environments/` |
| Angular routing | `app.routes.ts` — all feature pages are lazy-loaded |
| Tailwind CSS styling | `tailwind.config.js`, `postcss.config.js`, `src/styles.css` |

## Design notes
- Custom Tailwind color tokens (`brand`, `ink`, `status`) instead of default
  Tailwind blue/gray — see `tailwind.config.js`.
- Headings use **Sora**, body text uses **Inter** (loaded via Google Fonts in
  `index.html`).
- JWT auth uses an automatic-refresh interceptor (`core/interceptors/auth.interceptor.ts`):
  on a 401, it tries the refresh token once before giving up and logging out.
- Tokens are stored in `localStorage` for simplicity. For a production app
  handling real patient data, httpOnly cookies issued by the backend would be
  more secure — worth a follow-up if you want to harden this further.

## What's next (Phase 4+)
- CORS/integration verification end-to-end (login → book → prescribe)
- Deployment configs: Vercel (this frontend) + Render (the Django backend)
