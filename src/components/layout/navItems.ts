/**
 * Feature: personal-portfolio-blog
 *
 * Shared NavBar / MobileMenu item definitions. Centralised here so both
 * views render the same links in the same order.
 */
export interface NavItem {
  to: string;
  label: string;
  /** Passed to `<NavLink>` as `end`. `/` needs `end` so it does not match
   *  every path; all other routes omit it so nested paths still highlight. */
  end?: boolean;
}

export const navItems: readonly NavItem[] = [
  { to: "/", label: "首页", end: true },
  { to: "/about", label: "关于" },
  { to: "/projects", label: "项目" },
  { to: "/blog", label: "博客" },
  { to: "/contact", label: "联系" },
];
