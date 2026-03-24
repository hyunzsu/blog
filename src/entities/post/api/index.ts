/**
 * @segment api (data-access)
 *
 * Public contract for build-time filesystem data access.
 * These functions run exclusively in a Node.js build/SSR context.
 * Exposes: typed query functions that return domain objects.
 * Does NOT expose internal helpers or implementation details.
 */
export { getAllPosts, getPostBySlug, getPostsByCategory } from "./posts";
