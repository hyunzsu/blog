import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, type Category } from "@/shared/lib/posts";
import { PostListItem } from "@/shared/ui/post-list-item";

export const metadata: Metadata = {
  title: "Posts",
};

const CATEGORIES: { label: string; value: Category | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "dev", value: "dev" },
  { label: "life", value: "life" },
  { label: "essay", value: "essay" },
];

interface PostsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { category } = await searchParams;
  const allPosts = getAllPosts();

  const filteredPosts =
    category && category !== "all"
      ? allPosts.filter((post) => post.category === category)
      : allPosts;

  return (
    <div className="mx-auto max-w-[720px] px-6 py-16">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Posts</h1>

      <div className="mb-8 flex gap-2">
        {CATEGORIES.map((cat) => {
          const isActive =
            cat.value === "all"
              ? !category || category === "all"
              : category === cat.value;

          return (
            <Link
              key={cat.value}
              href={
                cat.value === "all" ? "/posts" : `/posts?category=${cat.value}`
              }
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                isActive
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {filteredPosts.length > 0 ? (
        <ul className="divide-y divide-neutral-100">
          {filteredPosts.map((post) => (
            <PostListItem key={`${post.category}/${post.slug}`} post={post} />
          ))}
        </ul>
      ) : (
        <p className="text-neutral-400">해당 카테고리에 글이 없습니다.</p>
      )}
    </div>
  );
}
