/**
 * Feature: personal-portfolio-blog
 *
 * `SearchBox` — controlled glass input with a leading search icon,
 * intended for the blog list title search.
 *
 * Requirements: 8.6, 13.1, 13.4
 */
import { cn } from "../../lib/cn";
import { GlassInput } from "../glass/GlassInput";

export interface SearchBoxProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}

function SearchIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable={false}
      className="text-textSecondary"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function SearchBox({
  value,
  onChange,
  placeholder = "搜索文章标题…",
  ariaLabel = "搜索博客文章标题",
  className,
}: SearchBoxProps): JSX.Element {
  return (
    <div className={cn("relative w-full", className)}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        <SearchIcon />
      </span>
      <GlassInput
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="pl-10"
      />
    </div>
  );
}

export default SearchBox;
