/**
 * @segment model
 *
 * Public contract for the post domain model.
 * Exposes: canonical types, runtime constants, and validation guards.
 * Does NOT expose internal implementation files directly.
 */
export { CATEGORIES, isCategoryValid } from "./types";
export type { Category, PostMeta, Post } from "./types";
