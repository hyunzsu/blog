// Segment barrel — model segment public API.
// Consumed only by features/copy-code/ui/ and features/copy-code/index.ts.
// Do NOT import this path from outside the copy-code slice; use the slice
// barrel (features/copy-code/index.ts) instead.
export { useCopyToClipboard } from "./use-copy-to-clipboard";
export type { UseCopyToClipboardResult } from "./use-copy-to-clipboard";
