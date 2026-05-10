/**
 * Feature: personal-portfolio-blog
 *
 * `TimelineSection` — vertical timeline of the author's experiences.
 * Items are rendered in descending order (most recent first) based on
 * the `start` date string.
 *
 * Requirements: 6.4
 */
import { useMemo } from "react";
import type { TimelineItem } from "../../types/author";
import { GlassCard } from "../glass/GlassCard";
import { cn } from "../../lib/cn";

export interface TimelineSectionProps {
  items: readonly TimelineItem[];
  className?: string;
}

function formatRange(item: TimelineItem): string {
  const end = item.end === "present" ? "至今" : item.end;
  return `${item.start} — ${end}`;
}

export function TimelineSection({
  items,
  className,
}: TimelineSectionProps): JSX.Element {
  const sorted = useMemo(
    () =>
      items
        .slice()
        .sort((a, b) => (a.start < b.start ? 1 : a.start > b.start ? -1 : 0)),
    [items],
  );

  return (
    <section className={className} aria-labelledby="timeline-heading">
      <h2
        id="timeline-heading"
        className="mb-6 text-2xl font-semibold text-textPrimary"
      >
        经历
      </h2>
      <ol className="relative space-y-6 border-l border-glassBorder/40 pl-8">
        {sorted.map((item, idx) => (
          <li key={`${item.start}-${item.title}-${idx}`} className="relative">
            <span
              aria-hidden="true"
              className={cn(
                "glass absolute -left-[2.4rem] top-2 flex h-5 w-5 items-center justify-center rounded-full",
                "bg-accent/30 text-accent",
              )}
            >
              <span className="h-2 w-2 rounded-full bg-accent" />
            </span>
            <GlassCard as="article" className="space-y-1 p-5">
              <p className="text-xs text-textSecondary">{formatRange(item)}</p>
              <h3 className="text-base font-semibold text-textPrimary">
                {item.title}
              </h3>
              <p className="text-sm text-textSecondary">{item.org}</p>
              {item.description !== undefined && (
                <p className="mt-2 text-sm leading-relaxed text-textSecondary">
                  {item.description}
                </p>
              )}
            </GlassCard>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default TimelineSection;
