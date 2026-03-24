"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-content mx-auto flex flex-col items-center justify-center px-6 py-32 text-center">
      <p className="text-sm font-medium text-neutral-400">500</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        오류가 발생했습니다
      </h1>
      <p className="mt-3 text-neutral-500">
        일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
        <button
          onClick={reset}
          className="text-sm text-neutral-900 underline-offset-4 hover:underline"
        >
          다시 시도하기
        </button>
        <Link
          href="/"
          className="text-sm text-neutral-400 underline-offset-4 hover:text-neutral-600 hover:underline"
        >
          홈으로 돌아가기 →
        </Link>
      </div>
    </div>
  );
}
