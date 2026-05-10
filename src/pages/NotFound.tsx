/**
 * Feature: personal-portfolio-blog
 *
 * `NotFound` — 404 page rendered for unmatched routes. Large gradient
 * numerals and a one-tap link back home.
 *
 * Requirements: 4.5
 */
import { Link } from "react-router-dom";
import { GlassCard } from "../components/glass/GlassCard";
import { GlassButton } from "../components/glass/GlassButton";
import { cn } from "../lib/cn";

export function NotFound(): JSX.Element {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl items-center py-16">
      <GlassCard as="section" className="w-full space-y-6 p-8 text-center">
        <p
          aria-hidden="true"
          className={cn(
            "bg-gradient-to-r from-accent via-fuchsia-500 to-sky-400 bg-clip-text",
            "text-[7rem] font-black leading-none text-transparent md:text-[9rem]",
          )}
        >
          404
        </p>
        <h1 className="text-2xl font-semibold md:text-3xl">页面走丢了</h1>
        <p className="mx-auto max-w-sm text-sm text-textSecondary">
          你访问的页面可能已被移动、重命名或从未存在。回到首页继续探索吧。
        </p>
        <div className="flex justify-center">
          <Link to="/" aria-label="返回首页">
            <GlassButton variant="primary">回到首页</GlassButton>
          </Link>
        </div>
      </GlassCard>
    </section>
  );
}

export default NotFound;
