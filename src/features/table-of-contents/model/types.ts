/** Valid heading levels extracted for the TOC (h2 and h3 only) */
export type TocLevel = 2 | 3;

/** A single item in the Table of Contents */
export interface TocItem {
  /** The slugified id matching the heading element's id attribute */
  id: string;
  /** The visible heading text */
  text: string;
  /** The heading depth (2 = h2, 3 = h3) */
  level: TocLevel;
}

/** Props for the TableOfContents UI component */
export interface TableOfContentsProps {
  items: TocItem[];
}
