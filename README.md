# Social Support Application

A 3-step financial-assistance application wizard for a government social-support
portal, with an OpenAI-powered **"Help Me Write"** assistant, bilingual
**English / Arabic (RTL)** UI, accessibility, and offline-friendly progress saving.

Built for the Front-End Developer case study.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | **React 19** + **Vite** + **TypeScript** |
| Styling | **Tailwind CSS v4** (logical properties for RTL) |
| Forms | **React Hook Form** + **Zod** (one schema per step) |
| HTTP | **ky** (built-in timeout + retry over `fetch`) |
| i18n | **react-i18next** (JSON locale files, EN + AR) |
| Routing | **React Router v7** (`useRoutes`, one route per step) |
| Testing | **Vitest** + **React Testing Library** + **MSW** |
| Mock API | **MSW** (dev service worker + Node server in tests) |
| Package manager | **pnpm** |

---

## Getting started

Requirements: **Node 20+** and **pnpm**.

```bash
pnpm install

# Configure environment
cp .env.example .env      # then add your OpenAI key (see below)

pnpm dev                  # start the app at http://localhost:5173
```

### Scripts

```bash
pnpm dev              # dev server (MSW mocks the submit API)
pnpm build            # type-check + production build
pnpm test             # run Vitest in watch mode
pnpm test:run         # run the suite once (CI)
pnpm test:coverage    # run with coverage
pnpm lint             # ESLint
pnpm format           # Prettier
```

> **Editor tip:** the project pins TypeScript via `.vscode/settings.json`
> (`typescript.tsdk`). In VS Code / Cursor choose **"TypeScript: Use Workspace
> Version"** so the editor type-checks exactly like `tsc` (needed for the typed
> i18n keys to resolve).

---

## Setting up the OpenAI API key

The Step 3 **"Help me write"** buttons call the OpenAI Chat Completions API.

1. Get a key from <https://platform.openai.com/api-keys>.
2. Put it in `.env`:

   ```bash
   VITE_OPENAI_API_KEY=sk-...your-key...
   # optional overrides:
   VITE_OPENAI_MODEL=gpt-3.5-turbo
   VITE_SUBMIT_URL=/api/applications
   ```

3. Restart `pnpm dev`.

Without a key, the rest of the form works normally and the AI buttons are
disabled with an explanatory tooltip.

### Trying the deployed demo with your own key

The build ships without a key, so to test **"Help Me Write"** on the live demo
you can pass your own key in the URL:

```
https://<your-deployment>/apply/step/1?open-ai-key=sk-...your-key...
```

The app stores that key in LocalStorage **for 10 minutes**, then removes the
`?open-ai-key` param from the address bar. After 10 minutes the key auto-expires
and is deleted, so you'd add it again to keep using the AI feature. A build-time
`VITE_OPENAI_API_KEY` always takes precedence over a URL-supplied key.

> ⚠️ **Security:** the API key is read in the browser and the request goes
> straight to OpenAI, which **exposes the key to the client** (and the URL/LocalStorage
> key even more so). This is acceptable for the case study / demo only. In
> production, proxy the call through a backend / serverless function so the key
> stays server-side. See _Architecture → Security_.

---

## What it does

- **3-step wizard** with a progress bar
  1. Personal Information
  2. Family & Financial Info
  3. Situation Descriptions (AI-assisted)
- **Live validation** — fields validate as you type, but an error only shows once
  the field has been touched/edited (so the step isn't flagged all at once).
- **Guarded navigation**
  - **Next / Submit are disabled** until the current step's required fields are
    valid.
  - **Step access guard** — deep-linking to a later step (e.g. `/apply/step/3`)
    redirects to the first step you still need to complete.
  - The final submit re-validates the whole application.
- **AI "Help me write"** — an inline button rendered **inside** each Step 3
  textarea (LinkedIn-style, bottom corner). It sends the field context to OpenAI
  and shows the suggestion in an accessible dialog with **Accept / Edit /
  Discard**, plus graceful timeout/error handling and **Retry**.
- **English + Arabic** with full **RTL** mirroring (toggle in the header).
- **Accessibility** — labelled fields, `aria-invalid`/`aria-describedby`, a
  `progressbar`, a focus-trapped modal, keyboard navigation, and `aria-live`
  errors.
- **Resume later** — progress is saved to LocalStorage (debounced). The form
  starts empty; if a saved draft exists you're offered to **Resume** (which
  autofills it). Starting fresh overwrites a stale draft, and the draft is
  cleared after a successful submit.
- **Sensible inputs** — date of birth is capped to today (no future dates).
- **Responsive** — on mobile the Back / Next-Submit controls become a
  **fixed, full-width bottom bar**.
- **Mock submit** — the application is POSTed to a MSW-mocked endpoint that
  returns a reference number.

---

## Architecture & decisions

### Folder structure

Feature-based. Each feature owns its provider, hooks, components and steps, and
exposes a single public entry via `index.ts`. Filenames are kebab-case; imports
use the `@/` alias.

```
locales/                        # translation files at the project root
├── en.json
└── ar.json

src/
├── app/
│   ├── app-layout.tsx          # header + main shell; routed element as children
│   ├── routes.tsx              # route objects consumed by useRoutes
│   └── providers/
│       └── direction-provider.tsx   # syncs <html dir/lang> with the language
├── components/
│   ├── dialog.tsx              # accessible modal (focus trap, Esc, restore)
│   ├── language-toggle.tsx
│   └── form/                   # field-shell, text-field, select-field,
│       │                       # text-area-field, form-fields, use-field-error
│       └── __tests__/
├── features/
│   ├── wizard/
│   │   ├── index.ts            # → <Wizard/>
│   │   ├── wizard.tsx          # provider + page composed
│   │   ├── wizard-page.tsx     # step routing, guards, submit
│   │   ├── schema.ts           # Zod schemas (source of truth for types + validation)
│   │   ├── defaults.ts         # empty values + draft helpers
│   │   ├── submit-application.ts
│   │   ├── providers/wizard-provider.tsx
│   │   ├── hooks/              # use-wizard, use-submit-application
│   │   ├── components/         # progress-bar, step-nav, resume-banner, success-screen
│   │   ├── steps/              # step-1-personal, step-2-family, step-3-situation,
│   │   │                       # step-config (step → component map)
│   │   └── __tests__/          # schema + wizard-page tests
│   └── ai-assist/
│       ├── index.ts            # → <HelpMeWriteButton/>
│       ├── help-me-button.tsx
│       ├── openai.ts           # OpenAI client (via ky)
│       ├── build-prompt.ts
│       ├── hooks/use-help-write.ts
│       ├── components/suggestion-dialog.tsx
│       └── __tests__/
├── utils/                      # i18n config, env, http (ky), storage, openai-key
├── mocks/                      # MSW handlers + browser/server setup
└── test/                       # shared test setup + render helper
```

### Key decisions

- **One form instance for the whole wizard.** React Hook Form lives in
  `WizardProvider` (above the routes) so data survives step navigation. The form
  validates on change (`mode: 'onChange'`); each step advances only after its own
  fields pass, and the final submit validates the full schema.
- **Zod is the single source of truth.** Form types are `z.infer`red from the
  schemas, and the same `stepSchemas` drive: per-field validation, the
  **disabled-until-valid** Next/Submit button (via `useWatch`), the
  **step-access guard**, and the unit tests. Validation messages are **i18n
  keys**, translated at render time.
- **Interaction-gated errors.** `useFieldError` only surfaces a field's error once
  it's touched/dirty (or a submit was attempted), so live validation doesn't flag
  the whole step on the first keystroke.
- **Data-driven UI.** Steps render from a `STEP_MAP` (step → component) and fields
  render from a typed `FieldConfig[]` via `<FormFields>`, instead of long
  conditional / repeated JSX.
- **Draft persistence.** The form starts empty; a saved draft is loaded only when
  the user clicks **Resume**. Persistence writes when there's content and clears
  the key when empty, so starting fresh overwrites stale drafts and discarding
  removes them.
- **ky over hand-rolled fetch** — timeout + retry with backoff out of the box. The
  AI call retries transient failures; the submit uses `retry: 0` to avoid
  duplicate applications.
- **MSW everywhere** — the same handlers power the dev service worker and the
  Vitest Node server, so tests exercise real component behaviour against a mocked
  network.
- **RTL via logical CSS** (`ms-`, `me-`, `text-start`, `end-…`) so Arabic mirrors
  without duplicate styles; `DirectionProvider` flips `<html dir>`.

### Testing

`pnpm test:run` (Vitest + Testing Library + MSW) covers:

- **Schema** — accept/reject per step (email, future DOB, numeric IDs, min length).
- **Wizard navigation** — Next disabled until the step is valid; advancing; full
  happy-path submit through MSW (with the draft cleared afterwards).
- **Step access guard** — deep-linking ahead redirects to the first incomplete step.
- **Draft persistence & resume** — starts empty, Resume autofills, fresh input
  overwrites a stale draft, no banner without a draft.
- **AI flow** — suggestion → accept into field; API error → alert + retry; discard.
- **OpenAI key from URL** — `?open-ai-key` is captured, stripped from the URL, and
  expires after 10 minutes.
- **Storage helpers** — JSON round-trip + debounce.

### Deployment (Vercel)

Two pieces make the SPA work on Vercel:

- **`vercel.json`** rewrites all non-`/api` paths to `index.html`, so refreshing a
  client route like `/apply/step/3` doesn't 404.
- **`api/applications.js`** is a serverless function that stands in for the submit
  backend in production (in dev/tests the same route is mocked by MSW), so the
  final submit returns a reference number instead of a 405.

### Security & production improvements

1. **Proxy the OpenAI call** through a backend so the key isn't exposed.
2. **Don't store PII (National ID, etc.) in plaintext** LocalStorage — encrypt the
   draft or persist only non-sensitive fields.
3. **Server-side validation** of the submitted application.
4. **Streaming** AI responses for faster perceived latency.
5. **E2E tests** (Playwright) for the full flow in both languages.
