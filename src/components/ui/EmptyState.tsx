/**
 * Feature: personal-portfolio-blog
 *
 * `EmptyState` — friendly glass card rendered when a list has no matching
 * items (e.g. project filter yields zero matches, blog search is empty).
 *
 * Requirements: 7.7, 8.5
 */
import { GlassCard } from "../glass/GlassCard";
import { cn } from "../../lib/cn";

export interface EmptyStateProps {
  text: string;
  className?: string;
}

function EmptyIllustration(): JSX.Element {
  return (
    <svg
      viewBox="0 0 96 96"
      width="96"
      height="96"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-accent opacity-80"
    >
      <path d="M12 40 L48 20 L84 40 L48 60 Z" />
      <path d="M12 40 V72 L48 92 L84 72 V40" />
      <path d="M48 60 V92" />
      <path d="M24 52 L32 56" />
      <path d="M72 52 L64 56" />
    </svg>
  );
}

export function EmptyState({ text, className }: EmptyStateProps): JSX.Element {
  return (
    <GlassCard
      as="section"
      role="status"
      className={cn(
        "mx-auto flex max-w-md flex-col items-center gap-4 text-center",
        className,
      )}
    >
      <EmptyIllustration />
      <p className="text-sm text-textSecondary">{text}</p>
    </GlassCard>
  );
}

export default EmptyState;
