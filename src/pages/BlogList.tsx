/**
 * Feature: personal-portfolio-blog
 *
 * `BlogList` — paginated blog index with tag filtering + title search.
 *
 * Pipeline:
 *   posts → filterPostsByTag → searchPostsByTitle → paginate(page, 6)
 *
 * `posts` is already date-descending (sorted at load time), so no extra
 * sort is required here.
 *
 * Requirements: 2.8, 8.1, 8.3, 8.4, 8.5, 8.6
 */
import { useEffect, useMemo, useState } from "react";
import { posts } from "../data/posts";
import { filterPostsByTag } from "../lib/filter";
import { searchPostsByTitle } from "../lib/search";
import { paginate } from "../lib/paginate";
import { BlogCard } from "../components/blog/BlogCard";
import { TagFilter } from "../components/ui/TagFilter";
import { SearchBox } from "../components/ui/SearchBox";
import { Pagination } from "../components/ui/Pagination";
import { EmptyState } from "../components/ui/EmptyState";

const PER_PAGE = 6;

function collectUniqueTags(): string[] {
  const set = new Set<string>();
  for (const p of posts) for (const t of p.frontmatter.tags) set.add(t);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function BlogList(): JSX.Element {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const allTags = useMemo(collectUniqueTags, []);

  const filtered = useMemo(() => {
    const byTag = filterPostsByTag(posts, selectedTag);
    return searchPostsByTitle(byTag, query);
  }, [selectedTag, query]);

  const pageResult = useMemo(
    () => paginate(filtered, page, PER_PAGE),
    [filtered, page],
  );

  // When filters change, the old page number may be out of range. Reset to
  // page 1 whenever the tag or query changes.
  useEffect(() => {
    setPage(1);
  }, [selectedTag, query]);

  return (
    <section className="mx-auto max-w-6xl py-12">
      <header className="mb-10 space-y-3 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          博客
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">写点什么</h1>
        <p className="mx-auto max-w-2xl text-sm text-textSecondary">
          关于前端工程、TypeScript 类型把戏与独立开发的碎碎念。
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-sm">
          <SearchBox value={query} onChange={setQuery} />
        </div>
        <TagFilter
          tags={allTags}
          selected={selectedTag}
          onSelect={setSelectedTag}
          ariaLabel="按文章标签筛选"
        />
      </div>

      {pageResult.total === 0 ? (
        <EmptyState text="没有找到符合条件的文章。试试换个关键词或标签。" />
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {pageResult.items.map((p) => (
              <li key={p.slug} className="h-full">
                <BlogCard post={p} />
              </li>
            ))}
          </ul>
          {pageResult.total > PER_PAGE && (
            <div className="mt-10">
              <Pagination
                page={pageResult.page}
                totalPages={pageResult.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default BlogList;
