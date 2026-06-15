# Social Support Application

A 3-step financial-assistance application wizard for a government social-support
portal. This repo is a **Formwright refactor** of the original case-study forms:
the wizard was rebuilt on **[Formwright](https://github.com/aliarsalan177/formwright)**
(`@formwright/core` + `@formwright/dom` from **npm**) instead of React Hook Form +
Zod + per-step React components.

The entire application form is one serializable **`FormSchema`** (~290 lines in
`schema.ts`). Formwright renders it, validates it, navigates steps, and persists
drafts — React only mounts the form, wires the API, handles the success event,
and registers one custom AI widget (~100 lines in `form-host.tsx`).

Also includes OpenAI **"Help Me Write"**, bilingual **English / Arabic (RTL)**,
accessibility, and offline draft saving.

Built for the Front-End Developer case study.

---

## Form refactor — React Hook Form → Formwright

This project **refactored forms** from a custom React wizard stack to Formwright.

| Before (removed) | After (Formwright `@0.2.2`) |
|---|---|
| React Hook Form + `@hookform/resolvers` + **Zod** | Declarative `validation` on each field in `schema.ts` |
| `WizardProvider`, `useWizard`, per-step routes (`/apply/step/:step`) | Single `/apply` route; steps are `type: 'steps'` in the schema |
| `step-1-personal.tsx`, `step-2-family.tsx`, … (3 step components) | One nested schema: `personal` / `family` / `situation` steps |
| Custom `ProgressBar`, `StepNav`, `ResumeBanner` | Built-in progress bar + Back / Next / Submit |
| `form-values.ts`, `defaults.ts`, `application-schema.ts` (Zod) | `persistKey` on the `Form` options |
| React `useState` for submit result / errors | `form.on('success')` + built-in `.fw-alert` on error |

**Removed:** `react-hook-form`, `@hookform/resolvers`, `zod`.

**Added:** `@formwright/core@^0.2.2`, `@formwright/dom@^0.2.2` (public [npm](https://www.npmjs.com/package/@formwright/core)).

**Wizard feature size:** ~770 lines under `src/features/wizard/` (schema, host,
widgets, styles, tests) vs the old spread across providers, hooks, steps, and
form components.

---

## Formwright `@0.2.2` — what this demo uses

Installed from npm — no local monorepo link required.

| Capability | Used in this repo |
|---|---|
| **Multi-step wizard** (`steps` + `step`) | 3-step bar progress |
| **Per-step + live validation** | Before Next; real-time field errors |
| **Declarative rules** | `required`, `pattern`, `format: 'email'`, `minLength` |
| **`colSpan` + `classes`** | 2-col grid + Tailwind per field |
| **`$t` i18n provider** | Labels, options, nav — EN + AR |
| **`autocomplete`** | Per-field sensible defaults |
| **`persistKey`** | Auto-save to `localStorage`; restore on reload; clear on submit |
| **`send` option** | `validate → send → success / error` pipeline |
| **`form.on('success')`** | Show `SuccessScreen` with API reference number |
| **`.fw-alert`** | Dismissible error banner on failed submit |
| **`form.isSubmitting`** | Disabled submit + loading label |
| **`registerWidget`** | Custom `date` (max = today) + `ai-textarea` (AI assist) |
| **`.fw-*` CSS hooks** | `form-styles.css` for grid, nav, alerts |

**Not in npm `0.2.2` yet** (available in newer Formwright releases): `schema.persist`
(resume banner), `schema.success` (built-in success template), active-step restore.
This demo handles success via `form.on('success')` instead.

The `Form` instance is the single source of truth — subscribe with
`form.on('change' | 'success' | 'error')` or read signals like `form.values`,
`form.isSubmitting`.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | **React 19** + **Vite** + **TypeScript** |
| **Forms** | **[Formwright](https://github.com/aliarsalan177/formwright)** `^0.2.2` — schema-driven wizard |
| Styling | **Tailwind CSS v4** on `.fw-*` hooks + schema `classes` |
| HTTP | **ky** |
| i18n | **react-i18next** + Formwright `$t` provider |
| Routing | **React Router v7** — `/apply` only |
| Testing | **Vitest** + **RTL** + **MSW** (16 tests) |
| Package manager | **pnpm** |

---

## Getting started

Requirements: **Node 20+** and **pnpm**.

```bash
pnpm install
cp .env.example .env      # OpenAI key for Step 3 AI assist (optional)
pnpm dev                   # http://localhost:5173/apply
```

> If `pnpm dev` fails on MSW build scripts: `./node_modules/.bin/vite`

### Scripts

```bash
pnpm dev              # dev server (MSW mocks submit API)
pnpm build            # tsc + production build
pnpm test:run         # 16 tests once (CI)
pnpm test             # Vitest watch mode
pnpm lint | format
```

---

## OpenAI API key (Step 3 AI assist)

Custom `ai-textarea` widget — not part of core Formwright.

```bash
# .env
VITE_OPENAI_API_KEY=sk-...
VITE_OPENAI_MODEL=gpt-3.5-turbo   # optional
VITE_SUBMIT_URL=/api/applications # optional
```

Deployed demo with a URL key:

```
https://<your-deployment>/apply?open-ai-key=sk-...
```

Key stored in `localStorage` for 10 minutes, then expires.

> ⚠️ Client-side OpenAI exposes the key — demo only. Proxy through a backend in production.

---

## What it does

- **3-step wizard** — Personal → Family & Financial → Situation (AI textareas)
- **Live + per-step validation** — no Zod; rules in `schema.ts`
- **Built-in Back / Next / Submit** — with submit loading state
- **Draft persistence** — `persistKey` auto-saves; values restored on reload
- **Success screen** — `form.on('success')` renders reference number
- **Submit errors** — Formwright `.fw-alert`
- **AI Help Me Write** — custom widget on Step 3
- **EN / AR + RTL** — language toggle + `$t` labels
- **Date of birth** — custom `date` widget, max = today
- **Responsive** — 1-col mobile, 2-col desktop; fixed bottom nav on mobile
- **Mock submit** — MSW / Vercel API → `SSW-…` reference number

---

## Architecture

### Integration pattern

```tsx
// form-host.tsx — React ↔ Formwright bridge
const form = new Form(schema, {}, {
  persistKey: PERSIST_KEY,
  providers: { i18n: { t: (key, args) => String(t(key, args)) } },
  send: async (payload) => submitApplication(flatten(payload)),
});

form.mount(hostRef.current);

form.on('success', (data) => {
  // Render SuccessScreen with data.referenceNumber
});
```

| File | Role |
|---|---|
| `schema.ts` | `FormSchema` — fields, steps, validation, i18n labels |
| `form-host.tsx` | `new Form(…).mount(ref)`, `send`, `form.on('success')` |
| `formwright-setup.tsx` | `registerWidget('date' \| 'ai-textarea')` |
| `form-styles.css` | Tailwind on `.fw-*` layout hooks |
| `components/success-screen.tsx` | Shown after `form.on('success')` |
| `components/ai-textarea-control.tsx` | React UI inside the AI widget |
| `submit-application.ts` | POST to MSW / Vercel API |

Nested Formwright values (`wizard.personal.name`, …) are flattened to a flat
`ApplicationData` payload before submit.

### Folder structure

```
src/features/wizard/
├── schema.ts
├── form-host.tsx
├── formwright-setup.tsx
├── form-styles.css
├── submit-application.ts
├── types.ts
├── wizard.tsx                    # export { FormHost as Wizard }
└── components/
    ├── success-screen.tsx
    └── ai-textarea-control.tsx
```

`/apply/step/:step` redirects to `/apply` (steps live inside the form).

### Testing (`pnpm test:run` — 16 tests)

- Formwright: step 1 render, live validation, full submit + success screen
- Persistence: `persistKey` auto-save, silent restore on reload
- Submit error: `.fw-alert` shown, draft retained
- AI assist: accept suggestion, retry on error
- OpenAI URL key capture + storage helpers

### Deployment (Vercel)

- `vercel.json` — SPA rewrite to `index.html`
- `api/applications.js` — production submit endpoint
- Formwright from **public npm** — works in CI/Vercel without a local link

### Security & production

1. Proxy OpenAI through a backend
2. Encrypt or avoid storing PII in `localStorage` drafts
3. Re-validate submissions server-side
4. E2E tests (Playwright) in both languages

### Upgrading Formwright

When a newer `@formwright/*` is published with `schema.persist`, `schema.success`,
and resume banner support, you can move success/persist config into `schema.ts`
and remove the manual `form.on('success')` handler. See the
[Formwright README](https://github.com/aliarsalan177/formwright#form-caching-with-user-consent).
