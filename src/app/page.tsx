import Link from "next/link";
import { getAllPosts } from "@/shared/lib/posts";
import { PostListItem } from "@/shared/ui/post-list-item";

const RECENT_POSTS_COUNT = 7;

export default function Home() {
  const posts = getAllPosts().slice(0, RECENT_POSTS_COUNT);

  return (
    <div className="mx-auto max-w-[720px] px-6 py-16">
      <section className="mb-16">
        <h1 className="text-2xl font-semibold tracking-tight">hyunzsu</h1>
        <p className="mt-2 text-neutral-500">...</p>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">최근 글</h2>
          <Link
            href="/posts"
            className="text-sm text-neutral-400 hover:text-neutral-600"
          >
            더 보기 &rarr;
          </Link>
        </div>
        {posts.length > 0 ? (
          <ul className="divide-y divide-neutral-100">
            {posts.map((post) => (
              <PostListItem key={`${post.category}/${post.slug}`} post={post} />
            ))}
          </ul>
        ) : (
          <p className="text-neutral-400">아직 작성된 글이 없습니다.</p>
        )}
      </section>
    </div>
  );
}
