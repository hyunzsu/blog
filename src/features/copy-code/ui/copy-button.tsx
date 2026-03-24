/**
 * @placement_justification IS_FEATURE_UI
 *
 * Why IS_FEATURE_UI applies here:
 *   IS_FEATURE_UI positiveTest: "Does this component use a feature hook
 *   (IS_FEATURE_LOGIC) to deliver an interactive user-facing capability?"
 *
 *   Answer: YES.
 *   - This component consumes `useCopyToClipboard` (IS_FEATURE_LOGIC) to wire
 *     the clipboard side effect to a visible button in the UI.
 *   - It renders interactive feedback (a "Copied!" label) that is ONLY possible
 *     because of the `copied` state produced by the feature hook.
 *   - Clicking the button triggers `copy(code)` — a user-initiated side effect
 *     that writes to the OS clipboard (observable beyond the React tree).
 *   - The component satisfies FEATURES_PREDICATE: it implements a user-facing
 *     capability with observable side effects driven by user interaction.
 *
 * Falsifying conditions checked and cleared:
 *   ✅ HAS user-facing behavior — renders a clickable copy action
 *   ✅ IS NOT purely a type definition
 *   ✅ DOES render into the UI and communicate the copy result via `copied` state
 *   ✅ Does NOT import from app/**
 *
 * Why NOT entities/post/ui:
 *   IS_ENTITY_UI requires that the component "receives domain props and renders
 *   them WITHOUT registering user-event handlers." This component registers
 *   an onClick handler and owns interactive state — it fails IS_ENTITY_UI.
 *
 * Why NOT shared/ui:
 *   IS_SHARED_UI requires zero-domain, zero-interaction primitives. This
 *   component holds a feature hook (`useCopyToClipboard`) — it fails
 *   SHARED_PREDICATE's positiveTest.
 *
 * @see {@link IS_FEATURE_UI}       — segment predicate constant (shared/config/fsd-rules.ts)
 * @see {@link FEATURES_PREDICATE}  — layer predicate (shared/config/fsd-rules.ts)
 * @layer features
 * @slice copy-code
 */
"use client";

import { useCopyToClipboard } from "../model";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CopyButtonProps {
  /** The code string to copy to the clipboard when the button is clicked. */
  code: string;
  /** Additional Tailwind class names applied to the root button element. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * A "Copy code" button that wires `useCopyToClipboard` to a visible UI control.
 *
 * Renders a small button in the top-right corner of a code block. On click it
 * writes `code` to the OS clipboard via the Clipboard API and shows a transient
 * "Copied!" confirmation label for 2 seconds.
 *
 * @example
 * <div className="relative">
 *   <pre><code>{codeString}</code></pre>
 *   <CopyButton code={codeString} className="absolute right-2 top-2" />
 * </div>
 */
export function CopyButton({ code, className = "" }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={() => void copy(code)}
      aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors
        ${copied
          ? "bg-neutral-900 text-white"
          : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700"
        } ${className}`.trim()}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
