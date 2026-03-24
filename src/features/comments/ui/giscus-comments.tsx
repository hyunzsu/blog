"use client";

import dynamic from "next/dynamic";

const GiscusCommentsImpl = dynamic(
  () => import("./giscus-comments-impl").then((mod) => mod.GiscusCommentsImpl),
  { ssr: false },
);

export function GiscusComments() {
  return <GiscusCommentsImpl />;
}
