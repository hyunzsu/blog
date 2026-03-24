# Slice: table-of-contents

**Layer**: `features`
**Segment layout**: `model/` (logic + types) · `ui/` (rendering)

---

## Layer Predicate — Why `features`?

> A **feature** slice encapsulates a **user-visible interaction** that is:
> 1. triggered by user or environment events (scroll, click, …),
> 2. self-contained (no other feature slices are composed inside it), and
> 3. domain-specific enough that it cannot meaningfully be re-used across
>    unrelated projects without modification.

`table-of-contents` satisfies all three:

| Criterion | Evidence |
|-----------|----------|
| **Scroll-reactive interaction** | `useActiveHeading` registers an `IntersectionObserver` that tracks which heading is currently in the viewport and drives the highlighted link state. The component responds to the user scrolling — it is not a static render. |
| **Self-contained** | No other feature slice is imported. The slice owns its own model (`extract-toc`, `use-active-heading`, `types`) and its own UI (`toc.tsx`). It receives `TocItem[]` as props and manages all interaction state internally. |
| **Domain-specific** | The slice is tightly coupled to blog-post heading structure (H2/H3 anchor IDs, `rootMargin` tuned for a sticky header, indent levels derived from markdown heading depth). These assumptions do not transfer to an arbitrary project. |

---

## Why NOT a `widget`?

Widgets compose **multiple feature slices** into a higher-order UI block
(e.g., a sidebar that combines search + recent-posts + ToC).
`table-of-contents` is a single, atomic interaction unit — it does not
orchestrate other features.

---

## Why NOT `shared/ui`?

`shared/` must be **zero-domain**: pure, project-agnostic utilities that could
be lifted into a standalone npm package without any blog-specific knowledge.
`table-of-contents` cannot meet that bar because:

- It assumes a DOM structure produced by MDX-rendered markdown headings.
- The `rootMargin: "-80px 0px -80% 0px"` offset is calibrated to the blog's
  fixed navigation bar height.
- `TocItem` and `extract-toc` encode the H2/H3 heading-depth convention of
  this specific content model.

Placing it in `shared/` would leak domain assumptions into the zero-domain
layer, violating the FSD layer predicate for `shared/`.

---

## Public API

Consumers import **only** through the slice barrel (`features/table-of-contents`):

```ts
import { TableOfContents } from '@/features/table-of-contents';
import type { TocItem } from '@/features/table-of-contents';
```

Internal segments (`model/`, `ui/`) are **not** part of the public surface and
must not be imported directly from outside this slice.

---

## Allowed Importers

| Layer | May import this slice? |
|-------|------------------------|
| `app/` | ✅ yes (page composition) |
| `features/` (other slices) | ❌ no (cross-slice feature import forbidden) |
| `entities/` | ❌ no (reverse direction) |
| `shared/` | ❌ no (reverse direction) |
