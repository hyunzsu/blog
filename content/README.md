# content/ — Ontological Charter

## What this directory is

`content/` holds **pure data**: MDX files that are the raw source of blog posts.

- Each `.mdx` file contains front-matter (title, date, description, tags) and Markdown/MDX body.
- Files carry **no behaviour** — no JavaScript logic, no imports of application modules, no side-effects.
- This directory is intentionally placed **outside `src/`** to make the data/code boundary explicit at the filesystem level.

## Directory structure

```
content/
└── posts/
    ├── dev/      # 개발 관련 글
    ├── life/     # 일상 관련 글
    └── essay/    # 에세이
```

## Consumption contract

MDX files in this directory are consumed **exclusively** through:

```
src/entities/post/api/   (data-access segment)
```

That segment uses Node.js `fs`/`path` at build time to read, parse (via `gray-matter`), and
convert raw MDX files into strongly-typed `Post` and `PostMeta` domain objects.

**No `features/` file, `app/` file, `shared/` file, or React component may import from
`content/` directly.** Any code that needs post data must go through the public API of the
`entities/post` slice:

```ts
// ✅ correct
import { getAllPosts, getPostBySlug } from '@/entities/post';

// ❌ forbidden — direct content import
import something from '../../content/posts/dev/hello-world.mdx';
```

## Why outside src/?

| Reason | Detail |
|--------|--------|
| **Separation of concerns** | Source code lives in `src/`; raw data lives in `content/`. The boundary is physically enforced by the directory layout. |
| **No circular risk** | MDX data files have no imports. Keeping them outside `src/` prevents accidental reverse imports. |
| **Deploy clarity** | Build pipelines and CDN rules can distinguish `src/` (compiled away) from `content/` (static assets consumed at build time). |
| **FSD compliance** | FSD layers (`app`, `features`, `entities`, `shared`) live inside `src/`. A data directory is not a layer and must not be co-located with them. |

## Enforcement

The ESLint boundary rules in `eslint.config.mjs` (via `eslint-plugin-boundaries`) restrict which
`src/` paths may read from `content/`. Only `src/entities/post/api/**` is allowed as a consumer.
Any other import path referencing `content/` is a boundary violation and will fail CI.
