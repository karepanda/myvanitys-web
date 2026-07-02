# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:5173
npm run build      # Production build
npm test           # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report (no watch)
```

Run a single test file:
```bash
npx vitest run src/test/services/product/operations/createProductService.test.js
```

## Architecture

**Tech stack**: React 18 + Vite, Tailwind CSS, React Router v6, React Hook Form, Framer Motion. Tests use Vitest + Testing Library.

### Global State — `src/context/index.jsx`

`VanitysContext` / `VanitysProvider` is the single source of truth for the entire app. It holds:
- Auth state (`apiResponse.token`, `isAuthenticated`, `userToken`)
- All UI modal/popup visibility flags
- Product CRUD operations (delegates to `productFacade`)
- Refresh triggers (`productsRefreshTrigger`, `publicProductsRefreshTrigger`) — increment these integers to cause hooks to re-fetch data
- Auth token is persisted to `localStorage` under key `vanitys_auth` as `{ token, user, expiresAt }`

### Service Layer

```
src/services/
├── auth/
│   ├── authService.js          # Entry point: initiateGoogleAuth(), handleAuthentication()
│   ├── googleAuthAdapter.js    # Builds Google OAuth2 redirect URL, parses callback
│   ├── loginService.js
│   └── registerService.js
└── product/
    ├── productFacade.js        # Facade aggregating all product operations
    ├── adapters/
    │   └── productApiAdapter.js  # HTTP layer: get/post/put/delete against VITE_API_URL
    └── operations/
        ├── createProductService.js
        ├── readProductService.js
        ├── updateProductService.js
        ├── deleteProductService.js
        ├── searchProductService.js
        └── reviewService.js
```

Every service call takes an `errorHandler` parameter. Use `ErrorHandler` (from `src/utils/errorHandler.js`) for centralized error display — it sets the MissingFieldsPopup state in context.

### Data Fetching Hooks — `src/hooks/`

- `useFetchUserProducts` — authenticated user's vanity products, re-runs on `productsRefreshTrigger`
- `usePublicProducts` — lazy-loaded public catalog, re-runs on `publicProductsRefreshTrigger`
- `useProductSearch` — search results via `productFacade.searchProducts`
- `useFetch` — generic fetch hook that reads token from context; used for one-off requests

### Routes

```
/           → Home (public landing + cookie banner)
/dashboard  → UserDashboard (requires auth; shows Dashboard component)
/callback   → AuthCallbackHandler (Google OAuth2 return URL)
/*          → PageNotFound
```

### Dashboard Modes

`Dashboard.jsx` switches between three modes controlled by `?mode=` URL param:
- `my-vanity` (default) — user's own products, `ProductCard` component
- `add-products` — public catalog to add from, `PublicProductCard` component
- `search` — API search results, `SearchedProductCard` component

### Authentication Flow

1. User clicks Login/Register → `authService.initiateGoogleAuth(mode)` redirects to Google OAuth2
2. Google redirects back to `/callback` with `?code=...&state=login|register`
3. `AuthCallbackHandler` calls `authService.handleAuthentication()` which dispatches to `loginService` or `registerService`
4. On success, `updateAuthData()` saves to context + localStorage and navigates to `/dashboard`

### API Communication

All HTTP calls go through `productApiAdapter` and `apiUtils.getCommonHeaders()`. Every request includes `X-Request-ID`, `X-Flow-ID`, `User-Agent: MyVanitysApp/1.0`, and `Accept-Language: en-US` headers. Bearer token is added when present.

Base URL is set via `VITE_API_URL` (dev default: `http://localhost:8080/myvanitys/api/v1`).

### Environment Variables

| Variable | Dev default |
|---|---|
| `VITE_API_URL` | `http://localhost:8080/myvanitys/api/v1` |
| `VITE_REDIRECT_URI` | `http://localhost:5173/callback` |
| `VITE_GOOGLE_CLIENT_ID` | see `.env.development` |

### Docker (Full Stack)

`docker-compose.yml` at the repo root starts PostgreSQL, the Spring Boot API (`../myvanitys-api`), and nginx serving the frontend:

```bash
docker compose up
```

Frontend: port 5173 → nginx:80 | API: port 8080 | DB: port 5432