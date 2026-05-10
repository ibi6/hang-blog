/**
 * Feature: personal-portfolio-blog
 *
 * 当 React Router 匹配到 `/admin`、`/admin/` 或 `/admin/*` 时，
 * 立即把浏览器重定向到 `/admin/index.html`（真正的 Sveltia CMS 入口）。
 *
 * 为什么需要这层？
 * - Vite dev 的 SPA fallback 会把目录请求 `/admin/` 吞到主站 `index.html`
 * - 主站由 React Router 接管，默认会命中通配符 `*` 显示 404
 * - 让它命中这个组件后，立刻 `window.location.replace` 到带文件名的真实路径，
 *   这样 Vite 的静态中间件就能命中 `public/admin/index.html` 返回 Sveltia
 *
 * 生产环境：由 nginx 做 `try_files` 或 `rewrite` 处理，此组件不会触发。
 */
import { useEffect } from "react";

export function AdminRedirect(): JSX.Element {
  useEffect(() => {
    // 保留后面的 hash（Sveltia 用 hash 路由，例如 #/collections/posts）
    const { hash, search } = window.location;
    window.location.replace(`/admin/index.html${search}${hash}`);
  }, []);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif',
        color: "#6b7280",
      }}
    >
      正在跳转到内容管理后台…
    </div>
  );
}

export default AdminRedirect;
