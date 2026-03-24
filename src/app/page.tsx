import Link from "next/link";
import { getAllPosts, PostListItem } from "@/entities/post";

const RECENT_POSTS_COUNT = 7;

export default function Home() {
  const posts = getAllPosts().slice(0, RECENT_POSTS_COUNT);

  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 sm:py-16">
      <section className="mb-8 sm:mb-16">
        <h1 className="text-2xl font-semibold tracking-tight">hyunzsu</h1>
        <p className="mt-2 text-neutral-500">
          프론트엔드 개발자. 좋은 코드와 좋은 경험에 관심이 많습니다.
        </p>
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
