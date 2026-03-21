import { ImageResponse } from "next/og";
import { getPostBySlug, type Category } from "@/shared/lib/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface OGImageProps {
  params: Promise<{ category: string; slug: string }>;
}

export default async function OGImage({ params }: OGImageProps) {
  const { category, slug } = await params;
  const post = getPostBySlug(category as Category, slug);

  const title = post?.meta.title ?? "hyunzsu";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 16,
            color: "#a3a3a3",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "16px",
          }}
        >
          {category}
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#171717",
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "80px",
            fontSize: 20,
            color: "#a3a3a3",
          }}
        >
          hyunzsu
        </div>
      </div>
    ),
    { ...size },
  );
}
