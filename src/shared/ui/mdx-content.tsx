import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rehypePlugins: any[] = [
  rehypeSlug,
  [rehypeShiki, { theme: "github-light" }],
];

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose prose-neutral max-w-none">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            rehypePlugins,
          },
        }}
      />
    </div>
  );
}
