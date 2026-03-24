"use client";

import Giscus from "@giscus/react";

export function GiscusComments() {
  return (
    <Giscus
      repo="hyunzsu/blog"
      repoId="R_kgDORuDBGg"
      category="General"
      categoryId="DIC_kwDORuDBGs4C5JJj"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="light"
      lang="ko"
      loading="lazy"
    />
  );
}
