import type { MetadataRoute } from "next";
import { getAllPosts } from "@/entities/post";
import { siteConfig } from "@/shared/config";

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
