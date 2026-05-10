/**
 * Feature: personal-portfolio-blog
 *
 * `SkillsSection` — groups the author's skills by category and renders
 * each skill as a pill. Designed to adapt to any number of categories
 * returned by the `author.skills` array.
 *
 * Requirements: 6.3
 */
import { useMemo } from "react";
import type { Skill } from "../../types/author";
import { TagPill } from "../ui/TagPill";

export interface SkillsSectionProps {
  skills: readonly Skill[];
  className?: string;
}

const UNCATEGORIZED_KEY = "__uncategorized__";
const CATEGORY_LABELS: Record<string, string> = {
  language: "语言",
  frontend: "前端",
  backend: "后端",
  tooling: "工具链",
};

function categoryLabel(key: string): string {
  if (key === UNCATEGORIZED_KEY) return "其他";
  return CATEGORY_LABELS[key] ?? key;
}

function groupByCategory(skills: readonly Skill[]): Map<string, Skill[]> {
  const grouped = new Map<string, Skill[]>();
  for (const s of skills) {
    const key = s.category ?? UNCATEGORIZED_KEY;
    const list = grouped.get(key) ?? [];
    list.push(s);
    grouped.set(key, list);
  }
  return grouped;
}

export function SkillsSection({
  skills,
  className,
}: SkillsSectionProps): JSX.Element {
  const grouped = useMemo(() => groupByCategory(skills), [skills]);

  return (
    <section className={className} aria-labelledby="skills-heading">
      <h2
        id="skills-heading"
        className="mb-6 text-2xl font-semibold text-textPrimary"
      >
        技能
      </h2>
      <div className="space-y-5">
        {Array.from(grouped.entries()).map(([key, items]) => (
          <div key={key}>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-textSecondary">
              {categoryLabel(key)}
            </p>
            <ul className="flex flex-wrap gap-2">
              {items.map((s) => (
                <li key={s.name}>
                  <TagPill label={s.name} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SkillsSection;
