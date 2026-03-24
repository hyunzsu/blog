# Segment: `api` (data-access)

## Why "api" is a misnomer here

In FSD, the `api` segment conventionally means **the public interface** a slice exposes to
higher layers, or sometimes a thin network-request layer.
In this slice the name was inherited from an older convention and has **neither of those meanings**.

## What this segment actually is

`api` here is a **build-time filesystem data-access layer**:

- Reads `.mdx` files from `content/posts/` using Node.js `fs` / `path`
- Parses front-matter with `gray-matter`
- Returns strongly-typed domain objects (`Post`, `PostMeta`) defined in `../model`
- Runs **only** in a Node.js context (Next.js SSR / static generation) — never in the browser

## Preferred future name

If this directory is ever refactored, rename it to **`data-access`** so the intent is
self-evident and the FSD `api`-segment ambiguity is eliminated entirely.

## Access rules

| Caller layer | May import? | Notes |
|---|---|---|
| `entities/post` (own slice) | ✅ | via `../api` |
| `features/*` | ✅ | via `@/entities/post` barrel only |
| `app/*` | ✅ | via `@/entities/post` barrel only |
| Client Components | ❌ | `fs` is Node-only; will throw at runtime |
| `shared/*` | ❌ | shared must not depend on entities |
