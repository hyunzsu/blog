"use client";

import type { TableOfContentsProps } from "../model/types";
import { useActiveHeading } from "../model/use-active-heading";

export function TableOfContents({ items }: TableOfContentsProps) {
  const activeId = useActiveHeading(items);

  if (items.length === 0) return null;

  return (
    <nav aria-label="목차">
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
          >
            <a
              href={`#${item.id}`}
              className={`block py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 rounded-sm ${
                activeId === item.id
                  ? "text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
