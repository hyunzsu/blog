import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export type Category = "dev" | "life" | "essay";

export interface PostMeta {
  title: string;
  date: string;
  category: Category;
  slug: string;
  description?: string;
  tags?: string[];
}

export interface Post {
  meta: PostMeta;
  content: string;
}

export function getAllPosts(): PostMeta[] {
  const categories: Category[] = ["dev", "life", "essay"];
  const posts: PostMeta[] = [];

  for (const category of categories) {
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
        title: data.title,
        date: data.date,
        category,
        slug,
        description: data.description,
        tags: data.tags,
      });
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPostBySlug(
  category: Category,
  slug: string,
): Post | null {
  const filePath = path.join(POSTS_DIR, category, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    meta: {
      title: data.title,
      date: data.date,
      category,
      slug,
      description: data.description,
      tags: data.tags,
    },
    content,
  };
}

export function getPostsByCategory(category: Category): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}
