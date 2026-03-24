/**
 * @segment api (data-access)
 *
 * IMPORTANT — naming clarification:
 * The "api" segment name here does NOT mean a network boundary or a public-interface layer.
 * It means **build-time filesystem data access**: these functions run exclusively in a
 * Node.js build/SSR context, reading `.mdx` files from `content/posts/` via `fs`.
 *
 * Responsible for: reading raw MDX files → returning typed domain objects (Post / PostMeta).
 * Must NOT be called from client components. Must NOT perform network requests.
 *
 * If you rename this segment, prefer "data-access" to make the intent self-evident.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { CATEGORIES, type Category, type Post, type PostMeta } from "../model";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export function getAllPosts(): PostMeta[] {
  const posts: PostMeta[] = [];

  for (const category of CATEGORIES) {
    const categoryDir = path.join(POSTS_DIR, category);

    if (!fs.existsSync(categoryDir)) continue;

    const files = fs
      .readdirSync(categoryDir)
      .filter((file) => file.endsWith(".mdx"));

    for (const file of files) {
      const slug = file.replace(/\.mdx$/, "");
      const filePath = path.join(categoryDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      posts.push({
        title: data.title as string,
        date: data.date as string,
        category,
        slug,
        description: data.description as string | undefined,
        tags: data.tags as string[] | undefined,
      });
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPostBySlug(category: Category, slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, category, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    meta: {
      title: data.title as string,
      date: data.date as string,
      category,
      slug,
      description: data.description as string | undefined,
      tags: data.tags as string[] | undefined,
    },
    content,
  };
}

export function getPostsByCategory(category: Category): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}
