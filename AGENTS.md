# AGENTS.md — MyVanitys Web

React single-page application for managing personal cosmetic collections and browsing the public catalog.

## Stack and structure
- Node 22+, React 18, Vite 6, React Router 7, Tailwind CSS 3, Vitest 4, and Playwright.
- `src/context/index.jsx` owns shared authentication, product, and UI state.
- Keep HTTP access in `src/services`, data-fetching behavior in `src/hooks`, and translations in `src/locales`.

## Commands
```bash
npm ci
npm start
npm test
npm run test:coverage
npm run test:e2e:visual
npx eslint .
npm run build
```

## Conventions and domain rules
- Use JavaScript/JSX and follow the existing component, hook, service, and test patterns.
- Put all user-facing copy, accessibility labels, placeholders, and errors through i18next; keep API identifiers stable.
- Preserve `localStorage.vanitys_auth` as `{ token, user, expiresAt }` and clear only authentication data on expiry.
- Preserve the Google OAuth callback flow through `/callback` and the `login`/`register` state values.
- Route service and API failures through `ErrorHandler`; do not silently swallow errors or display raw server messages.
- Send API calls through the existing adapters and common headers; treat `VITE_API_URL` as the API base URL.
- Keep new UI responsive on desktop and mobile; update visual snapshots only for intentional visual changes.

## Working agreement
- Read `MEMORY.md` before starting work. Update it only for durable state, decisions, lessons, or next steps.
- Keep changes focused and preserve existing behavior unless the task explicitly changes it.
- Ask before adding dependencies or changing environment variables, authentication, persisted data, or API contracts.
- Never commit secrets, generated build output, reports, or local IDE/agent settings.
- Use `README.md` for setup, `docs/TECHNICAL_DOCUMENTATION.md` for architecture, and `docs/I18N_INVENTORY.md` for localization.

## Verification
- Run the smallest relevant tests and lint, then `npm run build` when production behavior may be affected.
- Summarize changed behavior, checks run, and any durable decision; never store secrets or routine activity in memory.
