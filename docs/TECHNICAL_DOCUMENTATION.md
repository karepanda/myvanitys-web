# MyVanitys Web — Technical Documentation

> **Version:** 0.3.0 | **Last Updated:** 2026-07-05 | **Owner:** [NOT FOUND IN REPO]

---

## 1. Overview

- **Purpose:** MyVanitys is a web application that allows beauty and cosmetics users to manage their personal "vanity" — a collection of products they own. Users can create, browse, search, review, and organize cosmetic products. The application supports Google OAuth2 authentication and provides a public product catalog alongside a private collection dashboard.
- **Key Features:**
  - Google OAuth2 authentication (login and register flows)
  - Product CRUD (create, read, update, delete) with color, brand, and category metadata
  - Public product catalog with "add to my vanity" functionality
  - Full-text product search with category and price-range filtering
  - Star-rating review system per product
  - Three-mode dashboard: "My Vanity", "Add Products", and "Search"
  - Cookie consent banner with session-level persistence
  - Responsive UI with Tailwind CSS and Framer Motion animations
  - Dockerized deployment with multi-stage build (Vite → Nginx)

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js (via Vite dev server / Nginx in production) | 18.x |
| Framework | React | ^18.3.1 |
| Build Tool | Vite | ^5.4.9 |
| Routing | react-router-dom | ^6.27.0 |
| Styling / UI | Tailwind CSS + custom CSS modules | ^3.4.14 |
| Forms | react-hook-form | ^7.54.0 |
| Animation | framer-motion | ^11.17.0 |
| Icons | react-icons | ^5.3.0 |
| ID Generation | uuid | ^11.1.0 |
| Testing | Vitest + Testing Library | ^2.1.3 |
| Coverage | @vitest/coverage-v8 | ^2.1.3 |
| Linting | ESLint + eslint-plugin-react | ^9.27.0 |
| CSS Processing | PostCSS + Autoprefixer | ^8.4.47 |
| DOM Simulation (tests) | jsdom | ^25.0.1 |

## 3. Prerequisites

- [ ] Node.js 18.x (see `engines` in [`package.json`](package.json:19))
- [ ] npm (lockfile at [`package-lock.json`](package-lock.json))
- [ ] Docker + Docker Compose (for full-stack deployment)
- [ ] A Google Cloud OAuth2 Client ID (for authentication)

## 4. Setup & Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd myvanitys-web

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.development .env   # or use .env.production for prod settings

# 4. Start development server (Vite, port 5173)
npm start

# 5. (Optional) Full stack with Docker
docker compose up
```

## 5. Environment Variables

| Variable | Description | Default / Dev Value |
|----------|-------------|---------------------|
| `VITE_API_URL` | Base URL for the Spring Boot backend API | `http://localhost:8080/myvanitys/api/v1` |
| `VITE_REDIRECT_URI` | OAuth2 callback URL that Google redirects to after authentication | `http://localhost:5173/callback` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth2 client ID for the frontend | Defined in `.env.development` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 client secret (used in docker-compose, not in frontend bundle) | Defined in `.env.development` |
| `PORT` | Nginx listen port inside the container (Docker only) | `80` |

> **Note:** There is no `.env.example` file in this repository. The files [`.env.development`](.env.development) and [`.env.production`](.env.production) are committed directly. Variable names above are extracted from those files; values are deliberately omitted from the production file.

## 6. Project Structure

```
myvanitys-web/
├── index.html                     # Vite entry HTML
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
├── vitest.config.js               # Vitest configuration
├── tailwind.config.js             # Tailwind CSS theme (custom color palette)
├── postcss.config.js              # PostCSS plugins (Tailwind + Autoprefixer)
├── eslint.config.mjs              # ESLint flat config (js/recommended + react recommended)
├── Dockerfile                     # Multi-stage: Node 18 build → Nginx Alpine serve
├── nginx.conf.template            # Nginx config with envsubst for $PORT
├── docker-compose.yml             # Root: PostgreSQL + Spring Boot API + Frontend
├── railway.toml                   # Railway deployment config (Nixpacks builder)
├── .env.development               # Dev environment variables
├── .env.production                # Production environment variables
├── Docker/
│   ├── docker-compose.yml         # Alt: PostgreSQL + API + Frontend + specifications service
│   ├── nginx/                     # Nginx config overrides (directory present)
│   ├── letsencrypt/               # TLS certificates directory
│   └── wiremock/                  # WireMock stubs for Google OAuth2 simulation
│       ├── Dockerfile
│       ├── __files/               # JSON response fixtures (auth, userinfo)
│       ├── mappings/              # Request → response mappings
│       └── stubs/                 # Additional stub definitions
├── src/
│   ├── index.jsx                  # React entry point (ReactDOM.createRoot)
│   ├── index.css                  # Global styles (Tailwind directives + custom resets)
│   ├── reportWebVitals.js         # Web vitals reporting
│   ├── App/
│   │   ├── App.jsx                # Root component: VanitysProvider → BrowserRouter → AppContent
│   │   └── App.css
│   ├── Routes/
│   │   └── index.jsx              # Route definitions (/, /dashboard, /callback, /*)
│   ├── Pages/
│   │   ├── Home/
│   │   │   ├── Home.jsx           # Landing page: MainContent + CookieBanner
│   │   │   └── Home.css
│   │   └── UserDashboard/
│   │       ├── UserDashboard.jsx  # Auth-gated dashboard with WelcomePopup
│   │       └── UserDashboard.css
│   ├── components/
│   │   ├── Navbar/                # Top navigation: search bar, login/register buttons, user menu
│   │   ├── MainContent/           # Home page hero/content with illustrations
│   │   ├── Dashboard/             # Three-mode dashboard: my-vanity / add-products / search
│   │   ├── DashboardNavigation/   # Mode switcher tabs inside dashboard
│   │   ├── ProductCard/           # Editable product card with rating display
│   │   ├── NoProductCard/         # Empty state placeholder card
│   │   ├── ProductPopup/          # Product detail modal
│   │   ├── CreateProductPopup/    # Product creation form modal
│   │   ├── CreateReviewPopup/     # Star-rating review submission modal
│   │   ├── ProductReviews/        # Review list display component
│   │   ├── Categories/            # Category filter chips
│   │   ├── SortControl/           # Sort-order dropdown
│   │   ├── CookieBanner/          # GDPR cookie consent banner
│   │   ├── ConfirmationDialog/    # Generic confirmation modal
│   │   ├── DeleteModal/           # Product deletion confirmation
│   │   ├── MissingFieldsPopup/    # Error/warning/info popup
│   │   ├── WelcomePopup/          # First-time user welcome modal
│   │   ├── UserProfile/           # User profile display
│   │   ├── UserMessage/           # Inline user message/toast
│   │   ├── Notification/          # Temporary success notification (add/update/delete)
│   │   ├── Popup/                 # Reusable popup wrapper
│   │   ├── Modal/                 # Reusable modal overlay wrapper
│   │   ├── Form/                  # Reusable form base (react-hook-form)
│   │   ├── Login/                 # Login trigger button
│   │   ├── Register/              # Register trigger button
│   │   ├── Auth/
│   │   │   ├── AuthCallbackHandler.jsx  # OAuth2 callback: processes ?code= and ?state=
│   │   │   └── Auth.css
│   │   └── PageNotFound/          # 404 fallback page
│   ├── context/
│   │   └── index.jsx              # VanitysContext/VanitysProvider: global state, auth, product CRUD, UI flags
│   ├── hooks/
│   │   ├── index.js               # Barrel export for all hooks
│   │   ├── useFetch.js            # Generic authenticated fetch hook
│   │   ├── useFetchUserData.js    # Fetches /users/profile
│   │   ├── useFetchUserProducts.js# Fetches user's vanity products (re-fetches on trigger)
│   │   ├── usePublicProducts.js   # Public catalog with local search/filter (re-fetches on trigger)
│   │   ├── useProductSearch.js    # API-backed product search
│   │   ├── useReviews.js          # Review CRUD hook (load, add, update, delete)
│   │   └── useDeleteProduct.js    # Delete product with loading/error state
│   ├── services/
│   │   ├── auth/
│   │   │   ├── authService.js          # Orchestrates Google OAuth flow (login vs register)
│   │   │   ├── googleAuthAdapter.js    # Builds redirect URL, parses callback code
│   │   │   ├── loginService.js         # POST /auth/google
│   │   │   └── registerService.js      # POST /auth/register
│   │   └── product/
│   │       ├── productFacade.js        # Facade aggregating all product operations
│   │       ├── adapters/
│   │       │   └── productApiAdapter.js # HTTP layer: get/post/put/delete with error handling
│   │       └── operations/
│   │           ├── createProductService.js
│   │           ├── readProductService.js
│   │           ├── updateProductService.js
│   │           ├── deleteProductService.js
│   │           ├── searchProductService.js
│   │           └── reviewService.js
│   ├── test/
│   │   ├── setupTests.js
│   │   ├── services/product/operations/
│   │   │   └── createProductService.test.js
│   │   └── utils/
│   │       └── dashboardProducts.test.js
│   ├── dev/                       # Development utilities (palette preview, initial state)
│   └── assets/                    # Static images (PNG): illustrations, icons
```

> Each directory/package is annotated with its role.

## 7. Architecture & Design Patterns

### Design Patterns Used

- **Facade Pattern:** [`productFacade.js`](src/services/product/productFacade.js) provides a unified interface over six operation modules (create, read, update, delete, search, review), so consumers (context, hooks) never call the adapter directly.
- **Adapter Pattern:** [`productApiAdapter.js`](src/services/product/adapters/productApiAdapter.js) abstracts the HTTP transport (fetch + headers + error handling) behind `get`, `post`, `put`, `delete` methods. All product operations use this adapter.
- **Context/Provider Pattern:** [`VanitysProvider`](src/context/index.jsx) wraps the entire app and exposes auth state, UI modal flags, and all product CRUD functions via React Context. This avoids prop drilling across 20+ components.
- **Refresh Trigger Pattern:** Two integer state variables (`productsRefreshTrigger`, `publicProductsRefreshTrigger`) are incremented after mutations. Custom hooks (`useFetchUserProducts`, `usePublicProducts`) include them in their `useEffect` dependency arrays, causing automatic re-fetch without manual invalidation.
- **Strategy Pattern (Auth):** [`authService.handleAuthentication()`](src/services/auth/authService.js:17) inspects the OAuth2 `state` parameter to dispatch to either `loginService` or `registerService`, allowing the same Google redirect to serve two flows.

### [FRONTEND] Component Tree

```
<VanitysProvider>
  <BrowserRouter>
    <AppContent>
      ├── <Navbar>                          (hidden on /dashboard and /callback)
      │   ├── <Register> (Modal)            (conditional)
      │   ├── <Login> (Modal)               (conditional)
      │   ├── <CreateProductPopup> (Modal)   (conditional)
      │   └── <UserProfile>                 (conditional)
      ├── <AppRoutes>
      │   ├── path="/" → <Home>
      │   │   ├── <MainContent>
      │   │   └── <Modal><CookieBanner></Modal>  (conditional)
      │   ├── path="/dashboard" → <UserDashboard>
      │   │   ├── <WelcomePopup>             (conditional, new users)
      │   │   └── <Dashboard>
      │   │       ├── <DashboardNavigation>  (mode tabs)
      │   │       ├── mode=my-vanity:
      │   │       │   ├── <ProductCard>[]    or <NoProductCard>
      │   │       │   ├── <ProductPopup> (Modal)
      │   │       │   ├── <CreateReviewPopup> (Modal)
      │   │       │   ├── <DeleteModal> (Modal)
      │   │       │   └── <CreateProductPopup> (Modal)
      │   │       ├── mode=add-products:
      │   │       │   ├── <Categories>
      │   │       │   ├── <SortControl>
      │   │       │   └── <PublicProductCard>[]
      │   │       └── mode=search:
      │   │           └── <SearchedProductCard>[]
      │   ├── path="/callback" → <AuthCallbackHandler>
      │   └── path="/*" → <PageNotFound>
      └── <Modal><MissingFieldsPopup></Modal>  (global error overlay)
```

### [BACKEND] API Endpoints

> This is a **frontend-only** repository. The backend is a separate Spring Boot project (`../myvanitys-api`) referenced in [`docker-compose.yml`](docker-compose.yml:27). All endpoints below are **consumed** by this frontend — they are defined in the service layer files under [`src/services/`](src/services/). The base URL is `${VITE_API_URL}`.

| Method | Path | Description | Auth Required | Source File |
|--------|------|-------------|---------------|-------------|
| POST | `/auth/google` | Google OAuth2 login — exchanges auth code for JWT token | No | [`loginService.js`](src/services/auth/loginService.js:24) |
| POST | `/auth/register` | Google OAuth2 registration — creates new user account | No | [`registerService.js`](src/services/auth/registerService.js:29) |
| GET | `/users/profile` | Fetch current user's profile data | Yes | [`useFetchUserData.js`](src/hooks/useFetchUserData.js:18) |
| GET | `/products` | List all products (with collection status when authenticated) | Optional | [`readProductService.js`](src/services/product/operations/readProductService.js:12) |
| GET | `/products?page={page}&size={size}` | Paginated product listing | Optional | [`readProductService.js`](src/services/product/operations/readProductService.js:155) |
| GET | `/products/{productId}` | Get a single product by ID | Yes | [`readProductService.js`](src/services/product/operations/readProductService.js:23) |
| GET | `/products/featured?limit={limit}` | Get featured products | Yes | [`readProductService.js`](src/services/product/operations/readProductService.js:71) |
| GET | `/products/categories` | List all product categories | Yes | [`readProductService.js`](src/services/product/operations/readProductService.js:169) |
| GET | `/products/search?query={query}` | Full-text product search (min 2 chars) | Yes | [`searchProductService.js`](src/services/product/operations/searchProductService.js:40) |
| GET | `/products/category/{categoryId}` | Search products by category | Yes | [`searchProductService.js`](src/services/product/operations/searchProductService.js:73) |
| GET | `/users/{userId}/products` | Get all products owned by a specific user | Yes | [`readProductService.js`](src/services/product/operations/readProductService.js:45) |
| POST | `/products` | Create a new product (name, brand, categoryId, colorHex) | Yes | [`createProductService.js`](src/services/product/operations/createProductService.js:22) |
| POST | `/products/{productId}/add-to-vanity` | Add an existing product to the current user's vanity | Yes | [`readProductService.js`](src/services/product/operations/readProductService.js:131) |
| PUT | `/products/{productId}` | Update product details | Yes | [`updateProductService.js`](src/services/product/operations/updateProductService.js:14) |
| PUT | `/products/{productId}/status` | Toggle product active/inactive status | Yes | [`updateProductService.js`](src/services/product/operations/updateProductService.js:32) |
| PUT | `/products/{productId}/price` | Update product price | Yes | [`updateProductService.js`](src/services/product/operations/updateProductService.js:48) |
| DELETE | `/products/{productId}` | Delete a product | Yes | [`deleteProductService.js`](src/services/product/operations/deleteProductService.js:13) |
| POST | `/products/{productId}/reviews` | Add a review (rating 1-5 + comment) | Yes | [`reviewService.js`](src/services/product/operations/reviewService.js:31) |
| GET | `/products/{productId}/reviews` | Get reviews for a product (optional page/limit/sortBy) | No | [`reviewService.js`](src/services/product/operations/reviewService.js:57) |
| PUT | `/products/{productId}/reviews/{reviewId}` | Update a review (rating or comment) | Yes | [`reviewService.js`](src/services/product/operations/reviewService.js:92) |
| DELETE | `/products/{productId}/reviews/{reviewId}` | Delete a review | Yes | [`reviewService.js`](src/services/product/operations/reviewService.js:109) |
| GET | `/user/reviews` | Get current user's reviews (optional page/limit) | Yes | [`reviewService.js`](src/services/product/operations/reviewService.js:134) |

## 8. Code Quality & Linting Standards

### Linter Configuration

- **Tool:** ESLint (flat config)
- **Config File:** [`eslint.config.mjs`](eslint.config.mjs)
- **Key Rules / Plugins:**
  - `@eslint/js` — `js/recommended` base rules
  - `eslint-plugin-react` — flat recommended preset with `react.version: "detect"`
  - Custom overrides: `react/react-in-jsx-scope` set to `"off"` (React 17+ JSX transform), `react/jsx-uses-vars` set to `"error"`
  - Browser globals enabled (no Node.js globals in source)

### IDE Integration

- **Recommended IDE:** VS Code (based on workspace file at [`src/components/Notification/myvanitys-web.code-workspace`](src/components/Notification/myvanitys-web.code-workspace))
- **Built-in Inspections:** ESLint covers JS/JSX; Tailwind CSS IntelliSense recommended for utility classes
- **Pre-commit Checks:** No pre-commit hooks (Husky, lint-staged, etc.) found in the repository

### Coding Conventions

1. **Component-per-folder with co-located CSS** — Each component resides in its own directory under [`src/components/`](src/components/) with a matching `.css` file (and optionally `.responsive.css`), e.g. [`Navbar/Navbar.jsx`](src/components/Navbar/Navbar.jsx) + [`Navbar/Navbar.css`](src/components/Navbar/Navbar.css) + [`Navbar/Navbar.responsive.css`](src/components/Navbar/Navbar.responsive.css).
2. **Service layer with facade** — All business logic lives in [`src/services/`](src/services/), organized by domain (auth, product). Components and hooks never call `fetch` directly; they go through the facade or context functions.
3. **Centralized error handling** — Every async operation accepts an `errorHandler` parameter (instance of `ErrorHandler` from `src/utils/errorHandler.js`). Errors display in the global [`MissingFieldsPopup`](src/components/MissingFieldsPopup/MissingFieldsPopup.jsx).
4. **Auth token in localStorage** — The JWT token and user object are persisted under the key `vanitys_auth` with a 30-day expiration. The context auto-loads this on mount via `loadSavedAuth()`.
5. **Bearer token prefix normalization** — [`createProductService.js`](src/services/product/operations/createProductService.js:7) auto-prepends `"Bearer "` if the token is missing it, while the adapter and other services expect the token already prefixed.

### Technical Debt Log

> No `TODO`, `FIXME`, `HACK`, `XXX`, `WORKAROUND`, or `BUG` comments were found in the codebase.

| ID | Date | Severity | Issue | Location | Status |
|----|------|----------|-------|----------|--------|
| — | — | — | — | — | — |

## 9. Testing

### Framework & Strategy

- **Framework:** Vitest (with jsdom for DOM simulation)
- **Coverage Provider:** @vitest/coverage-v8
- **Coverage Target:** No explicit threshold configured
- **Test Types:**
  - Unit tests — [`src/test/services/product/operations/createProductService.test.js`](src/test/services/product/operations/createProductService.test.js)
  - Utility tests — [`src/test/utils/dashboardProducts.test.js`](src/test/utils/dashboardProducts.test.js)
  - Integration tests — [NOT FOUND IN REPO]
  - E2E tests — [NOT FOUND IN REPO]

### Key Commands

```bash
npm test                  # Run all tests (vitest run)
npm run test:coverage     # Run with coverage report (no watch mode)
npx vitest run src/test/services/product/operations/createProductService.test.js  # Run a single test file
```

## 10. Deployment

### Containerization

- **Dockerfile:** ([`Dockerfile`](Dockerfile)) Multi-stage build:
  1. **Stage 1 (build):** `node:18-alpine` — copies source, runs `npm ci`, injects build-time ARGs (`VITE_API_URL`, `VITE_REDIRECT_URI`, `VITE_GOOGLE_CLIENT_ID`) as ENV, runs `npm run build` to produce static `dist/`.
  2. **Stage 2 (serve):** `nginx:alpine` — copies `dist/` to `/usr/share/nginx/html`, installs `gettext` for `envsubst`, runs `envsubst` on [`nginx.conf.template`](nginx.conf.template) substituting `$PORT`, then starts nginx.

- **Nginx Configuration:** ([`nginx.conf.template`](nginx.conf.template))
  - Listens on `${PORT}` (default 80).
  - Serves static files with 1-year cache for JS/CSS/images.
  - SPA fallback: `try_files $uri $uri/ /index.html` so client-side routing works.
  - Security headers: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
  - Gzip compression enabled for text and JSON content types.
  - **No API proxy** — the frontend calls the backend directly via the absolute `VITE_API_URL` baked in at build time.

- **Orchestration:** Two `docker-compose.yml` files:
  - Root [`docker-compose.yml`](docker-compose.yml): PostgreSQL 13 + Spring Boot API (from `../myvanitys-api`) + Frontend (this repo). Frontend maps port `5173→80`.
  - [`Docker/docker-compose.yml`](Docker/docker-compose.yml): Same plus a `specifications` service (from `../myvanitys-specifications`). Frontend maps port `80→80` (production-style).

### Hosting

- **Platform:** Railway (configured via [`railway.toml`](railway.toml) — uses Nixpacks builder, `ON_FAILURE` restart policy, max 10 retries, 1 replica)
- **CI/CD Pipeline:** [NOT FOUND IN REPO] — no GitHub Actions workflows or other CI config files present

### Build & Deploy Commands

```bash
npm run build             # Production build (vite build → dist/)
docker compose up         # Full stack startup (PostgreSQL + API + Frontend)
docker build -t myvanitys-web .   # Build frontend Docker image only
```

## 11. Authentication Flow

1. User clicks "Login" or "Register" in the [`Navbar`](src/components/Navbar/Navbar.jsx).
2. [`authService.initiateGoogleAuth(mode)`](src/services/auth/authService.js:8) calls [`googleAuthAdapter.redirectToGoogleOAuth()`](src/services/auth/googleAuthAdapter.js:3), which builds and navigates to: `https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&response_type=code&scope=...&state=login|register`.
3. After consent, Google redirects to `/callback?code=...&state=...`.
4. [`AuthCallbackHandler`](src/components/Auth/AuthCallbackHandler.jsx) calls [`authService.handleAuthentication()`](src/services/auth/authService.js:17) which parses the code and state.
5. Based on `state`, dispatches to:
   - `loginService.authenticate(code)` → `POST /auth/google` → returns `{ token, user }`
   - `registerService.register(code)` → `POST /auth/register` → returns `{ userId, email, name, isNewUser: true }`
6. On success, [`updateAuthData()`](src/context/index.jsx:118) saves to React context and `localStorage.vanitys_auth`, then navigates to `/dashboard`.
7. New users see the [`WelcomePopup`](src/components/WelcomePopup/WelcomePopup.jsx) once (controlled by `sessionStorage.welcomeShow`).

## 12. Dashboard Modes

The [`Dashboard`](src/components/Dashboard/Dashboard.jsx) component reads `?mode=` from the URL query string to render one of three views:

| Mode | URL | Description | Components |
|------|-----|-------------|------------|
| `my-vanity` | `/dashboard` (default) | Authenticated user's product collection | `ProductCard`, `NoProductCard`, `ProductPopup`, `CreateReviewPopup`, `DeleteModal` |
| `add-products` | `/dashboard?mode=add-products` | Public catalog filtered to products not already in vanity | `Categories`, `SortControl`, public `ProductCard` with "add to vanity" button |
| `search` | `/dashboard?mode=search&q=...` | API search results | Searched product cards via `useProductSearch` hook |

## 13. WireMock (Local OAuth2 Simulation)

For offline development without a real Google OAuth2 backend, the repository includes WireMock stubs in [`Docker/wiremock/`](Docker/wiremock/):

- **JSON fixtures:** Success/empty-product responses for the `/auth/google` endpoint, userinfo payloads
- **Mappings:** CORS preflight handling, happy-path auth flows with and without empty product lists
- **Stubs:** Token endpoint and userinfo endpoint simulations (Google's `oauth2/v4/token` and `oauth2/v3/userinfo`)

Build and run:
```bash
cd Docker/wiremock
docker build -t wiremock .
docker run -d -p 8080:8080 --name my-wiremock wiremock
```

## 14. Troubleshooting & Common Issues

| Symptom | Likely Cause | Resolution |
|---------|-------------|------------|
| Blank page after `npm start` | Vite dev server runs on port 5173, not 3000 (old CRA port) | Open `http://localhost:5173` |
| "No authorization code found" error on `/callback` | Visiting `/callback` directly without Google redirect | Navigate to `/` and click Login/Register to initiate OAuth flow |
| API calls fail with CORS in development | Backend not running or on different port | Ensure Spring Boot API is running on `localhost:8080` and `VITE_API_URL` is correctly set |
| Infinite loading after login | `authInitialized` flag stuck; `localStorage` has stale auth data | Clear `localStorage.vanitys_auth` and `sessionStorage.welcomeShow`, then reload |
| Cookie banner blocks buttons | Banner is visible; buttons are disabled until banner is dismissed | Click "Accept" on the cookie banner to close it |
| Search returns no results | Query must be at least 2 characters | Enter at least 2 characters before searching |
| Docker frontend can't reach API | API URL baked at build time with wrong value | Set `VITE_API_URL` build arg correctly (e.g., `--build-arg VITE_API_URL=https://api.myvanitys.com/myvanitys/api/v1`) |
