import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";

const options: MDXRemoteProps["options"] = {
  mdxOptions: {
    rehypePlugins: [
      rehypeSlug as never,
      [rehypeShiki as never, { theme: "github-light" }],
    ],
  },
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose prose-neutral max-w-none">
      <MDXRemote source={source} options={options} />
    </div>
  );
}
