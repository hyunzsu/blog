/**
 * features/copy-code — public slice barrel
 *
 * Exports ONLY the public API surface of the copy-code slice.
 * Internal segment paths (model/, ui/) must not be imported directly
 * from outside this slice — always import from this barrel.
 *
 * Layer: features
 * Predicate: FEATURES_PREDICATE — implements an interactive copy-to-clipboard
 *            user capability with observable browser side effects.
 *
 * @see {@link FEATURES_PREDICATE}  — layer predicate (shared/config/fsd-rules.ts)
 */

// ── Public hook ──────────────────────────────────────────────────────────────
export { useCopyToClipboard } from "./model";
export type { UseCopyToClipboardResult } from "./model";

// ── Public UI ────────────────────────────────────────────────────────────────
export { CopyButton } from "./ui";
