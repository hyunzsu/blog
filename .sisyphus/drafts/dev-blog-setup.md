# Draft: 개인 개발 블로그 처음부터 세팅

## Requirements (confirmed)

### Tech Stack

- Next.js 15 (App Router ONLY, pages 금지)
- TypeScript 5.x (strict mode)
- pnpm (패키지 매니저)
- Tailwind CSS v4 (CSS-first config)
- shadcn/ui (latest)
- MDX: next-mdx-remote 5+ (contentlayer 금지)
- Shiki: 코드 하이라이팅 (빌드 타임, rehype-shiki)
- Giscus: 댓글
- next/metadata: SEO
- Sharp + next/image: 이미지 최적화
- ESLint 9 (Flat Config) + Prettier

### Architecture

- Feature-Sliced Design (FSD) 기반
- src/ 하위: app, features, shared, entities, content

### Design References

1. **jihoonwrks.me**: 극도로 미니멀, 타이포그래피 중심, 넉넉한 여백, 리스트형 레이아웃 (제목 + 날짜만), 세리프+산세리프 조합
2. **maxkim-j.github.io**: 개발자 블로그 정석, 제목 + 카테고리 태그(tech/essay/culture) + 날짜, 상단 nav(posts/about/pic/rss)
3. **hayou.me**: 카테고리별 필터 탭(전체/개발/기록/일상/독서/음악), 날짜+제목+카테고리 뱃지, 페이지네이션

### Design Principles (confirmed)

- 미니멀리즘 (콘텐츠=디자인)
- 타이포그래피 중심
- 넉넉한 여백
- 리스트형 포스트 목록 (카드형 아님)
- 카테고리 필터링
- 라이트 모드 전용 (다크모드 없음, next-themes 없음)

### Style Guide (confirmed)

- 라이트 모드 전용
- 한글: Pretendard 또는 시스템 산세리프
- 코드: JetBrains Mono 또는 Fira Code
- 본문 max-width: 680~720px
- line-height: 1.8~2.0
- 색상: 흑백 + 포인트 컬러 1개

### 필수 기능 (10개)

1. MDX + Shiki 코드 블록
2. 반응형 (모바일 우선)
3. 메타데이터 & OG 이미지 자동 생성
4. 최신순 정렬
5. frontmatter 기반 메타데이터
6. TOC 자동 생성
7. ESLint 9 + Prettier
8. 카테고리별 필터링
9. RSS 피드
10. 사이트맵 자동 생성

### Constraints (금지사항)

- pages/ 라우터 금지
- contentlayer 금지
- CSS-in-JS 금지
- any 타입 금지
- 클래스형 컴포넌트 금지
- next-themes 금지
- 카드형 UI 금지

## Open Questions

- [ ] 사이트 이름/제목?
- [ ] 작성자 이름?
- [ ] 배포 대상 (Vercel? Cloudflare Pages?)
- [ ] Giscus GitHub 레포 정보
- [ ] 카테고리 목록 확정
- [ ] 포인트 컬러 선호
- [ ] 폰트 최종 확정 (Pretendard vs 시스템 / JetBrains Mono vs Fira Code)
- [ ] 테스트 전략

## Research Findings (pending)

- 6개 librarian 에이전트 조사 중
- 3개 레퍼런스 블로그 디자인 분석 완료
