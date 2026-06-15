# Social Support Application

A 3-step financial-assistance application wizard for a government social-support
portal. This repo is a **Formwright refactor** of the original case-study forms:
the wizard was rebuilt on **[Formwright](https://github.com/aliarsalan177/formwright)**
(schema-driven, signal-reactive) instead of React Hook Form + Zod + per-step React
components.

The entire application form is one serializable **`FormSchema`** (~300 lines in
`schema.ts`). Formwright renders it, validates it, navigates steps, persists
drafts, and shows the success screen — React only mounts the form and wires the
API + AI widget (~70 lines in `form-host.tsx`).

Also includes OpenAI **"Help Me Write"**, bilingual **English / Arabic (RTL)**,
accessibility, and offline draft saving.

Built for the Front-End Developer case study.

---

## Form refactor — React Hook Form → Formwright

This project **refactored forms** from a custom React wizard stack to Formwright.

| Before (removed) | After (Formwright) |
|---|---|
| React Hook Form + `@hookform/resolvers` + **Zod** | Declarative `validation` on each field in `schema.ts` |
| `WizardProvider`, `useWizard`, per-step routes (`/apply/step/:step`) | Single `/apply` route; steps are `type: 'steps'` in the schema |
| `step-1-personal.tsx`, `step-2-family.tsx`, … (3 step components) | One nested schema: `personal` / `family` / `situation` steps |
| Custom `ProgressBar`, `StepNav`, `ResumeBanner`, `SuccessScreen` | Built-in progress bar, Back/Next/Submit, resume banner, success screen |
| `form-values.ts`, `defaults.ts`, `application-schema.ts` (Zod) | `persistKey` + `schema.persist` + `schema.success` |
| React `useState` mirroring submit result / errors | `Form` signals + `form.on('success' \| 'error')` + built-in `.fw-alert` |

**Dependencies removed:** `react-hook-form`, `@hookform/resolvers`, `zod`.

**Dependencies added:** `@formwright/core`, `@formwright/dom` (linked from the
[Formwright monorepo](https://github.com/aliarsalan177/formwright) for this demo).

**Wizard feature size:** ~770 lines total under `src/features/wizard/` (schema +
thin host + one custom widget + styles + tests) — previously spread across
providers, hooks, steps, and form components.

---

## Formwright features used in this demo

| Formwright capability | How we use it |
|---|---|
| **Multi-step wizard** (`steps` + `step`) | 3-step application with bar progress |
| **Per-step validation** | Validates current step before **Next** |
| **Live field validation** | Real-time errors as the user types |
| **Declarative validation** | `required`, `pattern`, `format: 'email'`, `minLength`, custom messages |
| **`colSpan` grid** | Two-column layout on `sm+` (6 + 6 of 12) |
| **`classes` / Tailwind** | Per-field `label`, `control`, `error` utilities in schema |
| **`$t` i18n provider refs** | Labels, options, nav, persist, success — EN + AR |
| **`autocomplete`** | Sensible defaults per field type |
| **`persistKey` + `persist`** | Auto-save draft + values **and active step** to `localStorage` |
| **Resume banner** | Restore on reload → Continue / Start over |
| **`schema.success`** | Post-submit screen; `{{referenceNumber}}` from API response |
| **Submit pipeline** | `send` option → `validate → send → success/error` |
| **`.fw-alert`** | Dismissible top-of-form error on failed submit |
| **`form.isSubmitting`** | Disabled submit + loading label |
| **Custom widget** (`registerWidget`) | `date` (max = today), `ai-textarea` (Help Me Write) |
| **Stable `.fw-*` CSS hooks** | `form-styles.css` for grid, nav, banner, alerts, success |

No parallel React form state — the `Form` instance is the single source of truth.
Subscribe with `form.on('change' \| 'success' \| 'error')` or read signals like
`form.values`, `form.isSubmitting`, `form.successData`.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | **React 19** + **Vite** + **TypeScript** |
| **Forms** | **[Formwright](https://github.com/aliarsalan177/formwright)** — schema-driven wizard (refactored from RHF + Zod) |
| Styling | **Tailwind CSS v4** on `.fw-*` hooks + schema `classes` |
| HTTP | **ky** |
| i18n | **react-i18next** + Formwright `$t` provider |
| Routing | **React Router v7** — `/apply` only (steps live inside the form) |
| Testing | **Vitest** + **RTL** + **MSW** (20 tests) |
| Package manager | **pnpm** |

---

## Getting started

Requirements: **Node 20+** and **pnpm**.

Formwright is linked from a **local sibling checkout** (`../../formwright`):

```bash
git clone https://github.com/aliarsalan177/formwright.git ../formwright
cd ../formwright && pnpm install && pnpm run build
cd ../social-support-wizard && pnpm install
```

```bash
cp .env.example .env      # add OpenAI key for Step 3 AI assist (optional)
pnpm dev                   # http://localhost:5173/apply
```

> If `pnpm dev` fails on MSW build scripts: `./node_modules/.bin/vite`

### Scripts

```bash
pnpm dev | build | test | test:run | test:coverage | lint | format
```

---

## Setting up the OpenAI API key

Step 3 **"Help me write"** uses the OpenAI Chat Completions API (custom
`ai-textarea` widget — not part of core Formwright).

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

Key is stored in `localStorage` for 10 minutes, then expires. Build-time
`VITE_OPENAI_API_KEY` takes precedence.

> ⚠️ Client-side OpenAI calls expose the key — demo only. Proxy through a backend
> in production.

---

## What it does

- **3-step wizard** — Personal → Family & Financial → Situation (AI textareas)
- **Live + per-step validation** — Formwright engine (no Zod)
- **Built-in Back / Next / Submit** — with submit loading state
- **Draft persistence** — auto-save; restore values + step on reload; resume banner
- **Success screen** — schema-driven, reference number from submit response
- **Submit errors** — Formwright `.fw-alert`
- **AI Help Me Write** — custom widget on Step 3
- **EN / AR + RTL** — language toggle + `$t` labels
- **Date of birth** — custom `date` widget, max = today
- **Responsive** — 1-col mobile, 2-col desktop; fixed bottom nav on small screens
- **Mock submit** — MSW → reference number `SSW-…`

---

## Architecture

### Integration pattern

```tsx
// form-host.tsx — entire React ↔ Formwright bridge
const form = new Form(schema, {}, {
  persistKey: PERSIST_KEY,
  providers: { i18n: { t: (key, args) => String(t(key, args)) } },
  send: async (payload) => submitApplication(flatten(payload)),
});
form.mount(hostRef.current);
```

| File | Role |
|---|---|
| `schema.ts` | `FormSchema` — fields, steps, validation, i18n, persist, success |
| `form-host.tsx` | Mount form, `send`, flatten nested values for API |
| `formwright-setup.tsx` | Register `date` + `ai-textarea` widgets |
| `form-styles.css` | Tailwind on `.fw-*` layout chrome |
| `components/ai-textarea-control.tsx` | React UI inside the AI widget |

### Folder structure

```
src/features/wizard/
├── schema.ts              # FormSchema (source of truth)
├── form-host.tsx          # new Form(…).mount(ref)
├── formwright-setup.tsx   # registerWidget(...)
├── form-styles.css
├── submit-application.ts
├── types.ts
├── wizard.tsx             # export { FormHost as Wizard }
└── components/
    └── ai-textarea-control.tsx
```

Legacy paths (`/apply/step/:step`) redirect to `/apply`.

### Testing (`pnpm test:run` — 20 tests)

- Formwright: render, live validation, full submit, success + reference number
- Persistence: auto-save, reload restore, resume banner, Start over, step restore
- Submit error: alert shown, draft retained
- AI assist: accept suggestion, retry on error
- OpenAI URL key + storage helpers

### Deployment (Vercel)

- `vercel.json` — SPA rewrite
- `api/applications.js` — production submit endpoint
- **Note:** replace `link:../../formwright/...` with published `@formwright/*`
  npm versions for CI/Vercel (or vendor the built packages)

### Security & production

1. Proxy OpenAI through a backend
2. Encrypt or avoid storing PII in `localStorage` drafts
3. Re-validate submissions server-side
4. E2E tests (Playwright) in both languages
