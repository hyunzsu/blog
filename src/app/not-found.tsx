import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-content mx-auto flex flex-col items-center justify-center px-6 py-32 text-center">
      <p className="text-sm font-medium text-neutral-400">404</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 text-neutral-500">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <div className="mt-8 flex gap-6">
        <Link
          href="/"
          className="text-sm text-neutral-400 underline-offset-4 hover:text-neutral-600 hover:underline"
        >
          홈으로 돌아가기 →
        </Link>
        <Link
          href="/posts"
          className="text-sm text-neutral-400 underline-offset-4 hover:text-neutral-600 hover:underline"
        >
          포스트 목록 보기 →
        </Link>
      </div>
    </div>
  );
}
