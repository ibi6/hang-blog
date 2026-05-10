/**
 * Feature: personal-portfolio-blog
 *
 * `SocialLinks` — large glass cards exposing each of the author's
 * social profiles. Each card is a link that opens in a new tab for
 * external URLs (everything except `mailto:`).
 *
 * Requirements: 10.2, 13.4
 */
import { author } from "../../data/author";
import type { SocialLink } from "../../types/author";
import { GlassCard } from "../glass/GlassCard";
import { SocialIcon } from "../ui/SocialIcon";
import { cn } from "../../lib/cn";

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function platformDisplayName(platform: string): string {
  switch (platform) {
    case "github":
      return "GitHub";
    case "linkedin":
      return "LinkedIn";
    case "twitter":
      return "Twitter";
    case "email":
      return "邮箱";
    default:
      return platform;
  }
}

function hrefPreview(href: string): string {
  return href.replace(/^mailto:/, "").replace(/^https?:\/\//i, "");
}

function SocialCard({ link }: { link: SocialLink }): JSX.Element {
  const external = isExternal(link.href);
  return (
    <a
      href={link.href}
      aria-label={link.label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group block rounded-2xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
      )}
    >
      <GlassCard
        as="article"
        className={cn(
          "flex items-center gap-4 p-5",
          "transition-shadow duration-300 group-hover:shadow-glassLg",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "glass inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
            "text-accent",
          )}
        >
          <SocialIcon platform={link.platform} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-textPrimary">
            {platformDisplayName(link.platform)}
          </p>
          <p className="truncate text-xs text-textSecondary">
            {hrefPreview(link.href)}
          </p>
        </div>
      </GlassCard>
    </a>
  );
}

export interface SocialLinksProps {
  className?: string;
}

export function SocialLinks({ className }: SocialLinksProps): JSX.Element {
  return (
    <section className={className} aria-labelledby="social-heading">
      <h2
        id="social-heading"
        className="mb-4 text-lg font-semibold text-textPrimary"
      >
        其他联系方式
      </h2>
      <ul className="space-y-3">
        {author.social.map((link) => (
          <li key={link.platform + link.href}>
            <SocialCard link={link} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SocialLinks;
