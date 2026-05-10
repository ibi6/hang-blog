/**
 * Feature: personal-portfolio-blog
 *
 * `PageTransition` — wraps route children in an AnimatePresence + motion.div
 * so that navigation animates a short fade/slide-in.
 *
 * When `useReducedMotion()` reports `true`, Property 13 requires:
 *   - `initial` === `animate` (or `initial === false`)
 *   - `transition.duration === 0`
 *
 * We pick `initial={false}` for the reduced-motion path, which trivially
 * satisfies the first condition.
 *
 * Requirements: 14.1, 14.3
 */
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface PageTransitionProps {
  children: ReactNode;
  locationKey: string;
}

export function PageTransition({
  children,
  locationKey,
}: PageTransitionProps): JSX.Element {
  const reduced = useReducedMotion();

  const initial = reduced ? false : { opacity: 0, y: 8 };
  const animate = { opacity: 1, y: 0 };
  // When reduced-motion is on, keep exit equal to animate so there is no
  // visual transition at all. Otherwise simply fade out.
  const exit = reduced ? { opacity: 1, y: 0 } : { opacity: 0 };
  const transition = { duration: reduced ? 0 : 0.3 };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={locationKey}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
