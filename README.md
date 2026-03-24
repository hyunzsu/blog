# hyunzsu

개인 블로그 — Next.js 15 + MDX

## 기술 스택

- **Next.js 15** App Router, TypeScript strict
- **Tailwind CSS v4** + @tailwindcss/typography
- **MDX** (next-mdx-remote) + **Shiki** 코드 하이라이팅
- **Giscus** 댓글
- **Pretendard** + **JetBrains Mono** 폰트
- ESLint 9 Flat Config + Prettier
- pnpm

## 시작하기

```bash
pnpm install
pnpm dev
```

## 스크립트

| 명령어           | 설명                  |
| ---------------- | --------------------- |
| `pnpm dev`       | 개발 서버 (Turbopack) |
| `pnpm build`     | 프로덕션 빌드         |
| `pnpm lint`      | ESLint 검사           |
| `pnpm format`    | Prettier 포맷팅       |
| `pnpm typecheck` | TypeScript 타입 체크  |

## 프로젝트 구조

```
src/
├── app/                    # 라우트
│   ├── page.tsx            # 홈 (소개 + 최근 글)
│   ├── posts/
│   │   ├── page.tsx        # 글 목록 + 카테고리 필터
│   │   └── [category]/[slug]/
│   │       ├── page.tsx    # 글 상세 + TOC
│   │       └── opengraph-image.tsx
│   ├── about/page.tsx
│   ├── feed.xml/route.ts   # RSS
│   └── sitemap.ts
├── shared/
│   ├── config/site.ts      # 사이트 설정
│   ├── lib/                # 유틸리티
│   └── ui/                 # 공통 컴포넌트
├── features/
└── entities/
content/
└── posts/
    ├── dev/                # 개발
    ├── life/               # 일상
    └── essay/              # 에세이
```

## 글 작성

`content/posts/{category}/` 폴더에 `.mdx` 파일을 추가합니다.

```mdx
---
title: "글 제목"
date: "2026-03-23"
description: "글 설명"
tags: ["tag1", "tag2"]
---

내용을 작성합니다.
```

## 배포

Vercel에 연결하면 자동 배포됩니다.

## 라이선스

MIT
