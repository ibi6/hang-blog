/**
 * Feature: personal-portfolio-blog
 *
 * `MobileMenu` — full-screen glass drawer for small viewports that hosts
 * the same navigation links as the desktop NavBar, plus the theme toggle.
 *
 * Responsibilities:
 * - Animated open/close via framer-motion (respects reduced-motion)
 * - Close on Escape
 * - Close when any link is clicked
 * - Lock body scroll while open
 *
 * Requirements: 2.4, 2.5, 4.2, 4.3, 4.4, 13.1, 13.2, 13.4, 13.5, 13.6
 */
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { MotionProps } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ThemeToggle } from "../ui/ThemeToggle";
import { cn } from "../../lib/cn";
import type { NavItem } from "./navItems";

export interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  items: readonly NavItem[];
}

export function MobileMenu({ open, onClose, items }: MobileMenuProps): JSX.Element {
  const reduced = useReducedMotion();

  // Close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const overlayMotion: MotionProps = reduced
    ? {
        initial: false,
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
      };

  const panelMotion: MotionProps = reduced
    ? {
        initial: false,
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: -16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -16 },
        transition: { duration: 0.25 },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu-overlay"
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          onClick={onClose}
          {...overlayMotion}
        />
      )}
      {open && (
        <motion.div
          key="mobile-menu-panel"
          role="dialog"
          aria-modal="true"
          aria-label="导航菜单"
          className={cn(
            "glass-strong fixed left-4 right-4 top-4 z-50",
            "rounded-2xl px-6 py-6 md:hidden",
          )}
          {...panelMotion}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-textSecondary">菜单</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭导航菜单"
              className={cn(
                "glass inline-flex h-10 w-10 items-center justify-center rounded-full",
                "text-textPrimary hover:text-accent",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
              )}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <nav aria-label="主导航（移动端）" className="mt-4">
            <ul className="flex flex-col gap-1">
              {items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-xl px-4 py-3 text-lg font-medium",
                        "text-textPrimary hover:text-accent",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                        isActive && "bg-accent/15 text-accent",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-4 flex justify-end">
            <ThemeToggle />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
