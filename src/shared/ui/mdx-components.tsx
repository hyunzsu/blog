/**
 * @layer shared
 * @domain-free true
 *
 * 커스텀 MDX 컴포넌트 모음. MDX 파일에서 JSX 없이 사용할 수 있는 컴포넌트를 제공.
 * No imports from entities/ or features/.
 * Compile-time guarantee: this file must never import domain types.
 */
import type { ReactNode } from "react";

type CalloutType = "info" | "warning" | "danger";

interface CalloutProps {
  type?: CalloutType;
  children: ReactNode;
}

const calloutConfig: Record<
  CalloutType,
  {
    icon: string;
    label: string;
    borderClass: string;
    bgClass: string;
    iconClass: string;
  }
> = {
  info: {
    icon: "ℹ",
    label: "정보",
    borderClass: "border-neutral-400",
    bgClass: "bg-neutral-50",
    iconClass: "text-neutral-500",
  },
  warning: {
    icon: "⚠",
    label: "주의",
    borderClass: "border-neutral-600",
    bgClass: "bg-neutral-50",
    iconClass: "text-neutral-700",
  },
  danger: {
    icon: "✕",
    label: "위험",
    borderClass: "border-neutral-900",
    bgClass: "bg-neutral-100",
    iconClass: "text-neutral-900",
  },
};

export function Callout({ type = "info", children }: CalloutProps) {
  const config = calloutConfig[type];

  return (
    <aside
      role="note"
      aria-label={config.label}
      className={`not-prose my-6 flex gap-3 rounded-r-md border-l-4 px-4 py-3 ${config.borderClass} ${config.bgClass}`}
    >
      <span
        aria-hidden="true"
        className={`mt-0.5 shrink-0 text-base leading-none font-semibold ${config.iconClass}`}
      >
        {config.icon}
      </span>
      <div className="min-w-0 text-sm leading-relaxed text-neutral-800">
        {children}
      </div>
    </aside>
  );
}
