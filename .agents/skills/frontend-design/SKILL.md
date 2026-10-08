---
name: frontend-design
description: >-
  Use this skill when creating, implementing, or reviewing MyVanitys UI where
  visual hierarchy, design tokens, responsive behavior, accessibility,
  interaction states, or brand consistency matter. Use it alone for standalone
  design work or alongside frontend-github-ticket-sdd for visual GitHub issues.
  Do not use it for frontend logic-only changes with no user-interface impact.
license: Complete terms in LICENSE.txt
---

# MyVanitys Frontend Design

Act as the steward of the MyVanitys visual system. The result must feel like part
of the existing application, not a generic beauty reinterpretation or a SaaS
template.

MyVanitys is a digital beauty collection: personal, clear, warm, and easy to
use. Its personality is optimistic and polished, but not luxurious, clinical,
or childish. The interface should convey the calm of an organized collection
and the pleasure of discovering products.

## Scope and pairing

This skill owns visual and interaction decisions and their frontend
implementation. Use it when work changes layout, styling, visual hierarchy,
responsive behavior, motion, interaction states, accessible presentation, or
brand voice.

When the work comes from a GitHub issue, use `frontend-github-ticket-sdd`
alongside this skill when available. That skill owns issue interpretation,
scope, SDD acceptance criteria, validation, and completion evidence; this skill
owns detailed design decisions. This skill must remain usable by itself for
standalone design creation or review.

Do not use it for service, state, data, build-tooling, test-only, or internal
refactoring work that leaves the rendered user experience unchanged.

## Sources of truth

Before designing or editing, inspect the nearest existing component and these
sources when relevant:

- `src/index.css`: global tokens, typography, spacing, radii, shadows, and
  layers.
- `src/components/MainContent/MainContent.css`: landing page, hero, and
  promotional sections.
- `src/components/Dashboard/Dashboard.css`, `ProductCard/ProductCard.css`, and
  `DashboardNavigation/DashboardNavigation.css`: authenticated application,
  cards, and responsive navigation.
- `src/components/CreateProductPopup/CreateProductPopup.css` and
  `Popup/Popup.css`: forms and dialogs.
- `src/locales/es/` and `src/locales/en/`: voice, vocabulary, and localization.
- `tests/e2e/visual/__screenshots__/`: visual reference for the real product.

If this guide and the current code differ, preserve the brand intent but treat
the current shared tokens and patterns as authoritative. Do not copy a local
inconsistency or legacy style when a modern equivalent already exists.

## Visual identity

### Color

Use the variables from `src/index.css`; do not duplicate their hexadecimal
values in new components.

- Main background: `--color-background` (`#fbf6f0`), a warm ivory that replaces
  white as the canvas.
- Surface: `--color-surface` (`#ffffff`) for cards, inputs, navigation, and
  elevated controls.
- Text: `--color-text` (`#2f2525`), a very dark brown; avoid pure black. Use
  `--color-text-muted` and `--color-text-subtle` for secondary hierarchy.
- Primary action: `--color-coral` (`#ff785f`) for primary calls to action and
  positive confirmations.
- Identity and selection: `--color-pink-strong` (`#fd7daa`) for active states,
  prominent links, counters, and collection-related actions. Use `--color-pink`
  and `--color-pink-soft` as supporting colors and soft backgrounds.
- Borders: `--color-border` and `--color-border-soft`; they should separate
  gently rather than draw heavy boxes.
- Feedback: `--color-success`, `--color-danger`, `--color-star`, and
  `--color-focus`; do not replace semantic states with coral or pink.

Pastels also encode product categories and must preserve their meaning:

- Face: peach (`--color-peach`).
- Eyes: lilac (`--color-lilac`).
- Eyelashes and lips: rose (`--color-rose`).
- Eyebrows: yellow (`--color-yellow`).
- Cream, serum, and toner: mint (`--color-mint`).

Mix these colors with white through `color-mix()` for chips and soft
backgrounds, following existing components. Never use color as the only signal;
pair it with text, an icon, a border, or an accessible state.

Avoid black-and-gold palettes, luxury-cosmetics styling, neon colors, strong
gradients, and new accent colors without a functional need. Permitted gradients
are subtle pastel transitions in large visual areas such as the hero or an
illustration; they are not default decoration for buttons or cards.

### Typography

Use only Montserrat, already loaded globally, with `sans-serif` as the fallback.
Do not introduce an editorial serif or another Google Font to "add personality":
the identity comes from Montserrat, color, and shape.

- Body text: 400–500.
- Labels, controls, and subtitles: 600–700.
- Brand, calls to action, categories, and short accents: 700–800.
- Headings: compact, with subtle negative letter spacing when large (`-.04em`
  to `-.055em`) and an approximate line height of `1.02` to `1.15`.
- Supporting text: use `--font-size-xs` and `--font-size-sm`; do not shrink
  interactive information until it becomes difficult to read.

Brand copy and headings use sentence case. Eyebrows and category chips may use
uppercase, weight 800, and moderate letter spacing because this is an existing
device, but do not repeat that treatment in every section. Keep paragraphs
comfortable, normally below 65–70 characters per line with a line height of
`1.6` to `1.75`.

### Shape, spacing, and depth

Build with the `--space-*` scale of 4, 8, 12, 16, 20, 24, and 32 px. Keep
generous space between blocks while maintaining practical density inside cards
and forms.

The geometry is soft:

- `--radius-sm` for fields and small elements.
- `--radius-md` for controls, menus, and images.
- `--radius-card` for cards.
- `--radius-dialog` for dialogs and panels.
- `--radius-pill` for calls to action, filters, chips, and selected navigation.

Do not apply the same radius to everything. Primary buttons and filters are
pills; cards and dialogs retain clearly rounded corners. Use the existing warm,
diffuse, low-opacity shadows. Primary hierarchy should come from spacing,
background, size, and color before shadow.

## Composition and components

### Layout

Prioritize one dominant action or message per screen. Application content
normally lives in a container up to `1220px`; the landing page reaches roughly
`1240px`. Left-align product flows, lists, and forms. Reserve centering for short
introductions, empty states, and promotional compositions.

The landing page combines large copy on the left with an organic pastel
illustration on the right. Illustrations are part of the brand language: warm,
clean, and related to makeup, skincare, organization, or discovery. Reuse
existing assets before creating new ones. Do not replace the illustration with
a fictional dashboard, a stock photo, or abstract blobs without meaning.

Product cards are white surfaces with a soft border, a light shadow, and a top
strip in the category color. Inside, the hierarchy is category, brand, product,
rating, and product or color representation. Preserve that grammar for new
product summaries.

### Actions and controls

- Primary call to action: coral background, white text, weight 700, and pill
  shape.
- Collection action or active state: strong pink or soft pink according to
  prominence.
- Secondary action: white or translucent surface, subtle border, and dark text.
- Destructive action: `--color-danger`; never coral.
- Inputs: white surface, subtle border, small or medium radius, and visible focus
  using `--color-focus`.
- Touch targets: at least 44 px; primary actions are usually 48–52 px tall.

Icons should be simple line icons consistent with `react-icons/fi`, unless the
existing component requires another family. Do not use emoji as product
iconography. Combine an icon with text when the action needs clarification;
avoid decorative icons without a function.

Dialogs use a translucent brown overlay with blur, a warm surface, and
`--shadow-dialog`. On mobile, long forms may behave like bottom sheets; on
desktop, center them and keep their width contained. The close action must be
visible, labeled for screen readers, and have a 44 px touch target.

## Product-responsive, not a reduced desktop layout

Design mobile-first and validate at least 320 px, around 480 px, 768 px, and a
wide desktop viewport.

- In the authenticated mobile experience, preserve the fixed bottom navigation
  with five destinations; "Add" is the elevated central action.
- From 768 px, navigation becomes a top bar, the brand appears, and items become
  horizontal controls.
- Grids move from one column to two at 768 px and to three near 1100 px when the
  content allows it.
- Dialogs occupy almost the full width on mobile and use a readable maximum
  width on desktop.
- Do not depend on hover. Preserve the same meaning and access through keyboard
  and touch.
- Respect safe areas for fixed controls and use `100dvh` when mobile viewport
  height matters.

## Motion and states

Motion is brief and functional. Use `--transition-fast` for hover and focus
feedback, small 1–2 px shifts, and shadow changes. Loading indicators may
rotate; openings and confirmations may animate when motion clarifies the change.
Respect `prefers-reduced-motion` whenever adding motion.

Always design empty, loading, error, disabled, selected, and success states.
Empty states should invite a concrete action; errors should explain what
happened and how to continue. Do not make a state depend only on opacity or
color.

## MyVanitys voice

Write from the perspective of someone organizing their collection. The tone is
warm, direct, and calm; it celebrates beauty without advertising exaggeration.

- Use concrete verbs: "Add product", "Explore products", "Save changes".
- Speak about "your vanity", "your collection", and "your products".
- Use sentence case, short sentences, and natural language.
- Empty states guide the user by explaining what they can do next.
- Errors do not blame the user or apologize vaguely; they explain the remedy.
- Preserve localized naming and established terminology. Use i18n and add the
  corresponding Spanish and English keys; never hardcode visible copy in JSX.

Do not invent claims about luxury, exclusivity, physical perfection, or sales
urgency. MyVanitys organizes, helps users remember, and supports discovery.

## Implementation

Before writing code, identify the nearest existing pattern and state a brief
direction: hierarchy, reusable component, tokens, and mobile/desktop behavior.
For a product extension, design within the system; propose a new visual pattern
only when the content does not fit an existing one.

When implementing:

- Reuse tokens and components before creating variants.
- Keep CSS next to its component and follow the existing BEM naming convention.
- Avoid arbitrary hexadecimal values, shadows, radii, and spacing when a token
  already exists.
- Do not convert an isolated component to Tailwind when its surroundings use
  component CSS.
- Preserve semantic HTML, labels, ARIA states, focus order, contrast, and
  visible focus.
- Check that general selectors do not override component modifiers or states.
- Do not change visual snapshots to hide a regression; update them only when
  the new design is intentional.

## Visual review

Review the rendered result on mobile and desktop when the environment permits.
Compare it with existing screenshots and correct at least:

- Montserrat consistency, weights, and scale;
- correct use of coral versus pink and category colors;
- alignment, spacing, radii, and shadows;
- navigation and dialogs at each breakpoint;
- focus, contrast, truncation, localized copy, and states;
- density: warm and approachable without becoming childish or overdecorated.

Before finishing, remove any decoration that does not improve hierarchy,
meaning, or clarity of action.
