# FSD Layer Placement Predicates

This document defines the **responsibility model** for Feature-Sliced Design (FSD)
in the hyunzsu blog codebase. Every file must satisfy exactly one layer's predicate.
If a file satisfies zero or more than one predicate, it is misplaced and must be moved.

> **Rule of thumb**: A predicate is a falsifiable Boolean test.
> Ask the predicate question about a candidate file — if the answer is **yes**,
> the file belongs there. If **no**, keep checking the next layer.

---

## Layer Stack (top → bottom; reverse imports are forbidden)

```
app        — Next.js route/layout orchestration
features   — user-facing interactive behavior with side effects
entities   — stateless domain objects + data access (no user interaction)
shared     — zero-domain pure utilities
```

**Forbidden direction**: `shared` may NOT import `entities`; `entities` may NOT import
`features`; `features` may NOT import `app`. Violations are enforced by
`eslint-plugin-boundaries` (see `eslint.config.mjs`).

---

## Layer Predicates

### 1. `shared`

> **Predicate**: The module is a pure, domain-agnostic utility or UI primitive that
> contains **no reference to `Post`, `Category`, or any other domain concept** defined
> in `entities/` or `features/`.

**Falsifying conditions** — a file fails this predicate if it:

- imports from `entities/**` or `features/**`
- contains the string `Post`, `Category`, `post`, `category` in a semantic role
  (type name, variable name, or logic) rather than as a generic string
- encodes business rules about the blog domain

**Correct examples**

| File | Why it belongs in `shared` |
|------|---------------------------|
| `shared/lib/format-date.ts` | Pure date formatter — no domain knowledge |
| `shared/config/site.ts` | Static site-wide constants (title, author URL) |
| `shared/config/mdx.ts` | MDX remark/rehype plugin configuration |
| `shared/ui/header.tsx` | Generic navigation shell — no post data |
| `shared/ui/footer.tsx` | Generic footer — no post data |
| `shared/ui/mdx-content.tsx` | Generic MDX renderer — receives `content: string` |

**Incorrect examples (anti-patterns)**

| File | Why it does NOT belong in `shared` |
|------|-----------------------------------|
| ~~`shared/lib/posts.ts`~~ | Contained `getAllPosts()` — domain data access ❌ |
| ~~`shared/ui/toc.tsx`~~ | Contained `IntersectionObserver` logic tied to heading IDs ❌ |

---

### 2. `entities`

> **Predicate**: The module defines **domain types** (data shapes) or **data-access
> functions** for those types, and contains **no user-interaction logic** (no React
> event handlers, no `useState`/`useEffect` tied to UI events, no `"use client"`
> directive for interactivity purposes).

**Falsifying conditions** — a file fails this predicate if it:

- registers a user event handler (`onClick`, `onChange`, `onSubmit`, …)
- owns a side-effect that is triggered by user action (form submission, navigation,
  comment posting, …)
- uses `useState` / `useReducer` / `useEffect` for *interactive* UI state
  (reading server data into a client component for display is allowed)
- imports from `features/**`

**Correct examples**

| File | Why it belongs in `entities` |
|------|------------------------------|
| `entities/post/model/types.ts` | Pure TypeScript interfaces: `Post`, `PostMeta`, `Category` |
| `entities/post/api/posts.ts` | FS/gray-matter data access — no UI, no interactivity |
| `entities/post/ui/post-list-item.tsx` | Presentational component — receives props, no side effects |

**Note on the `api` segment** — see the dedicated section below.

---

### 3. `features`

> **Predicate**: The module produces a **user-observable behavioral change** in
> response to **user input or an environmental signal**, regardless of whether a
> state mutation occurs.
>
> Formally: `features = code that produces a user-observable behavioral change in
> response to user input or environmental signal, regardless of whether state
> mutation occurs; qualifying behaviors include scroll-reactive UI,
> URL-parameter-driven filtering, and external widget integration; disqualifying
> pattern: pure rendering of static data with no behavioral response to input.`
>
> **Read-path behaviors qualify**: a module does not need to write state to belong
> in `features`. Responding to a URL query parameter (`?category=dev`) to filter
> a post list is a behavioral response to user input even though it involves only
> reads. Observing scroll position to highlight a TOC entry is a behavioral
> response to an environmental signal even though no data is mutated.

**Qualifying signal categories**

| Signal type | Example in this codebase | State mutation required? |
|-------------|--------------------------|--------------------------|
| Direct user interaction | Button click (copy-code) | Yes (clipboard) |
| Environmental signal | Scroll position (TOC highlight) | No — read-only DOM query |
| URL / navigation input | `?category=` filter on `/posts` | No — SSR read of search params |
| Third-party lifecycle | Giscus widget mount | No — external JS injection |

**Falsifying conditions** — a file fails this predicate if it:

- has **no behavioral response** to any input or signal
  (pure rendering of static data → belongs in `entities/ui` or `shared/ui`)
- is purely a type definition with no runtime logic (→ `entities/model`)
- does not ultimately render into or communicate with the UI
- the only "behavior" is unconditional rendering regardless of any input
  (use the sniff test: *"could the output ever differ based on what the user
  does or what the environment reports?"* — if **no**, it is not a feature)

**Correct examples**

| File | Why it belongs in `features` | Signal type |
|------|------------------------------|-------------|
| `features/table-of-contents/model/use-active-heading.ts` | `IntersectionObserver` — scroll-tracking side effect | Environmental signal |
| `features/table-of-contents/model/extract-toc.ts` | Parses MDX AST to produce display-ready TOC items consumed by the TOC UI | Supporting logic for feature UI |
| `features/table-of-contents/ui/toc.tsx` | Renders TOC with active-heading highlight that changes on scroll | Environmental signal |
| `features/comments/ui/giscus-comments.tsx` | Embeds Giscus — third-party interactive widget | Third-party lifecycle |
| `features/copy-code/model/use-copy-to-clipboard.ts` | Writes to clipboard on user click | Direct user interaction |

**Incorrect examples (anti-patterns)**

| File | Why it does NOT belong in `features` |
|------|--------------------------------------|
| A component that always renders the same post title | No behavioral response to any input — belongs in `entities/ui` |
| A pure date formatter | No domain behavior, no signal response — belongs in `shared/lib` |

---

### 4. `app`

> **Predicate**: The module is a **Next.js App Router entry point**: a page, layout,
> route handler, metadata export, or OG image generator.  It orchestrates slices from
> lower layers but contains **no reusable business logic**.

**Falsifying conditions** — a file fails this predicate if it:

- contains logic that could be reused across more than one route (extract to
  `features` or `entities`)
- is a pure UI component with no routing concerns (extract to `entities/ui` or
  `features/ui`)

---

## Segment Annotations

### The `api` Segment in `entities/post`

**Ambiguity**: In FSD, "api" can mean two different things:
1. **Public interface** — the slice's external API surface (barrel exports)
2. **Data access** — server-side I/O: filesystem reads, HTTP calls, database queries

In this codebase the `entities/post/api/` segment uses meaning **2** (data access).

**Canonical annotation**:

```
entities/post/api/   ← data-access segment
                        Role: server-side filesystem reads via Node `fs` + gray-matter
                        NOT a public-interface re-export barrel
                        Consumed only through entities/post/index.ts (the slice barrel)
```

**Rule**: `entities/post/api/` may import from:
- `node:fs`, `node:path` (Node built-ins)
- `gray-matter`, `unified`, and other pure data-parsing libraries
- `entities/post/model/` (domain types)

It must NOT import from `features/**`, `app/**`, or any UI library.

---

## `content/` Ontological Charter

```
content/
└── posts/
    └── {dev,life,essay}/
        └── *.mdx          ← pure data files
```

**Charter rules**:

1. **Pure data, no behavior**: `content/` contains only MDX files (frontmatter +
   Markdown body). No TypeScript, no JavaScript, no executable logic.

2. **No direct imports**: Application code never does `import '../../content/posts/...'`.
   All access to `content/` is mediated exclusively through
   `entities/post/api/posts.ts`, which uses `fs.readFileSync` with `process.cwd()`.

3. **Accessed only via the entities layer**: The `content/` directory is the
   *persistence layer* for blog posts. The only legitimate reader is
   `entities/post/api/`. Features and app layers receive post data as typed
   TypeScript objects (`Post`, `PostMeta`), never as raw file paths or strings.

4. **Category subdirectories are canonical**: The three subdirectories
   `dev/`, `life/`, and `essay/` correspond 1-to-1 with the `Category` union type
   in `entities/post/model/types.ts`. Adding a new category requires updating both
   the filesystem structure and the `CATEGORIES` constant.

---

## Slice Barrel Export Contract

Each slice exposes a **public API surface** through its `index.ts` barrel.

**Rule**: A slice barrel (`entities/post/index.ts`, `features/table-of-contents/index.ts`,
etc.) must export **only** the symbols intended for consumption by higher layers.
It must NOT re-export internal segment implementation details.

```
✅ Correct — public API only
// entities/post/index.ts
export type { Post, PostMeta, Category } from "./model";
export { CATEGORIES, isCategoryValid } from "./model";
export { getAllPosts, getPostBySlug, getPostsByCategory } from "./api";
export { PostListItem } from "./ui";

❌ Incorrect — internal segment barrel leaked
// entities/post/index.ts
export * from "./model/types";        // leaks internal segment path
export * from "./api/posts";          // leaks internal segment path
```

**Segment barrels** (`entities/post/model/index.ts`, etc.) aggregate symbols
within a segment for internal use. They are an implementation detail of the slice
and must not be imported directly from outside the slice.

---

## Decision Tree: Where Does a New File Go?

```
Is it a Next.js page, layout, route handler, or OG image?
  └─ YES → app/

Does it produce a user-observable behavioral change in response to user input or
an environmental signal (scroll, URL params, third-party widget lifecycle, etc.),
even if no state mutation occurs?
  └─ YES → features/{slice}/

Does it define domain types (Post, Category) or read blog data from content/?
  └─ YES → entities/post/{model|api|ui}/

Is it a pure utility or UI primitive with zero domain knowledge?
  └─ YES → shared/{lib|ui|config}/

None of the above?
  └─ STOP — the file's responsibility is ambiguous. Clarify before creating it.
```

---

## Named Segment Predicates (`@placement_justification` Tags)

Each file should include a `@placement_justification` JSDoc tag citing one of the
named constants defined in `src/shared/config/fsd-rules.ts`. This eliminates placement
ambiguity for future developers and automated tooling.

### Usage pattern

```ts
/**
 * @placement_justification IS_ENTITY_MODEL — defines the canonical Post domain type
 */
export interface Post { ... }
```

### Available constants

| Constant | Layer | Segment | Positive test (one-liner) |
|----------|-------|---------|--------------------------|
| `IS_SHARED_UI` | `shared` | `ui` | Generic React primitive with no domain type references |
| `IS_SHARED_LIB` | `shared` | `lib` | Pure function copy-pasteable into any TS project |
| `IS_SHARED_CONFIG` | `shared` | `config` | Compile-time constants / pure config objects |
| `IS_ENTITY_MODEL` | `entities` | `model` | Canonical domain type definition, no I/O |
| `IS_ENTITY_DATA_ACCESS` | `entities` | `api` | Server-side data read returning typed domain objects |
| `IS_ENTITY_UI` | `entities` | `ui` | Presentational component receiving domain props, no event handlers |
| `IS_FEATURE_LOGIC` | `features` | `model` | Custom hook owning observable browser side effects |
| `IS_FEATURE_UI` | `features` | `ui` | Interactive component wiring feature hook to user output |
| `IS_APP_ROUTE` | `app` | `route` | Next.js App Router entry point (page/layout/route handler) |

**Validation**: A CI script can verify every non-trivial source file cites a known predicate:

```ts
import { PLACEMENT_PREDICATES } from "@/shared/config";
const cited = comment.match(/@placement_justification\s+(\w+)/)?.[1];
const valid = cited !== undefined && cited in PLACEMENT_PREDICATES;
```

---

## Quick-Reference Table

| Layer | Segment | Allowed imports | Forbidden imports |
|-------|---------|-----------------|-------------------|
| `shared` | `lib`, `ui`, `config` | Node built-ins, npm packages, `shared/**` | `entities/**`, `features/**`, `app/**` |
| `entities` | `model`, `api`, `ui` | `shared/**`, `entities/{same-slice}/**` | `features/**`, `app/**` |
| `features` | `model`, `ui` | `shared/**`, `entities/**`, `features/{same-slice}/**` | `app/**` |
| `app` | *(route segments)* | `shared/**`, `entities/**`, `features/**`, `app/**` | *(none within project)* |

> **Cross-slice isolation (intra-layer rule)**: Cross-slice imports within the same
> layer (e.g., `features/toc` importing `features/comments`, or `entities/post`
> importing `entities/category`) are **forbidden**. Each slice must be independently
> usable without importing sibling slices in the same layer. This rule is enforced by
> `eslint-plugin-boundaries` in `eslint.config.mjs` (see the `no-cross-slice-same-layer`
> boundary rule) and is a first-class constraint in this ontology. If two slices need
> shared logic, that logic must be extracted to the layer below (e.g., `shared/`) or
> lifted to the layer above (e.g., `app/`).
