"use client";

import Giscus from "@giscus/react";

export function GiscusComments() {
  return (
    <Giscus
      repo="hyunzsu/blog"
      repoId=""
      category="General"
      categoryId=""
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
