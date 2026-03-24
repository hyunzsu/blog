/**
 * The exhaustive list of valid post categories for this blog.
 *
 * @ontology_decision SUBORDINATE_FIELD — Category is NOT an independent
 * entity slice (`src/entities/category/` was considered and rejected).
 *
 * **Why Category is a subordinate field of Post, not its own entity slice:**
 *
 * FSD entity slices are reserved for domain objects that have:
 *   (a) an independent lifecycle (can be created, read, updated, deleted
 *       independently of other entities), AND
 *   (b) their own model properties beyond being a discriminator on another entity.
 *
 * Category satisfies neither condition in this blog:
 *   - It is a **static, compile-time constant set** hardcoded here; there is
 *     no "create category" or "delete category" operation at runtime.
 *   - It carries **zero domain properties of its own** — no description, no
 *     cover image, no post count stored independently. It is purely a string
 *     discriminator that classifies a Post.
 *   - Every access to a Category value is always via `PostMeta.category`;
 *     there is no code path that loads a Category in isolation.
 *   - Adding a new category requires both updating this array AND creating a
 *     matching `content/posts/<category>/` directory — the filesystem coupling
 *     means the lifecycle is inseparable from the Post content pipeline.
 *
 * **Consequence:** All Category-related code (type, guard, constants) lives
 * inside `entities/post/model/` as part of the Post model. If the blog ever
 * adds per-category metadata (description, cover, etc.) fetched independently,
 * that is the trigger to promote Category to its own entity slice.
 */
export const CATEGORIES = ["dev", "life", "essay"] as const;

/**
 * Category represents the canonical post classification string used across
 * multiple system boundaries. A single value such as `"dev"` simultaneously
 * serves four distinct roles:
 *
 * 1. **TypeScript union type** – statically narrows string to the known set
 *    `"dev" | "life" | "essay"`, preventing invalid values at compile time.
 *
 * 2. **URL path segment** – appears as the third segment in the canonical
 *    post URL `/posts/<category>/<slug>` (e.g. `/posts/dev/my-post`).
 *    Changing a value here is a **breaking URL change**.
 *
 * 3. **Filesystem directory name** – maps 1-to-1 to a subdirectory under
 *    `content/posts/` (e.g. `content/posts/dev/`). Adding a new category
 *    requires creating the matching directory and updating this constant.
 *
 * 4. **Query parameter value** – passed as the `category` query param on the
 *    post listing page `/posts?category=<category>` (e.g. `/posts?category=dev`).
 *    The value is validated at runtime via {@link isCategoryValid} before use.
 *
 * @see CATEGORIES – the exhaustive `as const` array that drives this type.
 * @see isCategoryValid – runtime guard for external / untrusted inputs.
 */
export type Category = (typeof CATEGORIES)[number];

export interface PostMeta {
  title: string;
  date: string;
  category: Category;
  slug: string;
  description?: string;
  tags?: string[];
}

export interface Post {
  meta: PostMeta;
  content: string;
}

export function isCategoryValid(value: unknown): value is Category {
  return (
    typeof value === "string" &&
    (CATEGORIES as ReadonlyArray<string>).includes(value)
  );
}
