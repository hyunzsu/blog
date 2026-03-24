/**
 * @slice entities/post — public API
 *
 * This is the ONLY import boundary consumers should cross.
 * Upper layers (features, app) must import exclusively from "@/entities/post".
 * Cross-segment imports (e.g. "@/entities/post/model/types") are forbidden.
 *
 * ─── Domain model ────────────────────────────────────────────────────────────
 * CATEGORIES    — exhaustive tuple of valid category strings
 * Category      — "dev" | "life" | "essay" (derived from CATEGORIES)
 * PostMeta      — frontmatter fields (title, date, category, slug, …)
 * Post          — PostMeta + raw MDX content string
 * isCategoryValid — runtime type-guard for untrusted category inputs
 *
 * ─── Data access (SSR / build-time only) ─────────────────────────────────────
 * getAllPosts        — returns all PostMeta sorted newest-first
 * getPostBySlug     — returns a single Post or null
 * getPostsByCategory — returns PostMeta filtered by category
 *
 * ─── UI components ───────────────────────────────────────────────────────────
 * PostListItem — renders a single post row in a listing
 */

// Model
export { CATEGORIES, isCategoryValid } from "./model";
export type { Category, PostMeta, Post } from "./model";

// Data access
export { getAllPosts, getPostBySlug, getPostsByCategory } from "./api";

// UI
export { PostListItem } from "./ui";
