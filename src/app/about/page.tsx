import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 sm:py-16">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">About</h1>
      <div className="prose prose-neutral max-w-none">
        <p>안녕하세요, hyunzsu입니다.</p>
        <p>
          프론트엔드 개발을 하고 있으며, 좋은 코드와 좋은 사용자 경험을 만드는
          일에 관심이 많습니다.
        </p>
        <h2>이 블로그에서는</h2>
        <ul>
          <li>개발하면서 배운 것들을 기록합니다</li>
          <li>일상과 생각을 가볍게 나눕니다</li>
          <li>읽고 느낀 것들을 에세이로 씁니다</li>
        </ul>
        <h2>기술 스택</h2>
        <p>
          이 블로그는 Next.js 15, TypeScript, Tailwind CSS v4, MDX로
          만들었습니다. FSD(Feature-Sliced Design) 아키텍처를 적용했습니다.
        </p>
        <h2>연락</h2>
        <p>
          GitHub에서 만나요:{" "}
          <a
            href="https://github.com/hyunzsu"
            target="_blank"
            rel="noopener noreferrer"
          >
            @hyunzsu
          </a>
        </p>
      </div>
    </div>
  );
}
