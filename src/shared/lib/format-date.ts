/**
 * @layer shared
 * @domain-free true
 *
 * Pure date-formatting utility. Domain-agnostic: accepts any ISO date string.
 * No imports from entities/ or features/.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
