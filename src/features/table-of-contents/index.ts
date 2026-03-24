/**
 * Public API for features/table-of-contents.
 *
 * Intended consumers: app/ pages and pages/ routes that need to render a TOC.
 *
 * Usage pattern:
 *   import { extractToc, TableOfContents } from "@/features/table-of-contents";
 *   const items = extractToc(rawMdxString);   // server-side
 *   <TableOfContents items={items} />          // client component
 *
 * Exported:
 *   TocItem         — shared data contract between extractToc and TableOfContents
 *   extractToc      — server-safe heading parser
 *   TableOfContents — interactive TOC component (Client Component)
 *
 * Intentionally NOT re-exported:
 *   useActiveHeading   — internal hook; implementation detail of TableOfContents
 *   TocLevel           — internal union type; not needed by consumers
 *   TableOfContentsProps — internal prop bag; not part of the feature contract
 */
export type { TocItem } from "./model";
export { extractToc } from "./model";
export { TableOfContents } from "./ui";
