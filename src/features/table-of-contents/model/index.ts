/**
 * Public model API for the table-of-contents feature.
 *
 * Exported:
 *   - TocItem      — data shape connecting extractToc() output to <TableOfContents> input
 *   - extractToc   — server-side parser: MDX string → TocItem[]
 *
 * NOT exported (internal implementation details):
 *   - TocLevel          — union type used only inside extract-toc.ts and types.ts
 *   - TableOfContentsProps — component prop bag; consumers use React.ComponentProps<typeof TableOfContents>
 *   - useActiveHeading  — IntersectionObserver hook wired exclusively inside ui/toc.tsx
 */
export type { TocItem } from "./types";
export { extractToc } from "./extract-toc";
