---
name: frontend-github-ticket-sdd
description: >-
  Use this skill when implementing or verifying frontend work from a GitHub
  issue. Own the SDD specification, scope, implementation, tests, and acceptance
  evidence. For tickets with meaningful visual or interaction changes, use
  frontend-design alongside this skill. Do not use it for backend-only issues or
  standalone design work without a ticket.
---

# Frontend GitHub Ticket SDD

Deliver the smallest maintainable frontend change that satisfies the issue and
can be proven complete. Treat completion as an evidence claim, not as an
impression that the code looks finished.

## Portability and authority

- Use whichever GitHub interface and repository tools are available. Do not
  require a particular LLM, agent product, IDE, browser tool, or GitHub CLI.
- Read the complete issue body, comments, labels, linked pull requests, design
  references, and attachments when access is available. If only pasted issue
  text is available, state that limitation and work from that text.
- Do not post comments, change labels, close the issue, push commits, or open a
  pull request unless the user requested that external mutation.
- Follow direct user instructions and all applicable repository instruction
  files. Use memory files as historical context, not as authority over current
  code, tests, or the issue.
- Surface a material conflict instead of silently choosing one interpretation.

## Skill boundary

This skill owns the ticket lifecycle: issue interpretation, specification,
implementation, validation, and completion evidence. It remains independently
usable when `frontend-design` is unavailable.

Use `frontend-design` alongside this skill when the ticket materially changes
rendered layout, visual hierarchy, design tokens, responsive behavior,
interaction states, motion, accessibility presentation, or user-facing copy.
The design skill owns the detailed visual and brand decisions; this skill still
owns scope, code integration, tests, and proof that the ticket is complete.

Do not load `frontend-design` for logic-only service, state, data transformation,
test, build-tooling, or internal refactoring work whose rendered behavior is
unchanged.

## Progress checklist

- [ ] Load repository instructions and durable memory
- [ ] Capture the issue and its evidence
- [ ] Write a task-specific specification
- [ ] Inspect the affected frontend flow
- [ ] Implement the focused change
- [ ] Run the validation loop
- [ ] Prove every acceptance criterion
- [ ] Update durable documentation only when warranted

## 1. Establish the working context

Before planning or editing:

1. Identify the repository root, frontend package, current branch, base branch
   when known, and working-tree state. Preserve unrelated user changes.
2. Search case-insensitively for applicable `AGENTS.md`, `AGENT.md`, and
   `MEMORY.md` files in the repository root, the frontend package, ancestor
   directories, and conventional project folders such as `.agents/` or `.ai/`. Read the
   applicable files completely.
3. Treat `AGENTS.md` or `AGENT.md` as working rules. Treat `MEMORY.md` as
   potentially stale context and confirm important statements against the
   current source, configuration, and tests.
4. Read only the architecture, design-system, localization, accessibility, and
   test documentation relevant to the issue. Derive commands from the current
   package configuration rather than assuming framework defaults.

## 2. Turn the issue into an executable specification

Do not implement from the title alone. Extract observable requirements from the
issue and its linked evidence. Distinguish explicit requirements from inferred
behavior and optional polish.

Create this compact specification in the working notes or in the repository's
established spec location. Do not add a permanent spec file solely for process
ceremony.

```markdown
## Ticket specification: <owner/repo>#<number>

### Goal
<User-visible or developer-visible outcome>

### Evidence and current behavior
- <Issue statement, reproduction, screenshot, code, or test evidence>

### Scope
- In: <required frontend behavior>
- Out: <explicit exclusions and adjacent backend work>

### Acceptance criteria
- AC1 — Given <state>, when <action>, then <observable result>.
- AC2 — ...

### UI contract (only when visual or interactive)
- Viewports/states: <mobile, desktop, loading, empty, error, disabled, etc.>
- Interaction/accessibility: <keyboard, focus, semantics, labels, feedback>
- Design evidence: <reference, tokens, component pattern, or stated assumption>

### Constraints and assumptions
- <Repository rule, compatibility constraint, or explicit assumption>

### Verification matrix
- AC1 -> <test or inspection that will prove it>
- AC2 -> <test or inspection that will prove it>
```

Ask for clarification only when an unresolved ambiguity would materially change
behavior, design, data contracts, or scope. Otherwise choose the least invasive
interpretation and record the assumption.

For a mixed frontend/backend issue, specify the frontend boundary. Do not modify
an API contract or backend merely to make the frontend change convenient unless
that work is explicitly in scope.

## 3. Inspect before changing code

Trace the narrow end-to-end path involved in each acceptance criterion:

- route or entry point;
- component and styling layer;
- local or shared state;
- hooks, services, adapters, and API boundary;
- translations and accessible names;
- existing unit, component, integration, end-to-end, and visual tests;
- relevant version-control history when intent is unclear.

Reproduce the defect or establish the missing behavior when practical. For a
regression, add a failing automated test first when the behavior is deterministic
and the repository has an appropriate test layer. Do not force test-first work
for purely visual judgment that is better verified by rendering and screenshots.

## 4. Implement the smallest coherent change

- Follow existing component, state, service, styling, and test patterns. Avoid
  unrelated cleanup and speculative abstractions.
- Reuse the design system and existing interaction patterns before introducing
  new primitives.
- Cover applicable loading, empty, success, error, disabled, and retry states.
- Keep user-visible text, validation feedback, alternative text, titles, and
  accessibility labels in the repository's localization system.
- Preserve keyboard operation, focus behavior, semantic structure, and useful
  screen-reader names for changed interactions.
- Keep responsive behavior intentional at the viewports supported by the
  project. Avoid fixing one viewport by breaking another.
- Request user approval before changes that local instructions reserve for
  approval, such as new dependencies, environment variables, persisted data,
  authentication behavior, or API contracts.

## MyVanitys Web invariants

When working in this repository, apply these project-specific rules in addition
to the ticket:

- Read `.agents/AGENTS.md` and `.agents/MEMORY.md` before planning.
- Keep HTTP access in `src/services`, data-fetching behavior in `src/hooks`, and
  shared auth, product, and UI state in the existing context patterns.
- Send API calls through the existing adapters and route failures through
  `ErrorHandler`; never display raw server errors or silently swallow failures.
- Preserve `localStorage.vanitys_auth` as `{ token, user, expiresAt }`. Session
  expiry may clear authentication data, not unrelated browser storage.
- Preserve the `/callback` Google OAuth flow and its `login` and `register`
  state values unless the issue explicitly changes that contract.
- Route every user-facing string through i18next while keeping API identifiers,
  routes, category values, and sort values language-neutral.
- Verify intentional UI changes against the Playwright desktop and mobile
  visual suite. Never regenerate baselines merely to make a failing test pass.

## 5. Validate in a repair loop

Choose checks from the verification matrix and the repository's actual scripts.
Run the narrowest relevant checks early, then broader checks proportional to the
change.

For MyVanitys Web, the usual escalation is:

1. A targeted Vitest file or the closest relevant unit/component tests.
2. `npm test` when the change can affect multiple modules.
3. `npx eslint .` for changed JavaScript or JSX.
4. `npm run build` when production behavior or bundling may be affected.
5. `npm run test:e2e:visual` for visible layout, copy, responsive, dialog, or
   interaction changes.

For visual work, inspect the rendered result at representative desktop and
mobile sizes and compare it with the issue's design evidence. Exercise relevant
states, not only the default happy path. If a baseline must change, inspect the
image diff and confirm that every changed region is intentional before updating
it.

When a check fails, determine whether the cause is the patch, pre-existing code,
or the environment. Fix in-scope defects and rerun the failed check. Record
commands that could not run and their exact limitation. An unrun or failing
required check is not passing evidence.

Before declaring completion, inspect the final diff and working-tree state for
scope creep, accidental generated files, debugging code, secrets, and unrelated
changes.

## 6. Completion gate

Mark the ticket implementation `complete` only when all of the following are
true:

- Every acceptance criterion maps to concrete passing evidence.
- Required behavior is implemented without known in-scope defects.
- Relevant automated checks pass, and required visual or manual checks were
  actually performed.
- The final diff respects repository instructions and contains no unintended
  changes.
- Any limitation, assumption, or residual risk is disclosed.

Use `partial` when useful work is finished but a criterion or required check is
unverified. Use `blocked` when progress needs missing access, a material product
decision, or an external dependency. Never weaken acceptance criteria, delete a
meaningful test, suppress an error, or update snapshots solely to claim success.

## 7. Maintain AGENT and MEMORY files deliberately

- Do not edit instruction or memory files as a routine ticket log.
- Add or revise an `AGENTS.md` or `AGENT.md` rule only when the work reveals a
  durable project-wide constraint and the repository's conventions allow the
  edit.
- Update `MEMORY.md` only for durable current state, decisions and rationale,
  reusable lessons, or genuine next steps. Remove stale entries when confirmed.
- Never store secrets, tokens, personal data, transient command output, commit
  history, or a play-by-play of the ticket in memory.

## Completion report

Return a concise evidence report:

```markdown
Status: complete | partial | blocked
Ticket: <owner/repo>#<number or supplied reference>

Implemented
- <observable change>

Acceptance evidence
- AC1: PASS | FAIL | UNVERIFIED — <test, screenshot, or inspection evidence>
- AC2: PASS | FAIL | UNVERIFIED — <evidence>

Validation
- `<command or manual check>` — PASS | FAIL | NOT RUN (<reason>)

Files and durable context
- <important changed files>
- AGENT/MEMORY: <updated with durable reason | no durable update needed>

Remaining risks or follow-ups
- <none, or explicit item>

GitHub actions
- <none, or actions explicitly requested and performed>
```
