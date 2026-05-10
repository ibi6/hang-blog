/**
 * Feature: personal-portfolio-blog
 *
 * `Skeleton` — generic shimmer placeholder for loading states.
 * `FullScreenSkeleton` — composed skeleton arrangement intended for use
 * as `<Suspense fallback>` while a route chunk is loading.
 *
 * Requirements: 12.2, 14.3
 */
import { cn } from "../../lib/cn";

type Rounded = "sm" | "md" | "lg" | "full";

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: Rounded;
  ariaLabel?: string;
}

const roundedMap: Record<Rounded, string> = {
  sm: "rounded-md",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
};

function toDim(v: string | number | undefined): string | undefined {
  if (v === undefined) return undefined;
  return typeof v === "number" ? `${v}px` : v;
}

export function Skeleton({
  className,
  width,
  height,
  rounded = "md",
  ariaLabel,
}: SkeletonProps): JSX.Element {
  const style: React.CSSProperties = {};
  const w = toDim(width);
  const h = toDim(height);
  if (w !== undefined) style.width = w;
  if (h !== undefined) style.height = h;

  return (
    <div
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role={ariaLabel ? "status" : undefined}
      style={style}
      className={cn(
        "bg-glass/30 backdrop-blur-sm",
        "animate-pulse-soft motion-reduce:animate-none",
        roundedMap[rounded],
        className,
      )}
    />
  );
}

export function FullScreenSkeleton(): JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="加载中"
      className="flex min-h-[60vh] w-full items-center justify-center px-4 py-12"
    >
      <div className="glass flex w-full max-w-xl flex-col gap-4 rounded-2xl p-6">
        <Skeleton height={28} width="60%" rounded="md" />
        <Skeleton height={14} width="90%" rounded="sm" />
        <Skeleton height={14} width="80%" rounded="sm" />
        <Skeleton height={14} width="70%" rounded="sm" />
        <div className="mt-2 flex gap-3">
          <Skeleton height={40} width={120} rounded="lg" />
          <Skeleton height={40} width={96} rounded="lg" />
        </div>
        <span className="sr-only">加载中…</span>
      </div>
    </div>
  );
}

export default Skeleton;
