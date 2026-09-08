# I18n string inventory

This inventory defines where current user-facing strings will move during the module-by-module migration. It covers visible copy, form labels and placeholders, notifications, dialogs, image alternative text, and accessibility labels.

| Namespace | Scope | Main sources |
| --- | --- | --- |
| `common` | Shared navigation, layout, landing page, profile, cookies, legal links, generic actions and accessibility labels | `App`, `Navbar`, `DashboardNavigation`, `MainContent`, `PublicFooter`, `CookieBanner`, `UserProfile`, `WelcomePopup`, `PageNotFound`, `LegalPage` |
| `auth` | Login/register dialogs, OAuth callback states and authentication-specific actions | `Login`, `Register`, `Popup`, `AuthCallbackHandler` |
| `products` | Product dashboards, search/sort, categories, cards, details, create/update/delete flows and empty states | `Dashboard`, `Categories`, `SortControl`, `ProductCard`, `ProductPopup`, `CreateProductPopup`, `DeleteModal`, `NoProductCard`, `Form` |
| `reviews` | Review list, rating labels, review form, validation and deletion confirmation | `ProductReviews`, `CreateReviewPopup` |
| `errors` | Reusable UI errors and mapping of backend/service errors to translation keys | `MissingFieldsPopup`, `UserMessage`, `Notification`, `src/utils/errorMessages.js`, `src/utils/errorHandler.js`, service and hook error states |

## Migration rules

- Keep interpolation values such as product names, colors, ratings and character counts out of translation keys.
- Translate `aria-label`, `alt`, `title`, placeholders and validation feedback together with visible text.
- Keep API identifiers, route segments, category values and sort values stable; only translate their displayed labels.
- Map backend errors to stable keys in `errors`; do not use raw server text as a translation key.
- Brand copy (`My Vanity’s`) lives in `common.appName` so every module reuses the same spelling.
- Files under `src/dev` and test fixtures are outside the production-string migration; tests should assert the translated output where relevant.
