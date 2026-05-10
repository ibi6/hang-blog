/**
 * Feature: personal-portfolio-blog
 *
 * `HeroSection` — landing hero for the home page. Two-column on desktop
 * (text + avatar showcase) collapsing to a single column on mobile.
 *
 * Requirements: 5.1, 5.2, 5.3
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { author } from "../../data/author";
import { GlassButton } from "../glass/GlassButton";
import { Skeleton } from "../ui/Skeleton";
import { cn } from "../../lib/cn";

function ArrowRightIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable={false}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function HeroSection(): JSX.Element {
  const [avatarLoaded, setAvatarLoaded] = useState<boolean>(false);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[80vh] flex-col justify-center py-16"
    >
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-6 text-center lg:text-left">
          <span
            className={cn(
              "glass inline-flex items-center gap-2 rounded-full px-3 py-1",
              "text-xs font-medium text-accent",
            )}
          >
            <span aria-hidden="true">👋</span> 你好，我是
          </span>
          <h1
            id="hero-heading"
            className={cn(
              "bg-gradient-to-r from-accent via-fuchsia-500 to-sky-400 bg-clip-text",
              "text-5xl font-black leading-tight text-transparent md:text-7xl",
            )}
          >
            {author.name}
          </h1>
          <p className="text-lg font-medium text-textPrimary md:text-xl">
            {author.headline}
          </p>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-textSecondary lg:mx-0">
            专注前端工程、TypeScript 类型系统与独立产品。偶尔写点什么，记录一些可以复用的经验。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link to="/projects" aria-label="浏览项目作品集">
              <GlassButton variant="primary">
                浏览项目
                <ArrowRightIcon />
              </GlassButton>
            </Link>
            <Link to="/contact" aria-label="前往联系页">
              <GlassButton variant="ghost">联系我</GlassButton>
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-56 md:w-72 lg:w-80">
          {/* Decorative floating glass chips */}
          <span
            aria-hidden="true"
            className="glass absolute -left-6 top-6 rounded-full px-3 py-1 text-xs text-textSecondary"
          >
            TypeScript
          </span>
          <span
            aria-hidden="true"
            className="glass absolute -right-4 top-20 rounded-full px-3 py-1 text-xs text-textSecondary"
          >
            React
          </span>
          <span
            aria-hidden="true"
            className="glass absolute -bottom-2 left-4 rounded-full px-3 py-1 text-xs text-textSecondary"
          >
            Rust
          </span>
          <div
            className={cn(
              "glass relative h-full w-full overflow-hidden rounded-full p-2",
            )}
          >
            {!avatarLoaded && (
              <Skeleton
                className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)]"
                rounded="full"
                ariaLabel="加载头像中"
              />
            )}
            {/* Hero avatar is the LCP candidate on the landing page; load it
                eagerly (no `loading="lazy"`) and hint a high fetch priority so
                it lands in the first paint. */}
            <img
              src={author.avatar}
              alt={author.name}
              loading="eager"
              fetchPriority="high"
              onLoad={() => setAvatarLoaded(true)}
              onError={() => setAvatarLoaded(true)}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
