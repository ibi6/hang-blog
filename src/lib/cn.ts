/**
 * Feature: personal-portfolio-blog
 *
 * Minimal `cn` utility. Joins truthy class name fragments with spaces.
 * Kept intentionally tiny to avoid pulling in `clsx` or `classnames`.
 */
export type ClassValue = string | number | null | false | undefined;

export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const v of values) {
    if (v === null || v === undefined || v === false) continue;
    if (typeof v === "number") {
      out.push(String(v));
      continue;
    }
    if (typeof v === "string" && v.length > 0) {
      out.push(v);
    }
  }
  return out.join(" ");
}
