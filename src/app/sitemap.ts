import type { MetadataRoute } from "next";
import { getAllPosts } from "@/shared/lib/posts";
import { siteConfig } from "@/shared/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const postEntries = posts.map((post) => ({
    url: `${siteConfig.url}/posts/${post.category}/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [
    { url: siteConfig.url, lastModified: new Date() },
    { url: `${siteConfig.url}/posts`, lastModified: new Date() },
    { url: `${siteConfig.url}/about`, lastModified: new Date() },
    ...postEntries,
  ];
}
