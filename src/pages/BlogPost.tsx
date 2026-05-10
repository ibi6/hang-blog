/**
 * Feature: personal-portfolio-blog
 *
 * `BlogPost` — dynamic route `/blog/:slug`. Looks up the post by slug;
 * when absent renders a friendly "post not found" card with a link back
 * to the blog index. When present renders `PostHeader` + Markdown body
 * + desktop sidebar `TableOfContents` + `PrevNextNav`.
 *
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.6, 9.7, 13.5
 */
import { Link, useParams } from "react-router-dom";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { posts, getPostBySlug, computePrevNext } from "../data/posts";
import { GlassCard } from "../components/glass/GlassCard";
import { GlassButton } from "../components/glass/GlassButton";
import { PostHeader } from "../components/blog/PostHeader";
import { TableOfContents } from "../components/blog/TableOfContents";
import { PrevNextNav } from "../components/blog/PrevNextNav";
import { cn } from "../lib/cn";

/**
 * Custom Markdown component overrides. We keep code formatting simple
 * (no client-side syntax highlighting) and upgrade all external links
 * with `target="_blank"` + `rel="noopener noreferrer"`.
 */
const markdownComponents: Components = {
  pre: ({ children, ...rest }) => (
    <pre
      className="glass my-6 overflow-x-auto rounded-2xl p-4 text-sm"
      {...rest}
    >
      {children}
    </pre>
  ),
  code: ({ className, children, ...rest }) => {
    const isBlock =
      typeof className === "string" && /language-/.test(className);
    if (!isBlock) {
      return (
        <code
          className="rounded bg-glass/40 px-1.5 py-0.5 font-mono text-[0.9em]"
          {...rest}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={cn("font-mono", className)} {...rest}>
        {children}
      </code>
    );
  },
  a: ({ href, children, ...rest }) => {
    const external = typeof href === "string" && /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="text-accent underline-offset-4 hover:underline"
        {...rest}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt, ...rest }) => (
    <img
      src={src}
      alt={alt ?? ""}
      loading="lazy"
      className="my-6 w-full rounded-2xl"
      {...rest}
    />
  ),
  // Downgrade any `#` heading in the body to `<h2>`; the article-level
  // title is already rendered by `<PostHeader>`.
  h1: ({ children, ...rest }) => <h2 {...rest}>{children}</h2>,
};

function NotFoundPost(): JSX.Element {
  return (
    <section className="mx-auto max-w-xl py-16">
      <GlassCard as="section" className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">文章未找到</h1>
        <p className="text-sm text-textSecondary">
          这个链接可能已失效，或者文章被归档了。
        </p>
        <div className="flex justify-center">
          <Link to="/blog">
            <GlassButton variant="ghost">← 返回博客列表</GlassButton>
          </Link>
        </div>
      </GlassCard>
    </section>
  );
}

export function BlogPost(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const post = slug !== undefined ? getPostBySlug(slug) : undefined;

  if (post === undefined) {
    return <NotFoundPost />;
  }

  const index = posts.findIndex((p) => p.slug === post.slug);
  const { prev, next } = computePrevNext(posts, index);

  return (
    <section className="mx-auto max-w-6xl py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="min-w-0">
          <PostHeader post={post} />
          <div className="article-body text-textPrimary">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug]}
              components={markdownComponents}
            >
              {post.contentRaw}
            </ReactMarkdown>
          </div>
          <PrevNextNav prev={prev} next={next} />
        </article>
        <TableOfContents items={post.toc} />
      </div>
    </section>
  );
}

export default BlogPost;
