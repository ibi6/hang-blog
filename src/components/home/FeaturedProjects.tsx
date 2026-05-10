/**
 * Feature: personal-portfolio-blog
 *
 * `FeaturedProjects` — home page section showing up to three projects
 * flagged as `featured: true`. The section animates into view once the
 * user scrolls near it (respects reduced-motion).
 *
 * Requirements: 5.4, 14.2, 14.3
 */
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { projects } from "../../data/projects";
import { ProjectCard } from "../project/ProjectCard";
import { useInView } from "../../hooks/useInView";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const FEATURED_LIMIT = 3;

export function FeaturedProjects(): JSX.Element {
  const featured = projects.filter((p) => p.featured).slice(0, FEATURED_LIMIT);
  const [ref, inView] = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -20% 0px",
  });
  const reduced = useReducedMotion();

  const initial = reduced ? false : { opacity: 0, y: 24 };
  const animate =
    reduced || inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 };
  const transition = { duration: reduced ? 0 : 0.5 };

  return (
    <motion.section
      ref={ref}
      aria-labelledby="featured-projects-heading"
      initial={initial}
      animate={animate}
      transition={transition}
      className="py-16"
    >
      <div className="mb-8 flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            精选
          </p>
          <h2
            id="featured-projects-heading"
            className="text-2xl font-semibold md:text-3xl"
          >
            精选项目
          </h2>
          <p className="mt-1 text-sm text-textSecondary">
            近期我最喜欢、最有代表性的几个作品。
          </p>
        </div>
        <Link
          to="/projects"
          className="text-sm font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
        >
          查看全部 →
        </Link>
      </div>
      {featured.length === 0 ? (
        <p className="text-sm text-textSecondary">暂无精选项目。</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <li key={p.id} className="h-full">
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}

export default FeaturedProjects;
