import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, isCategoryValid } from "@/entities/post";
import { formatDate } from "@/shared/lib";
import { siteConfig } from "@/shared/config";
import { GiscusComments } from "@/features/comments";
import { MdxContent } from "@/shared/ui";
import { extractToc, TableOfContents } from "@/features/table-of-contents";

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

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
  if (!isCategoryValid(category)) return {};
  const post = getPostBySlug(category, slug);

  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: {
      canonical: `/posts/${category}/${slug}`,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;

  if (!isCategoryValid(category)) notFound();

  const post = getPostBySlug(category, slug);
  if (!post) notFound();

  const tocItems = extractToc(post.content);

  const postUrl = `${siteConfig.url}/posts/${post.meta.category}/${post.meta.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta.title,
    description: post.meta.description ?? "",
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: siteConfig.url,
    },
    datePublished: post.meta.date,
    dateModified: post.meta.date,
    url: postUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author,
      url: siteConfig.url,
    },
    ...(post.meta.tags && post.meta.tags.length > 0
      ? { keywords: post.meta.tags.join(", ") }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-content lg:max-w-content-wide mx-auto px-4 py-8 sm:px-6 sm:py-16">
        <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-12">
          <article>
            <header className="mb-8 sm:mb-12">
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
                <p className="mb-2 text-sm font-medium text-neutral-500">
                  목차
                </p>
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
    </>
  );
}
