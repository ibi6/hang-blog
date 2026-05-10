/**
 * Feature: personal-portfolio-blog
 *
 * `LatestPosts` — home page section showing the three most recent blog
 * posts. `posts` is already in date-descending order so we simply slice.
 *
 * Requirements: 5.5, 14.2, 14.3
 */
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { posts } from "../../data/posts";
import { BlogCard } from "../blog/BlogCard";
import { useInView } from "../../hooks/useInView";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const LATEST_LIMIT = 3;

export function LatestPosts(): JSX.Element {
  const latest = posts.slice(0, LATEST_LIMIT);
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
      aria-labelledby="latest-posts-heading"
      initial={initial}
      animate={animate}
      transition={transition}
      className="py-16"
    >
      <div className="mb-8 flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            博客
          </p>
          <h2
            id="latest-posts-heading"
            className="text-2xl font-semibold md:text-3xl"
          >
            最新文章
          </h2>
          <p className="mt-1 text-sm text-textSecondary">
            一些最近的写作与技术笔记。
          </p>
        </div>
        <Link
          to="/blog"
          className="text-sm font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
        >
          所有文章 →
        </Link>
      </div>
      {latest.length === 0 ? (
        <p className="text-sm text-textSecondary">还没有发布任何文章。</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {latest.map((p) => (
            <li key={p.slug} className="h-full">
              <BlogCard post={p} />
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}

export default LatestPosts;
