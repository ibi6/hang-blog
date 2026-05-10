/**
 * Feature: personal-portfolio-blog
 *
 * `Projects` — filterable grid of project cards. A single-select tag
 * filter narrows the list; an empty-state card appears when no project
 * matches.
 *
 * Requirements: 2.7, 7.1, 7.5, 7.6, 7.7
 */
import { useMemo, useState } from "react";
import { projects } from "../data/projects";
import { filterProjectsByTag } from "../lib/filter";
import { ProjectCard } from "../components/project/ProjectCard";
import { TagFilter } from "../components/ui/TagFilter";
import { EmptyState } from "../components/ui/EmptyState";

function collectUniqueTags(): string[] {
  const set = new Set<string>();
  for (const p of projects) for (const t of p.tags) set.add(t);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function Projects(): JSX.Element {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const allTags = useMemo(collectUniqueTags, []);
  const filtered = useMemo(
    () => filterProjectsByTag(projects, selectedTag),
    [selectedTag],
  );

  return (
    <section className="mx-auto max-w-6xl py-12">
      <header className="mb-10 space-y-3 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          项目
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">项目作品集</h1>
        <p className="mx-auto max-w-2xl text-sm text-textSecondary">
          这里整理了我近几年参与或主导的一些开源 / 个人项目。按标签筛选可以快速找到你感兴趣的方向。
        </p>
      </header>

      <div className="mb-8 flex justify-center">
        <TagFilter
          tags={allTags}
          selected={selectedTag}
          onSelect={setSelectedTag}
          ariaLabel="按项目标签筛选"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState text="当前筛选无匹配项目。" />
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.id} className="h-full">
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Projects;
