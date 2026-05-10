/**
 * Feature: personal-portfolio-blog
 *
 * `About` — self-introduction page built from the static `author` data.
 * Renders the avatar, name/headline/bio, skills, and career timeline.
 * When `author.resumeUrl` is set a download button is shown.
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 12.2, 13.3
 */
import { useState } from "react";
import { author } from "../data/author";
import { GlassCard } from "../components/glass/GlassCard";
import { GlassButton } from "../components/glass/GlassButton";
import { Skeleton } from "../components/ui/Skeleton";
import { SkillsSection } from "../components/about/SkillsSection";
import { TimelineSection } from "../components/about/TimelineSection";
import { cn } from "../lib/cn";

function DownloadIcon(): JSX.Element {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function About(): JSX.Element {
  const [avatarLoaded, setAvatarLoaded] = useState<boolean>(false);

  return (
    <section className="mx-auto max-w-5xl py-12">
      <GlassCard as="section" className="p-8 md:p-10">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:text-left">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full md:h-40 md:w-40">
            {!avatarLoaded && (
              <Skeleton
                className="absolute inset-0 h-full w-full"
                rounded="full"
                ariaLabel="加载头像中"
              />
            )}
            <img
              src={author.avatar}
              alt={author.name}
              loading="lazy"
              onLoad={() => setAvatarLoaded(true)}
              onError={() => setAvatarLoaded(true)}
              className={cn(
                "glass h-full w-full rounded-full object-cover p-1",
              )}
            />
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                关于
              </p>
              <h1 className="text-3xl font-semibold md:text-4xl">
                {author.name}
              </h1>
              <p className="text-base text-textSecondary">{author.headline}</p>
            </div>
            <p className="text-sm leading-relaxed text-textSecondary">
              {author.bio}
            </p>
            {author.resumeUrl !== undefined && (
              <div className="flex justify-center md:justify-start">
                <a
                  href={author.resumeUrl}
                  download
                  className="inline-flex focus-visible:outline-none"
                >
                  <GlassButton variant="primary">
                    <DownloadIcon />
                    下载简历
                  </GlassButton>
                </a>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SkillsSection skills={author.skills} />
        <TimelineSection items={author.timeline} />
      </div>
    </section>
  );
}

export default About;
