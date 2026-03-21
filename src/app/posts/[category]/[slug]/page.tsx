import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, type Category } from "@/shared/lib/posts";
import { extractToc } from "@/shared/lib/toc";
import { GiscusComments } from "@/shared/ui/giscus-comments";
import { MdxContent } from "@/shared/ui/mdx-content";
import { TableOfContents } from "@/shared/ui/toc";

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

const VALID_CATEGORIES = ["dev", "life", "essay"];

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const post = getPostBySlug(category as Category, slug);

  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.description,
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;

  if (!VALID_CATEGORIES.includes(category)) notFound();

  const post = getPostBySlug(category as Category, slug);
  if (!post) notFound();

  const tocItems = extractToc(post.content);

  return (
    <div className="mx-auto max-w-[720px] px-6 py-16 lg:max-w-[1080px]">
      <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-12">
        <article>
          <header className="mb-12">
            <p className="mb-2 text-sm text-neutral-400">
              <span className="mr-2 uppercase">{post.meta.category}</span>
              {formatDate(post.meta.date)}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              {post.meta.title}
            </h1>
            {post.meta.description && (
              <p className="mt-3 text-neutral-500">{post.meta.description}</p>
            )}
          </header>

          {/* 모바일 TOC */}
          {tocItems.length > 0 && (
            <div className="mb-8 rounded-lg border border-neutral-200 p-4 lg:hidden">
              <p className="mb-2 text-sm font-medium text-neutral-500">목차</p>
              <TableOfContents items={tocItems} />
            </div>
          )}

          <MdxContent source={post.content} />

          <hr className="my-12 border-neutral-200" />
          <GiscusComments />
        </article>

        {/* 데스크톱 TOC */}
        {tocItems.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="mb-3 text-xs font-medium tracking-wider text-neutral-400 uppercase">
                목차
              </p>
              <TableOfContents items={tocItems} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
