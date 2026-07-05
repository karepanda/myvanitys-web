# MyVanitys Web

Frontend for **MyVanitys**, a web application for managing personal cosmetics collections (a "vanity"). Built with **React + Vite** and deployed on **Railway** via Docker (Nginx).

> 📖 For architecture, endpoints, authentication flow, design patterns, and detailed troubleshooting, see [`TECHNICAL_DOCUMENTATION.md`](./docs/TECHNICAL_DOCUMENTATION.md). This README covers quickstart only.

## Prerequisites

- Node.js 18.x
- npm
- Docker + Docker Compose (optional, for running the full stack with the backend)

## Installation & Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd myvanitys-web

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.development .env   # or .env.production for prod values

# 4. Start the development server (Vite)
npm start
```

Open [http://localhost:5173](http://localhost:5173) to view the app. ⚠️ **Not port 3000** — that was the Create React App port; this project uses Vite.

The page auto-reloads on save. Lint errors show up in the browser console.

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Starts the Vite development server on `localhost:5173` |
| `npm test` | Runs tests with Vitest in watch mode |
| `npm run test:coverage` | Runs tests with a coverage report |
| `npm run build` | Produces the production build in `dist/` |

## Full Stack with Docker

```bash
docker compose up
```

Starts PostgreSQL + the API (Spring Boot, `../myvanitys-api`) + this frontend. See section 10 of the technical documentation for details on the multi-stage build and Nginx configuration.

## WireMock — Local Google OAuth2 Simulation

To develop without depending on the real Google OAuth2 backend, the repo includes WireMock stubs in `Docker/wiremock/`.

1. **Build the Docker image**
   ```bash
   cd Docker/wiremock
   docker build -t wiremock .
   ```

2. **Run the container**
   ```bash
   docker run -d -p 8080:8080 --name my-wiremock wiremock
   ```

3. **Verify the stubs loaded correctly**
   ```bash
   curl http://localhost:8080/__admin/mappings
   ```

4. **Test the token exchange simulation**
   ```bash
   curl -X POST http://localhost:8080/oauth2/v4/token \
     -d "code=AUTHORIZATION_CODE&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&redirect_uri=YOUR_REDIRECT_URI&grant_type=authorization_code"
   ```

5. **Access the WireMock admin interface**

   [http://localhost:8080/__admin](http://localhost:8080/__admin)

6. **Test the `/auth/google` endpoint**
   ```bash
   curl -X POST http://localhost:8080/auth/google \
     -H "Content-Type: application/json" \
     -H "X-Request-ID: d2919d3f-6b2f-49f4-9dd5-efbbc9b1c8f8" \
     -H "X-Flow-ID: 123e4567-e89b-12d3-a456-426614174000" \
     -H "Accept-Language: en-US" \
     -H "User-Agent: MyVanitysApp/1.0" \
     -d '{
           "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.payload.signature"
         }'
   ```

## More Information

Full documentation on architecture, stack, design patterns, consumed endpoints, authentication flow, testing, and deployment lives in [`TECHNICAL_DOCUMENTATION.md`](./docs/TECHNICAL_DOCUMENTATION.md).