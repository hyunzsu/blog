import Link from "next/link";
import type { PostMeta } from "../model";
import { formatDate } from "@/shared/lib";

interface PostListItemProps {
  post: PostMeta;
}

export function PostListItem({ post }: PostListItemProps) {
  return (
    <li>
      <Link
        href={`/posts/${post.category}/${post.slug}`}
        className="group flex items-baseline justify-between gap-4 py-2"
      >
        <span className="truncate text-neutral-900 group-hover:text-neutral-600">
          {post.title}
        </span>
        <span className="shrink-0 text-sm text-neutral-400">
          <span className="mr-3 text-xs uppercase">{post.category}</span>
          {formatDate(post.date)}
        </span>
      </Link>
    </li>
  );
}
