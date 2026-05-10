/**
 * Feature: personal-portfolio-blog
 *
 * `useScrollSpy` — tracks which of the given DOM element ids is currently
 * in the "active" zone near the top of the viewport and returns it.
 *
 * Used by `TableOfContents` to highlight the current heading as the reader
 * scrolls through a blog post.
 */
import { useEffect, useState } from "react";

export interface ScrollSpyOptions {
  rootMargin?: string;
}

const DEFAULT_ROOT_MARGIN = "-20% 0% -70% 0%";

export function useScrollSpy(
  ids: readonly string[],
  options?: ScrollSpyOptions,
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Build a stable key so we only re-subscribe when the id set actually
  // changes rather than whenever the caller recreates the array.
  const idsKey = ids.join("|");
  const rootMargin = options?.rootMargin ?? DEFAULT_ROOT_MARGIN;

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (ids.length === 0) {
      setActiveId(null);
      return;
    }

    const elements = ids
      .map((id) => {
        if (typeof document === "undefined") return null;
        return document.getElementById(id);
      })
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) {
      setActiveId(null);
      return;
    }

    // Track the most recent intersecting state per element so we can pick
    // the topmost active one whenever any entry fires.
    const visibility = new Map<string, boolean>();
    for (const el of elements) visibility.set(el.id, false);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.isIntersecting);
        }
        // Pick the first id (in document order) currently marked visible.
        let next: string | null = null;
        for (const el of elements) {
          if (visibility.get(el.id) === true) {
            next = el.id;
            break;
          }
        }
        setActiveId(next);
      },
      { rootMargin, threshold: 0 },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, rootMargin]);

  return activeId;
}

export default useScrollSpy;
