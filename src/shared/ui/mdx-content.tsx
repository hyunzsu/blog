/**
 * @layer shared
 * @domain-free true
 *
 * Zero-domain MDX rendering primitive. Accepts a raw `source: string` and
 * is deliberately agnostic about domain context (blog post, about page, …).
 * No imports from entities/ or features/.
 * Compile-time guarantee: this file must never import domain types.
 */
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import type { PluggableList } from "unified";
import { shikiOptions } from "@/shared/config";

const rehypePlugins: PluggableList = [
  rehypeSlug,
  [rehypeShiki, shikiOptions],
];

const options: MDXRemoteProps["options"] = {
  mdxOptions: {
    rehypePlugins,
  },
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose prose-neutral max-w-none">
      <MDXRemote source={source} options={options} />
    </div>
  );
}
