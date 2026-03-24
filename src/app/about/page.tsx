import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">About</h1>
      <div className="prose prose-neutral max-w-none">
        <p>hyunzsu</p>
        <p>...</p>
      </div>
    </div>
  );
}
