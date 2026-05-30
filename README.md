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

### Other scripts

```bash
pnpm build            # type-check + production build
pnpm test             # run Vitest in watch mode
pnpm test:run         # run the suite once (CI)
pnpm test:coverage    # run with coverage
pnpm lint             # ESLint
pnpm format           # Prettier
```

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

> ⚠️ **Security:** the API key is read in the browser and the request goes
> straight to OpenAI, which **exposes the key to the client**. This is acceptable
> for the case study only. In production, proxy the call through a backend /
> serverless function so the key stays server-side. See _Architecture → Security_.

---

## What it does

- **3-step wizard** with a progress bar
  1. Personal Information
  2. Family & Financial Info
  3. Situation Descriptions (AI-assisted)
- **Per-step validation** — you can't advance with an invalid step; the final
  submit re-validates the whole application.
- **AI "Help me write"** — generates a suggestion for each Step 3 textarea, shown
  in an accessible dialog with **Accept / Edit / Discard**, with graceful
  timeout/error handling and **Retry**.
- **English + Arabic** with full **RTL** mirroring (toggle in the header).
- **Accessibility** — labelled fields, `aria-invalid`/`aria-describedby`, a
  `progressbar`, a focus-trapped modal, keyboard navigation, and `aria-live`
  errors.
- **Resume later** — progress is saved to LocalStorage (debounced) and you're
  offered to resume on return.
- **Mock submit** — the application is POSTed to a MSW-mocked endpoint that
  returns a reference number.

---

## Architecture & decisions

### Folder structure

Feature-based. Each feature owns its provider, hooks, components and steps, and
exposes a single public entry via `index.ts`.

```
locales/                        # translation files at the project root
├── en.json
└── ar.json

src/
├── app/
│   ├── app-layout.tsx          # header + main shell; routed element as children
│   ├── routes.tsx              # route objects (useRoutes)
│   └── providers/
│       └── direction-provider.tsx   # syncs <html dir/lang>
├── components/                 # shared, presentational
│   ├── dialog.tsx              # accessible modal (focus trap, Esc, restore)
│   ├── language-toggle.tsx
│   └── form/                   # field-shell, text-field, select-field, text-area-field
├── features/
│   ├── wizard/
│   │   ├── index.ts            # → <Wizard/>
│   │   ├── wizard.tsx          # provider + page composed
│   │   ├── wizard-page.tsx
│   │   ├── schema.ts           # Zod schemas (source of truth for types + validation)
│   │   ├── submit-application.ts
│   │   ├── providers/wizard-provider.tsx
│   │   ├── hooks/              # use-wizard, use-submit-application
│   │   ├── components/         # progress-bar, step-nav, resume-banner, success-screen
│   │   └── steps/              # step-1-personal, step-2-family, step-3-situation
│   └── ai-assist/
│       ├── index.ts            # → <HelpMeWriteButton/>
│       ├── help-me-button.tsx
│       ├── openai.ts           # OpenAI client (via ky)
│       ├── build-prompt.ts
│       ├── hooks/use-help-write.ts
│       └── components/suggestion-dialog.tsx
├── utils/                      # i18n config, env, http (ky), storage
├── mocks/                      # MSW handlers + browser/server setup
└── test/                       # setup + render helper
```

**Conventions:** kebab-case filenames (max two hyphens); each feature folder is
self-contained and re-exports its public surface from `index.ts`.

### Key decisions

- **One form instance for the whole wizard** (React Hook Form in
  `WizardProvider`, above the routes) so data survives step navigation. Each step
  validates only its own fields via `trigger()`; submit validates the full Zod
  schema.
- **Zod as the single source of truth** — form types are `z.infer`red from the
  schemas, and the same schemas validate in the app and in unit tests. Validation
  messages are **i18n keys**, translated at render time.
- **ky over hand-rolled fetch** — gives timeout + retry with backoff for free.
  The AI call retries transient failures; the submit uses `retry: 0` to avoid
  duplicate applications.
- **MSW everywhere** — the same handlers power the dev service worker and the
  Vitest Node server, so tests exercise real component behaviour against a mocked
  network.
- **RTL via logical CSS** (`ms-`, `me-`, `text-start`…) so Arabic mirrors without
  duplicate styles; `DirectionProvider` flips `<html dir>`.

### Testing

`pnpm test:run` covers:

- Zod schema accept/reject per step
- Wizard navigation (blocked when invalid; advances when valid; full happy-path
  submit through MSW)
- AI flow (suggestion → accept into field; API error → alert + retry; discard)
- Storage helpers + debounce

### Security & production improvements

1. **Proxy the OpenAI call** through a backend so the key isn't exposed.
2. **Don't store PII (National ID, etc.) in plaintext** LocalStorage — encrypt the
   draft or persist only non-sensitive fields.
3. **Server-side validation** of the submitted application.
4. **Streaming** AI responses for faster perceived latency.
5. **E2E tests** (Playwright) for the full flow in both languages.
