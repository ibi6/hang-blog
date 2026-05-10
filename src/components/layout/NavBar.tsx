/**
 * Feature: personal-portfolio-blog
 *
 * `NavBar` — sticky top navigation rendered as a floating glass pill.
 *
 * - Desktop: logo + horizontal NavLinks + ThemeToggle
 * - Mobile (<768px): logo + hamburger (opens `MobileMenu`) + ThemeToggle
 *
 * Each NavLink uses react-router `<NavLink>` so the active route gets
 * both visual highlight and `aria-current="page"`. The `/` link sets
 * `end` to avoid matching every path; other links leave `end` unset so
 * nested routes (e.g. `/blog/:slug`) still highlight their parent.
 *
 * Requirements: 2.4, 2.5, 4.2, 4.3, 4.4, 4.6, 13.1, 13.2, 13.4, 13.5, 13.6
 */
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { author } from "../../data/author";
import { cn } from "../../lib/cn";
import { ThemeToggle } from "../ui/ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { navItems } from "./navItems";

function HamburgerIcon(): JSX.Element {
  return (
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
      focusable="false"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function desktopLinkClass(isActive: boolean): string {
  return cn(
    "relative rounded-full px-3 py-1.5 text-sm font-medium",
    "text-textPrimary hover:text-accent",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
    "transition-colors",
    isActive && "bg-accent/15 text-accent",
  );
}

export function NavBar(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-4 z-40 mx-4 md:mx-8">
      <nav
        aria-label="主导航"
        className={cn(
          "glass-strong flex items-center justify-between gap-4",
          "rounded-2xl px-4 py-3",
        )}
      >
        <Link
          to="/"
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-2 py-1",
            "text-base font-semibold text-textPrimary hover:text-accent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          )}
          aria-label={`${author.name} — 首页`}
        >
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full bg-accent"
          />
          <span>{author.name}</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) => desktopLinkClass(isActive)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="打开导航菜单"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={cn(
              "glass inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden",
              "text-textPrimary hover:text-accent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
            )}
          >
            <HamburgerIcon />
          </button>
        </div>
      </nav>

      <div id="mobile-menu">
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          items={navItems}
        />
      </div>
    </header>
  );
}

export default NavBar;
