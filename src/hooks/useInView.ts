/**
 * Feature: personal-portfolio-blog
 *
 * `useInView` — once-sticky IntersectionObserver hook.
 *
 * Returns a ref to attach to the target element and a boolean that flips
 * to `true` the first time the element intersects the viewport. Once set
 * it remains `true` for the lifetime of the hook, which matches the
 * "animate on scroll into view" pattern used by the rest of the site.
 */
import { useEffect, useRef, useState, type RefObject } from "react";

export function useInView<T extends Element>(
  options?: IntersectionObserverInit,
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    const target = ref.current;
    if (target === null) return;
    if (typeof IntersectionObserver === "undefined") {
      // Non-browser or unsupported — assume visible so content still shows.
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
          break;
        }
      }
    }, options);

    observer.observe(target);
    return () => observer.disconnect();
    // `options` is intentionally not a dep — callers should memoize if they
    // want to change observer config at runtime; the default stable call
    // avoids resubscription churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}

export default useInView;
