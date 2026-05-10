/**
 * Feature: personal-portfolio-blog
 *
 * `ProjectCard` — glass card that renders one project's cover, name,
 * description, tags, and external links. Image loading is progressive:
 * a `Skeleton` fills the aspect box until the cover finishes downloading.
 *
 * Requirements: 7.2, 7.3, 7.4, 12.2, 12.4, 13.3, 13.4
 */
import { useState } from "react";
import type { Project } from "../../types/project";
import { GlassCard } from "../glass/GlassCard";
import { TagPill } from "../ui/TagPill";
import { Skeleton } from "../ui/Skeleton";
import { ExternalIcon } from "../ui/SocialIcon";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../lib/cn";

export interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({
  project,
  className,
}: ProjectCardProps): JSX.Element {
  const [loaded, setLoaded] = useState<boolean>(false);
  const reduced = useReducedMotion();

  return (
    <GlassCard
      as="article"
      className={cn(
        "group flex h-full flex-col overflow-hidden p-0",
        "transition-shadow duration-300 hover:shadow-glassLg",
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {!loaded && (
          <Skeleton
            className="absolute inset-0 h-full w-full"
            rounded="sm"
            ariaLabel="加载封面中"
          />
        )}
        <img
          src={project.cover}
          alt={project.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={cn(
            "h-full w-full object-cover transition-transform duration-300",
            !reduced && "group-hover:scale-[1.03]",
          )}
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-textPrimary">
          {project.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-textSecondary">
          {project.description}
        </p>
        {project.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <li key={t}>
                <TagPill label={t} />
              </li>
            ))}
          </ul>
        )}
        {project.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} - ${l.label}`}
                className={cn(
                  "glass inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium",
                  "text-textPrimary hover:text-accent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                  "transition-colors",
                )}
              >
                {l.label}
                <ExternalIcon width="14" height="14" />
              </a>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

export default ProjectCard;
