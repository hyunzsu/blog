/**
 * @placement_justification IS_FEATURE_LOGIC
 *
 * Why IS_FEATURE_LOGIC applies here:
 *   IS_FEATURE_LOGIC positiveTest: "Does this file implement a custom hook or
 *   utility function that owns observable side effects driven by user interaction
 *   or browser lifecycle events?"
 *
 *   Answer: YES.
 *   - `useCopyToClipboard` wraps `navigator.clipboard.writeText`, which is a
 *     browser side-effecting API — it writes to the OS clipboard and changes
 *     observable state (the system clipboard contents).
 *   - The copy is triggered by user interaction (onClick on the copy button).
 *   - The hook owns transient `copied` state (via `useState` + `setTimeout`)
 *     that drives visual feedback to the user — this is interactive UI state.
 *   - The `setTimeout` cleanup in `useEffect` is a lifecycle side effect needed
 *     to reset the copied indicator after a delay.
 *
 * Falsifying conditions checked and cleared:
 *   ✅ IS NOT a pure function — owns `useState` + `useEffect` side effects
 *   ✅ Side effects are triggered by USER ACTION (clipboard write on button click)
 *   ✅ Renders feedback visible to the user (the `copied` boolean)
 *   ✅ Does NOT import from features/{other-slices}/** or app/**
 *
 * Why NOT shared/lib:
 *   IS_SHARED_LIB requires a "pure function copy-pasteable into any TS project".
 *   This hook carries React state and browser lifecycle dependencies — it fails
 *   the purity requirement.
 *
 * @see {@link IS_FEATURE_LOGIC}    — segment predicate constant (shared/config/fsd-rules.ts)
 * @see {@link FEATURES_PREDICATE}  — layer predicate (shared/config/fsd-rules.ts)
 * @layer features
 * @slice copy-code
 */
"use client";

import { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseCopyToClipboardResult {
  /** Whether the text was successfully copied in the current feedback window. */
  copied: boolean;
  /**
   * Trigger a clipboard write.
   * Resolves to `true` on success, `false` if the Clipboard API is unavailable
   * or the user denied permission.
   */
  copy: (text: string) => Promise<boolean>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Custom hook that writes text to the OS clipboard and exposes transient
 * visual-feedback state (`copied`) that resets after `resetDelay` ms.
 *
 * Side effects owned:
 * 1. `navigator.clipboard.writeText` — OS clipboard write (user-triggered)
 * 2. `useState` — tracks `copied` boolean for UI feedback
 * 3. `useEffect` + `setTimeout` — resets `copied` after the delay window
 *
 * @param resetDelay - Milliseconds before `copied` resets to `false`. Default: 2000.
 *
 * @example
 * const { copied, copy } = useCopyToClipboard();
 * // In an onClick handler:
 * await copy(codeString);
 */
export function useCopyToClipboard(resetDelay = 2000): UseCopyToClipboardResult {
  const [copied, setCopied] = useState(false);

  // Reset `copied` back to false after the delay window.
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), resetDelay);
    return () => clearTimeout(timer);
  }, [copied, resetDelay]);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      // Clipboard API unavailable (HTTP or very old browser).
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      return true;
    } catch {
      setCopied(false);
      return false;
    }
  }, []);

  return { copied, copy };
}
