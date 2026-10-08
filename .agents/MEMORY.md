# MEMORY.md — MyVanitys Web

Durable project memory shared by coding agents. Keep this file concise and remove stale information.

## Current state
- React 18 SPA built with Vite 6 and served by Nginx in production.
- Authentication uses Google OAuth, JWTs, React context, and `localStorage.vanitys_auth`.
- Product catalog, vanity management, search, reviews, localization, and analytics consent are implemented.
- Vitest covers unit/component behavior; Playwright provides deterministic desktop and mobile visual regression tests.

## Decisions and rationale
- Keep server communication behind service adapters so components remain focused on UI behavior.
- Keep shared authentication, product, and modal state in `VanitysContext` to preserve the current application flow.
- Translate user-visible content through i18next while keeping routes and backend identifiers language-neutral.
- Treat environment values as build-time configuration because Vite embeds `VITE_*` values in the bundle.

## Lessons and pitfalls
- Do not replace backend errors with translation keys directly; map them through the centralized error utilities.
- Do not regenerate visual baselines unless a reviewed UI change is intentional.
- Session expiry must remove authentication state without clearing unrelated browser storage.

## Next steps
- No durable next step is recorded.

Update this file only when durable project state, decisions, lessons, or next steps change. Move permanent rules to `AGENTS.md`. Never add secrets, tokens, personal data, commit history, or routine task logs.
