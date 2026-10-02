// Mock router + network determinism helpers for the visual regression suite.
//
// The application talks to `${VITE_API_URL}${endpoint}` where VITE_API_URL is
// `http://localhost:8080/myvanitys/api/v1` in development. We intercept every
// request whose path contains `/api/v1/` and fulfil it from an in-memory
// registry, so no request can ever reach a real backend.

// Matches any API request path, regardless of host/port/scheme.
const API_PATH = /\/api\/v1\//;

// Third-party hosts that must never be hit (Google Fonts / Analytics).
const EXTERNAL_HOST =
  /(fonts\.googleapis\.com|fonts\.gstatic\.com|googletagmanager\.com|google-analytics\.com)$/;

// Strips everything up to and including `/api/v1`, returning the endpoint path
// (e.g. `/products/search`) for pattern matching.
function endpointPath(pathname) {
  const match = pathname.match(/\/api\/v1(\/.*)$/);
  return match ? match[1] : pathname;
}

// Matches a `/users/:userId/products`-style pattern against a pathname,
// returning the named parameters or null when it does not match.
function matchSegments(pattern, pathname) {
  const patternSegments = pattern.split('/').filter(Boolean);
  const pathSegments = pathname.split('/').filter(Boolean);
  if (patternSegments.length !== pathSegments.length) return null;

  const params = {};
  for (let i = 0; i < patternSegments.length; i += 1) {
    const expected = patternSegments[i];
    const actual = pathSegments[i];
    if (expected.startsWith(':')) {
      params[expected.slice(1)] = decodeURIComponent(actual);
    } else if (expected !== actual) {
      return null;
    }
  }
  return params;
}

/**
 * Builds a small mock router for the application API.
 *
 * Handlers receive `(params, { url, request })` and return
 * `{ status = 200, body }` (body is JSON-stringified unless it is a string).
 * Any request that matches no registered route is aborted and recorded in
 * `router.unmatched`, which the shared fixture asserts is empty at teardown.
 */
function createMockRouter() {
  const routes = [];
  const unmatched = [];

  function register(method, pattern, handler) {
    routes.push({ method, pattern, handler });
  }

  async function handle(route) {
    const request = route.request();
    const method = request.method();
    const url = new URL(request.url());
    const pathname = endpointPath(url.pathname);

    for (const candidate of routes) {
      if (candidate.method !== method) continue;
      const params = matchSegments(candidate.pattern, pathname);
      if (!params) continue;

      const result = await candidate.handler(params, { url, request });
      const status = result?.status ?? 200;
      const body =
        typeof result?.body === 'string'
          ? result.body
          : JSON.stringify(result?.body ?? {});
      return route.fulfill({
        status,
        contentType: 'application/json',
        body,
      });
    }

    unmatched.push(`${method} ${request.url()}`);
    return route.abort();
  }

  return {
    get: (pattern, handler) => register('GET', pattern, handler),
    post: (pattern, handler) => register('POST', pattern, handler),
    put: (pattern, handler) => register('PUT', pattern, handler),
    delete: (pattern, handler) => register('DELETE', pattern, handler),
    install: (page) => page.route((url) => API_PATH.test(url.pathname), handle),
    unmatched,
  };
}

/**
 * Fulfils Google Fonts / Analytics requests with empty bodies so the suite is
 * hermetic and never depends on external network access.
 */
async function blockExternalRequests(page) {
  await page.route((url) => EXTERNAL_HOST.test(url.hostname), (route) => {
    const isCss =
      route.request().resourceType() === 'stylesheet' ||
      /css/.test(route.request().url());
    return route.fulfill({
      status: 200,
      contentType: isCss ? 'text/css' : 'text/plain',
      body: '',
    });
  });
}

/**
 * Disables CSS transitions/animations and hides blinking carets before the
 * application renders. The style element is injected on every full navigation
 * (and persists across client-side navigations).
 */
async function disableAnimations(page) {
  await page.addInitScript(() => {
    const apply = () => {
      if (!document.head || document.querySelector('style[data-visual-test]')) {
        return;
      }
      const style = document.createElement('style');
      style.setAttribute('data-visual-test', 'true');
      style.textContent =
        '*, *::before, *::after { ' +
        'animation: none !important; ' +
        'transition: none !important; ' +
        'caret-color: transparent !important; ' +
        '}';
      document.head.appendChild(style);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', apply, { once: true });
    } else {
      apply();
    }
  });
}

module.exports = {
  createMockRouter,
  blockExternalRequests,
  disableAnimations,
};
