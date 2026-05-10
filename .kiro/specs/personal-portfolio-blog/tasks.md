# Implementation Plan: Personal Portfolio Blog

## Overview

本实施计划将 `design.md` 中的架构、模块边界与 13 条正确性属性拆解为可由编码代理顺序执行的增量任务。整体策略：

1. 先搭好工程与依赖骨架；
2. 定义类型与静态数据；
3. 按「属性测试先行 → 实现」的顺序完成 `lib/` 中所有纯函数；
4. 自底向上组装：主题系统 → 样式体系与玻璃原子组件 → 动画 hook → 布局 → 路由；
5. 自顶向下按页面实现：Home → Projects → BlogList → BlogPost → About → Contact → NotFound；
6. 收尾：可访问性审核 → 性能优化 → E2E 测试。

编码实现使用 **TypeScript**（React 18 + TypeScript + Vite）。所有属性测试使用 **Vitest + fast-check**，组件测试使用 **React Testing Library**，E2E 使用 **Playwright + @axe-core/playwright**。

任务后缀 `*` 表示可选（测试相关），未后缀的任务必须实现。每条任务末尾的 `_Requirements:` 指明追溯的需求小节编号，`_Properties:` 指明关联的正确性属性编号。

---

## Tasks

- [x] 1. 初始化工程与依赖
  - [x] 1.1 使用 Vite 创建 React + TypeScript 项目骨架
    - 执行 `npm create vite@latest . -- --template react-ts` 或手动初始化；确认 `tsconfig.json` 开启 `strict`、`noUncheckedIndexedAccess`、`paths` 配置 `@/*` 指向 `src/*`
    - 按 `design.md` 目录结构创建 `src/{types,content/posts,data,lib,theme,hooks,components/{layout,glass,ui,project,blog,contact},pages,styles}` 空目录与占位 `.gitkeep`
    - 在 `package.json` 添加 `dev`、`build`、`preview`、`test`、`test:e2e` 脚本占位
    - _Requirements: 12.3_
  - [x] 1.2 安装并配置 Tailwind CSS
    - 安装 `tailwindcss`、`postcss`、`autoprefixer`，生成配置
    - 在 `tailwind.config.ts` 配置 `content` 覆盖 `index.html` 与 `src/**/*.{ts,tsx}`
    - 创建 `src/styles/globals.css`，引入 `@tailwind base/components/utilities`（CSS 变量定义留到任务 6）
    - 在 `src/main.tsx` 引入 `globals.css`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [x] 1.3 安装运行时依赖
    - 安装 `react-router-dom@6`、`framer-motion`、`gray-matter`、`react-markdown`、`remark-gfm`、`rehype-slug`、`rehype-pretty-code`、`shiki`、`@emailjs/browser`
    - _Requirements: 3.x, 4.x, 9.2, 9.3, 10.5, 14.1_
  - [x] 1.4 安装并配置测试依赖
    - 安装 `vitest`、`jsdom`、`@testing-library/react`、`@testing-library/user-event`、`@testing-library/jest-dom`、`fast-check`
    - 安装 `@playwright/test`、`@axe-core/playwright`
    - 创建 `vitest.config.ts`（environment `jsdom`、setup 文件注册 `jest-dom`、`css: false`）与 `src/setupTests.ts`
    - 创建 `playwright.config.ts` 骨架（webServer 启 vite preview、多视口 project：mobile-375、tablet-768、desktop-1440）
    - _Requirements: 全部（测试基础设施）_
  - [ ] 1.5* 冒烟验证
    - 写一条 Vitest 示例 `expect(1 + 1).toBe(2)`，一条 Playwright 示例打开 `/` 返回 200，确认两套测试管道可运行
    - _Requirements: 全部（测试基础设施）_

- [x] 2. 定义类型与准备静态数据
  - [x] 2.1 编写 TypeScript 类型定义
    - 在 `src/types/` 下创建 `theme.ts`、`project.ts`、`blog.ts`、`author.ts`，严格按 design.md 的接口签名编写，导出 `Theme`、`Project`、`ProjectLink`、`BlogFrontmatter`、`BlogPost`、`TocItem`、`Author`、`SocialLink`、`Skill`、`TimelineItem`
    - _Requirements: 3.1, 6.1–6.4, 7.2, 8.2, 9.1_
  - [x] 2.2 填充作者静态数据
    - 在 `src/data/author.ts` 导出一个 `author: Author` 对象，至少包含 1 条 headline、1 段 bio、3 条 social link、5 项 skill、3 条 timeline 条目；`resumeUrl` 字段可选存在以覆盖 WHERE 分支
    - _Requirements: 6.1–6.5, 11.1, 11.2_
  - [x] 2.3 填充项目静态数据
    - 在 `src/data/projects.ts` 导出一个 `projects: Project[]` 数组，包含至少 6 条记录，覆盖至少 4 种不同 `tags`（例如 `["react", "typescript", "tailwind", "node"]`），其中 3 条 `featured: true`，每条有至少 1 条 `links`，部分有 0 条 links 以覆盖 WHERE 分支
    - _Requirements: 5.4, 7.1–7.3, 7.5_
  - [x] 2.4 准备示例博客 Markdown 内容
    - 在 `src/content/posts/` 下创建至少 5 个 `.md` 文件，文件名形如 `2024-03-15-hello-world.md`；每篇含 frontmatter（`title`、`date`、`tags`、`summary`，可选 `author`、`cover`）与含 h2/h3 标题、代码块、列表、链接、图片的正文，覆盖不同发布日期与至少 3 种标签
    - _Requirements: 5.5, 8.1, 8.2, 8.4, 9.2, 9.3_

- [x] 3. 实现纯逻辑层：主题解析
  - [x]* 3.1 为 `resolveInitialTheme` 编写属性测试
    - **Property 1: 主题初始化解析的分支完备性**
    - **Validates: Requirements 3.2, 3.6, 3.7**
    - 文件 `src/lib/__tests__/theme.prop.test.ts`；使用 `fc.oneof(fc.constantFrom("light","dark",null), fc.string())` 作为 `stored`，`fc.boolean()` 作为 `prefersDark`；断言返回值满足 Property 1 的三条分支
    - _Requirements: 3.2, 3.6, 3.7_
  - [x] 3.2 实现 `src/lib/theme.ts`
    - 导出 `resolveInitialTheme(stored: string | null, prefersDark: boolean): Theme`
    - 同时导出 `readStoredTheme(): string | null` 与 `writeStoredTheme(t: Theme): void`（包裹 try/catch 以处理 localStorage 失败）
    - _Requirements: 3.2, 3.5, 3.6, 3.7_

- [x] 4. 实现纯逻辑层：标签过滤
  - [x]* 4.1 为标签过滤函数编写属性测试
    - **Property 2: 项目标签过滤的包含性与完备性**
    - **Validates: Requirement 7.6**
    - 文件 `src/lib/__tests__/filter.prop.test.ts`；用 `fc.array(projectArb)` 与 `fc.option(tagArb)`，断言子集、全量返回、命中 iff 三条子性质
    - 对 `filterPostsByTag` 复用同结构属性
    - _Requirements: 7.6, 8.4_
  - [x] 4.2 实现 `src/lib/filter.ts`
    - 导出 `filterProjectsByTag(projects, tag)` 与 `filterPostsByTag(posts, tag)`；`tag === null` 返回原数组（引用或浅拷贝均可，测试需兼容）
    - _Requirements: 7.6, 8.4_

- [x] 5. 实现纯逻辑层：日期排序
  - [x]* 5.1 为 `sortByDateDesc` 编写属性测试
    - **Property 3: 博客按日期倒序排序的不变量**
    - **Validates: Requirement 8.1**
    - 文件 `src/lib/__tests__/sort.prop.test.ts`；生成含随机 `frontmatter.date` 的对象数组，断言长度保持、multiset 相等（按 id 计数）、相邻元素日期单调不增
    - _Requirements: 8.1_
  - [x] 5.2 实现 `src/lib/sort.ts`
    - 导出 `sortByDateDesc<T extends { frontmatter: { date: string } }>(items: T[]): T[]`；内部使用稳定排序并避免原地修改入参
    - _Requirements: 8.1_

- [x] 6. 实现纯逻辑层：标题搜索
  - [x]* 6.1 为 `searchPostsByTitle` 编写属性测试
    - **Property 4: 博客标题搜索的子集与匹配性**
    - **Validates: Requirement 8.6**
    - 文件 `src/lib/__tests__/search.prop.test.ts`；生成含随机 Unicode 标题的 posts 与查询串（含纯空白、特殊字符），断言子集、空查询返回全量、命中 iff 子串匹配（case-insensitive、trim）
    - _Requirements: 8.6_
  - [x] 6.2 实现 `src/lib/search.ts`
    - 导出 `searchPostsByTitle(posts, query)`；对 query 做 `trim + toLowerCase`，对 title 做相同归一化后判断 `includes`
    - _Requirements: 8.6_

- [x] 7. 实现纯逻辑层：分页
  - [x]* 7.1 为 `paginate` 编写属性测试
    - **Property 5: 分页的拼接还原与边界正确性**
    - **Validates: Requirement 8.5**
    - 文件 `src/lib/__tests__/paginate.prop.test.ts`；生成随机数组、整数 `page ∈ [1, items.length + 5]`、`perPage ∈ [1, 20]`；断言 `items.length ≤ perPage`、`totalPages` 公式、`total` 等式、拼接 1..totalPages 恰好还原原数组、越界页回退至 totalPages 且 items 为空
    - _Requirements: 8.5_
  - [x] 7.2 实现 `src/lib/paginate.ts`
    - 导出 `paginate<T>(items: T[], page: number, perPage: number): Page<T>`；处理 `items = []` 时 `totalPages = 1`；对非法 `page < 1` 或 `perPage < 1` 按 clamp 策略处理
    - _Requirements: 8.5_

- [x] 8. 实现纯逻辑层：联系表单校验
  - [x]* 8.1 为 `validateContactForm` 编写属性测试
    - **Property 6: 联系表单校验的 iff 关系**
    - **Validates: Requirement 10.3**
    - 文件 `src/lib/__tests__/validation.prop.test.ts`；三组 arbitrary：空白/非空 name、合法/非法 email（fast-check `fc.emailAddress()` 与手写非法生成器）、空白/非空 message；断言每个错误字段存在 iff 对应条件成立，并断言全合法时 `errors` 为空对象
    - _Requirements: 10.3_
  - [x] 8.2 实现 `src/lib/validation.ts`
    - 导出 `isNonEmpty`、`isValidEmail`（RFC 5322 简化子集的正则，拒绝多 `@`、空 local-part、缺 TLD）、`validateContactForm(values)`
    - _Requirements: 10.3_

- [x] 9. 实现纯逻辑层：Markdown helpers
  - [x]* 9.1 为 `slugifyHeading` 与 `extractToc` 编写属性测试
    - **Property 9: TOC 提取与标题 slug 的一致性**
    - **Validates: Requirement 9.2**
    - 文件 `src/lib/__tests__/markdown.prop.test.ts`；生成随机 Markdown（用 template 拼接 `fc.integer({min:2,max:3})` 个 `#` + 随机标题文本 + 正文段落），断言 TOC 长度等于 h2/h3 数、`item.id === slugifyHeading(item.text)`、slugify 幂等、`depth ∈ {2,3}`；另对全空白标题断言产生非空 slug（例如 `untitled-{n}`）
    - _Requirements: 9.2_
  - [x] 9.2 实现 `src/lib/markdown.ts`
    - 导出 `slugFromFilename`、`parseFrontmatter`（缺 `title`/`date`/`tags`/`summary` 抛错）、`slugifyHeading`（小写、非字母数字替换为 `-`、collapse、trim `-`、空结果回退 `untitled`）、`extractToc(md)`（正则或行扫描提取 `^##\s+` 与 `^###\s+`）
    - _Requirements: 9.2_

- [x] 10. 实现纯逻辑层：阅读时长
  - [x] 10.1 实现 `src/lib/readingTime.ts`
    - 导出 `calculateReadingTime(markdown, wpm = 220): number`；统计可见字词（剔除代码块围栏与 frontmatter 后用 `\S+` 分词），向上取整至 1 分钟下限
    - _Requirements: 8.2, 9.1_
  - [ ] 10.2* 为 `calculateReadingTime` 编写单元测试
    - 覆盖：空字符串 → 1；仅代码块 → 1；已知字数的正文 → 期望分钟数；含 Unicode 与多空白
    - _Requirements: 8.2, 9.1_

- [x] 11. Checkpoint - 纯逻辑层全部通过
  - 运行 `npm run test`，确认所有 lib/ 单元测试与属性测试通过；若任一失败请回到对应任务修复
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. 实现博客数据层与上下篇导航
  - [x] 12.1 实现 `src/data/posts.ts`
    - 使用 `import.meta.glob("../content/posts/*.md", { as: "raw", eager: true })` 加载原始字符串
    - 对每个条目：`gray-matter` 解析 → `parseFrontmatter` 校验 → `slugFromFilename` 取 slug → `calculateReadingTime` → `extractToc` 填充 `toc` → 保留 `contentRaw`
    - 对结果数组调用 `sortByDateDesc` 并导出 `posts`
    - 导出 `getPostBySlug(slug: string): BlogPost | undefined` 与 `computePrevNext(posts, index): { prev: BlogPost | null, next: BlogPost | null }`
    - _Requirements: 8.1, 9.1, 9.6, 9.7_
  - [ ]* 12.2 为 `getPostBySlug` 与 `computePrevNext` 编写属性测试
    - **Property 10: 博客 slug 查找与上下篇导航的全序性**
    - **Validates: Requirements 9.6, 9.7**
    - 文件 `src/data/__tests__/posts.prop.test.ts`；生成随机 posts 数组与随机 slug（混合命中与不命中），断言 `getPostBySlug` 的两分支行为；对任意合法索引断言 `prev/next` 与相邻位置一致，边界索引返回 `null`
    - _Requirements: 9.6, 9.7_

- [x] 13. 实现主题系统
  - [x] 13.1 实现 `src/theme/ThemeContext.tsx` 与 `useTheme` hook
    - `ThemeProvider` 初始化顺序：`readStoredTheme()` → 合法则用；否则 `window.matchMedia('(prefers-color-scheme: dark)').matches` 决定
    - `setTheme` 与 `toggleTheme` 同步：`document.documentElement.classList` 切换 `light`/`dark`，`writeStoredTheme` 持久化
    - 导出 `useTheme()` hook
    - _Requirements: 3.1, 3.4, 3.5, 3.6, 3.7_
  - [x] 13.2 在 `index.html` 注入 FOUC 预防脚本
    - 在 `<head>` 内联脚本：读 `localStorage.theme`，不合法则 fallback 至 `prefers-color-scheme`，在 React 挂载前给 `<html>` 加 `light` 或 `dark` 类
    - _Requirements: 3.6, 3.8_
  - [x] 13.3 实现 `src/components/ui/ThemeToggle.tsx`
    - 图标按钮（太阳/月亮，按 theme 切换），`aria-label="Toggle theme"`、`aria-pressed={theme === "dark"}`；点击调用 `toggleTheme`
    - _Requirements: 3.3, 3.4, 13.1, 13.4_
  - [ ] 13.4* 为 ThemeContext 与 ThemeToggle 编写组件测试
    - mock `window.matchMedia` 与 `localStorage`；覆盖：首次访问 + prefers-dark → dark；首次 + prefers-light → light；已存 "dark" → dark；已存非法值 → 回退 prefers；点击 toggle 后 `<html>` class 与 localStorage 同步
    - _Requirements: 3.2, 3.4, 3.5, 3.6, 3.7_

- [x] 14. 实现全局样式系统与玻璃拟态原子组件
  - [x] 14.1 在 `src/styles/globals.css` 写入 CSS 变量与全局过渡
    - 按 design.md 定义 `:root, html.light` 与 `html.dark` 两组 token（`--bg-from/to`、`--glass-bg`、`--glass-border`、`--text-primary/secondary`、`--accent`）
    - 写入 `@media (prefers-reduced-motion: no-preference) { * { transition: ... 300ms; } }` 以满足配色过渡与 reduced-motion 两条约束
    - _Requirements: 1.4, 3.8, 14.3_
  - [x] 14.2 配置 Tailwind 插件定义 `.glass` / `.glass-strong` 组件类
    - 在 `tailwind.config.ts` 中通过 `addComponents` 注册，使透明度（0.1–0.3）、blur（8–24px）、border（1px，透明度 0.15–0.35）、shadow（扩散 16–48px）、圆角数值集中在此
    - _Requirements: 1.1, 1.2, 1.3, 1.5_
  - [x] 14.3 实现 `GlassCard`、`GlassButton`、`GlassInput` 原子组件
    - `src/components/glass/GlassCard.tsx`：支持 `as`、`variant: "default" | "strong"`、`className`、`children`
    - `GlassButton` / `GlassInput`：统一 focus ring（`focus-visible:ring-2 ring-[var(--accent)]`），透传 `aria-label`、`aria-describedby`、`disabled`
    - _Requirements: 1.1, 1.3, 1.5, 1.6, 13.1, 13.4_

- [x] 15. 实现动画相关 hook
  - [x] 15.1 实现 `src/hooks/useReducedMotion.ts`
    - 直接 re-export framer-motion 的 `useReducedMotion` 或自实现基于 `matchMedia("(prefers-reduced-motion: reduce)")`
    - _Requirements: 14.3_
  - [x] 15.2 实现 `src/hooks/useInView.ts`
    - 基于 IntersectionObserver，返回 `[ref, inView]`
    - _Requirements: 14.2_
  - [x] 15.3 实现 `src/hooks/useScrollSpy.ts`
    - 接收 id 列表，使用 IntersectionObserver 跟踪视口内标题，返回当前 active id
    - _Requirements: 9.5_
  - [ ] 15.4* 为三个 hook 编写单元测试
    - mock IntersectionObserver 与 matchMedia；覆盖订阅/取消订阅清理
    - _Requirements: 9.5, 14.2, 14.3_

- [x] 16. 实现布局组件
  - [x] 16.1 实现 `GradientBackground`
    - `fixed inset-0 -z-10 bg-gradient-to-br from-[var(--bg-from)] to-[var(--bg-to)]`
    - _Requirements: 1.4_
  - [x] 16.2 实现 `Footer`
    - 使用 `<footer>` 语义标签与 `.glass` 样式；渲染 `© {年份} {author.name}` 与社交图标链接（`aria-label` 明确）
    - _Requirements: 11.1, 11.2, 11.3, 13.4, 13.5_
  - [x] 16.3 实现 `NavBar` 与 `MobileMenu`
    - 桌面：渲染 `Home/About/Projects/Blog/Contact` 链接 + `<ThemeToggle>`；应用 `glass-strong sticky top-0 z-50`
    - 当前路由链接设 `aria-current="page"` 与视觉高亮（下划线 + 主色）
    - 视口 <768px：折叠为汉堡按钮（`aria-label="Open menu"`、`aria-expanded`）；点击展开 `MobileMenu`（全屏 `.glass` 抽屉，含同样链接）
    - 使用语义化 `<header><nav>` 包裹
    - _Requirements: 2.4, 2.5, 4.2, 4.3, 4.4, 4.6, 13.1, 13.2, 13.4, 13.5, 13.6_
  - [ ]* 16.4 为 NavBar 编写渲染属性测试
    - **Property 11: NavBar 当前路由恰好有一条 aria-current 链接**
    - **Validates: Requirements 4.4, 13.6**
    - 文件 `src/components/layout/__tests__/NavBar.prop.test.tsx`；arbitrary 为 `fc.constantFrom("/", "/about", "/projects", "/blog", "/contact")`；用 `MemoryRouter initialEntries={[r]}` 渲染 `<NavBar />`，查询 `[aria-current="page"]` 数量等于 1 且 href 匹配；对 `/blog/xyz` 断言匹配到 `/blog` 一条或 0 条（采用"前缀匹配 `/blog` 的链接"策略，实现与断言保持一致）
    - _Requirements: 4.4, 13.6_
  - [x] 16.5 实现 `PageTransition`
    - 使用 `framer-motion` 的 `AnimatePresence mode="wait"` + `motion.div`；默认 `initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}`
    - 当 `useReducedMotion()` 返回 `true`：`initial === animate`（都为 `{opacity:1}`）且 `transition.duration === 0`
    - _Requirements: 14.1, 14.3_
  - [ ]* 16.6 为 `PageTransition` 编写 reduced-motion 属性测试
    - **Property 13: prefers-reduced-motion 下动画被禁用**
    - **Validates: Requirement 14.3**
    - 文件 `src/components/ui/__tests__/PageTransition.prop.test.tsx`；参数化 mock `useReducedMotion()`，当为 true 时断言传给 `motion.div` 的 `transition.duration === 0` 且 `initial` 与 `animate` 相等
    - _Requirements: 14.3_
  - [x] 16.7 实现 `Layout`
    - `<GradientBackground /> <header><NavBar /></header> <main><PageTransition><Suspense fallback={<FullScreenSkeleton/>}><Outlet/></Suspense></PageTransition></main> <Footer />`
    - _Requirements: 4.6, 4.7, 12.3, 13.5, 14.1_

- [x] 17. 配置路由并装配 App
  - [x] 17.1 实现 `src/router.tsx`
    - 使用 `createBrowserRouter`；`Home` 直接导入，其余页面用 `React.lazy`；路由表按 design.md 定义
    - _Requirements: 4.1, 4.5, 12.3_
  - [x] 17.2 实现 `src/App.tsx` 与 `src/main.tsx`
    - `App` 返回 `<ThemeProvider><RouterProvider router={router} /></ThemeProvider>`
    - `main.tsx` 调用 `createRoot(document.getElementById("root")!).render(<App />)`
    - _Requirements: 3.1, 4.1_

- [x] 18. 实现 Home 页面
  - [x] 18.1 实现 `HeroSection`
    - 容器 `min-h-[80vh]` 保证桌面高度在 70–100% 之间；渲染 `author.name`、`author.headline`、简短描述（`author.bio` 的前若干字符或独立字段）与两个 CTA：主按钮 "View Projects" → `/projects`，次按钮 "Get in Touch" → `/contact`
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 18.2 实现 `FeaturedProjects` 与 `LatestPosts`
    - `FeaturedProjects`：取 `projects.filter(p => p.featured).slice(0, 3)`，渲染为 `<ProjectCard>` 网格（此时使用任务 19.1 的组件，故此任务需在 19.1 之后）
    - `LatestPosts`：取 `posts.slice(0, 3)`，渲染为 `<BlogCard>` 网格（依赖任务 20.1）
    - 组装 `src/pages/Home.tsx`：Hero + FeaturedProjects + LatestPosts，使用 `useInView` 为各区块添加进入动画
    - _Requirements: 5.4, 5.5, 14.2_
  - [ ] 18.3* 为 Home 编写组件测试
    - 用 `MemoryRouter` 渲染；断言 Hero 文本出现、精选项目卡片数量 ≤ 3、最新博客卡片数量 ≤ 3、CTA 链接 href 正确
    - _Requirements: 5.1–5.5_

- [x] 19. 实现 Projects 页面
  - [x] 19.1 实现 `ProjectCard`
    - `<GlassCard as="article">`：封面 `<img loading="lazy" alt={p.name}>`、`<h3>{p.name}</h3>`、描述、`TagPill` 列表、`p.links.map(l => <a href={l.href} aria-label={l.label}>)`
    - 悬停态：`hover:shadow-2xl hover:scale-[1.02] transition duration-300`，在 `useReducedMotion` 时去掉 `scale`
    - _Requirements: 7.2, 7.3, 7.4, 12.4, 13.3, 13.4_
  - [ ]* 19.2 为 `ProjectCard` 编写渲染属性测试
    - **Property 7: ProjectCard 完整渲染项目信息**
    - **Validates: Requirements 7.2, 7.3**
    - 文件 `src/components/project/__tests__/ProjectCard.prop.test.tsx`；使用 `projectArb`（含随机 name/description/tags/links）；断言：name 与 description 可见、每个 tag 出现、每个 link 对应 `<a href={...}>`、`<img>` 有 `alt`
    - _Requirements: 7.2, 7.3_
  - [x] 19.3 实现 `TagFilter`、`TagPill` 与 `EmptyState` UI 组件
    - `TagFilter`：展示 "All" + 所有唯一 tag 为可切换按钮（role=group + aria-pressed），单选模式
    - `TagPill`：小圆角玻璃 pill 展示 tag 文本
    - `EmptyState`：居中显示 icon + 传入文案
    - _Requirements: 7.5, 7.7_
  - [x] 19.4 实现 `src/pages/Projects.tsx`
    - 状态：`selectedTag: string | null`
    - 列表计算：`filterProjectsByTag(projects, selectedTag)`
    - 布局：`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
    - 当结果为空时渲染 `<EmptyState text="No projects match this tag." />`
    - _Requirements: 2.7, 7.1, 7.5, 7.6, 7.7_
  - [ ]* 19.5 为 Projects 页面的图片属性编写渲染属性测试
    - **Property 12: 列表页图片的 alt 与 lazy 属性完备性（projects 部分）**
    - **Validates: Requirements 12.4, 13.3**
    - 文件 `src/pages/__tests__/Projects.prop.test.tsx`；生成随机 `projects` 注入（可通过 vi.mock 或 props 注入方案），断言渲染后每个 `<img>` 有 `alt` 属性且 `loading === "lazy"`
    - _Requirements: 12.4, 13.3_

- [x] 20. 实现 Blog List 页面
  - [x] 20.1 实现 `BlogCard`
    - `<GlassCard as="article">` 内渲染：标题、发布日期（人类可读格式）、阅读时长（"X min read"）、摘要、tag 列表；整卡作为 `<Link to={/blog/${slug}}>`
    - 封面图（若有）`<img loading="lazy" alt={title}>`
    - _Requirements: 8.2, 8.3, 12.4, 13.3_
  - [ ]* 20.2 为 `BlogCard` 编写渲染属性测试
    - **Property 8 (card 部分): BlogCard 渲染完整性**
    - **Validates: Requirement 8.2**
    - 文件 `src/components/blog/__tests__/BlogCard.prop.test.tsx`；生成随机 `BlogPost`；断言 title、日期、readingTime、summary、每个 tag 均出现
    - _Requirements: 8.2_
  - [x] 20.3 实现 `SearchBox` 与 `Pagination` UI 组件
    - `SearchBox`：受控 `<GlassInput>` + `aria-label`，通过 props onChange 上抛
    - `Pagination`：展示 `< 1 2 3 ... N >`，当前页 `aria-current="page"`
    - _Requirements: 8.5, 8.6, 13.1, 13.4_
  - [x] 20.4 实现 `src/pages/BlogList.tsx`
    - 状态：`selectedTag`、`query`、`page`
    - Pipeline：`posts → sortByDateDesc → filterPostsByTag → searchPostsByTitle → paginate(page, perPage=6)`
    - 布局：`grid grid-cols-1 lg:grid-cols-2 gap-6`
    - 当 `total > perPage` 时渲染 `<Pagination>`
    - _Requirements: 2.8, 8.1, 8.3, 8.4, 8.5, 8.6_
  - [ ]* 20.5 为 BlogList 页面的图片属性编写渲染属性测试
    - **Property 12: 列表页图片的 alt 与 lazy 属性完备性（blog 部分）**
    - **Validates: Requirements 12.4, 13.3**
    - 文件 `src/pages/__tests__/BlogList.prop.test.tsx`；生成随机 `posts` 注入；断言渲染后每个 `<img>` 有 `alt` 且 `loading === "lazy"`
    - _Requirements: 12.4, 13.3_

- [x] 21. 实现 Blog Post 页面
  - [x] 21.1 实现 `PostHeader`
    - 渲染标题、日期、作者（若有）、阅读时长、tag 列表
    - _Requirements: 9.1_
  - [x] 21.2 实现 `TableOfContents`
    - 从 `post.toc` 渲染嵌套列表链接（锚点 `#id`），使用 `useScrollSpy` 高亮当前 active id 并加 `aria-current="true"`
    - 桌面 `sticky top-20`，移动端置顶折叠
    - _Requirements: 9.4, 9.5, 13.6_
  - [x] 21.3 实现 `PrevNextNav`
    - 在文末渲染 prev/next 链接，调用 `computePrevNext(posts, index)`
    - _Requirements: 9.6_
  - [x] 21.4 实现 `src/pages/BlogPost.tsx`
    - `useParams` 取 `slug` → `getPostBySlug`
    - 未找到：渲染 `NotFoundPost`（含返回 `/blog` 的链接）
    - 命中：渲染 `<PostHeader>` + 两栏 `lg:grid-cols-[1fr_240px]`；主列 `<article>` 内用 `<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, rehypePrettyCode]}>{post.contentRaw}</ReactMarkdown>`；侧栏 `<TableOfContents items={post.toc}>`
    - 文末渲染 `<PrevNextNav>`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.6, 9.7, 13.5_
  - [ ]* 21.5 为 BlogPost 渲染编写属性测试
    - **Property 8 (post 部分): BlogPost 渲染完整性**
    - **Validates: Requirement 9.1**
    - 文件 `src/pages/__tests__/BlogPost.prop.test.tsx`；生成随机 post 并 mock `getPostBySlug` 返回；断言 title、日期、作者（当存在）、readingTime、每个 tag 均出现在 DOM
    - _Requirements: 9.1_
  - [ ]* 21.6 为 NotFoundPost 分支编写组件测试
    - mock `getPostBySlug` 返回 `undefined`；断言"文章未找到"文案与返回 `/blog` 链接存在
    - _Requirements: 9.7_

- [x] 22. 实现 About 页面
  - [x] 22.1 实现 `SkillsSection` 与 `TimelineSection`
    - `SkillsSection`：响应式网格渲染 `author.skills`（图标 + 名称）
    - `TimelineSection`：竖向时间线，按 `start` 倒序，渲染 `TimelineItem`（时间段、title、org、description）
    - _Requirements: 6.3, 6.4_
  - [x] 22.2 实现 `src/pages/About.tsx`
    - 渲染作者头像（`<img alt={author.name}>`）、姓名、headline tag、bio 段落、`SkillsSection`、`TimelineSection`
    - `WHERE author.resumeUrl 存在`：渲染 `<a href={resumeUrl} download>Download Resume</a>` 按钮
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 13.3_
  - [ ] 22.3* 为 About 编写组件测试
    - 覆盖：有/无 `resumeUrl` 两分支；头像 `alt` 存在；姓名/headline/bio 文本出现；技能与时间线条目数与数据长度一致
    - _Requirements: 6.1–6.5_

- [x] 23. 实现 Contact 页面与表单提交
  - [x] 23.1 实现 `SocialLinks`
    - 渲染 `author.social` 图标链接，每个 `aria-label={label}` 与 `rel="noopener noreferrer"`；外链 `target="_blank"`
    - _Requirements: 10.2, 13.4_
  - [x] 23.2 实现 `ContactForm`
    - 受控表单字段 `name/email/subject/message`；状态 `errors`、`status: "idle" | "submitting" | "success" | "error"`
    - 提交时先调用 `validateContactForm`；有错误则在对应字段下方渲染错误文本，字段加 `aria-invalid="true"` 与 `aria-describedby`；阻止提交
    - 通过校验：`status="submitting"`、`GlassButton disabled={true}`、调用 `emailjs.send(serviceId, templateId, values, publicKey)`（从 `import.meta.env.VITE_EMAILJS_*` 读取，在入口校验缺失并降级）
    - 成功：清空字段、`status="success"`、渲染成功提示（`role="status"`）
    - 失败：`status="error"`、渲染错误提示（`role="alert"`）、允许重试
    - _Requirements: 10.1, 10.3, 10.4, 10.5, 10.6, 10.7_
  - [x] 23.3 实现 `src/pages/Contact.tsx`
    - 两栏：左 `<ContactForm />`、右 `<SocialLinks />`（移动端堆叠）
    - _Requirements: 10.1, 10.2_
  - [ ] 23.4* 为 ContactForm 编写组件测试
    - 覆盖：空字段提交 → 三条错误提示 + 未调用 `emailjs.send`；合法字段 + mock 成功 → 字段清空 + 成功提示；mock 拒绝 → 错误提示 + 按钮恢复；submitting 态按钮 disabled
    - _Requirements: 10.3–10.7_

- [x] 24. 实现 NotFound 页面
  - [x] 24.1 实现 `src/pages/NotFound.tsx`
    - 玻璃拟态容器渲染 404 标题 + 提示 + "Back to Home" 按钮链接至 `/`
    - _Requirements: 4.5_
  - [ ] 24.2* 为 NotFound 编写组件测试
    - 断言存在返回 `/` 的链接与 404 文本
    - _Requirements: 4.5_

- [x] 25. 实现加载占位（骨架屏）
  - [x] 25.1 实现 `Skeleton` 与 `FullScreenSkeleton`
    - `Skeleton`：支持 `width/height/rounded` props 的占位 `<div>`，带呼吸动画（reduced-motion 下禁用）
    - `FullScreenSkeleton`：组合版，供 `Suspense fallback` 使用
    - _Requirements: 12.2, 14.3_
  - [x] 25.2 将 `Skeleton` 应用到图片加载占位
    - `ProjectCard` / `BlogCard` / About 头像：在图片加载完成前显示 `Skeleton`，`onLoad` 后切换
    - _Requirements: 12.2_

- [x] 26. Checkpoint - 组件层全部通过
  - 运行 `npm run test`，确认全部单元 + 组件 + 属性测试通过
  - Ensure all tests pass, ask the user if questions arise.

- [x] 27. 可访问性收尾
  - [x] 27.1 语义化标签审核
    - 检查并修正：每页只有一个 `<main>`、`<header>/<nav>/<footer>` 唯一、文章内容用 `<article>`、侧栏用 `<aside>`、表单控件都有 `<label>` 或 `aria-label`
    - _Requirements: 13.5_
  - [x] 27.2 键盘可达性审核
    - 全站 Tab 顺序检查；为所有仅含图标的按钮补 `aria-label`；焦点环 `focus-visible` 可见
    - _Requirements: 13.1, 13.2, 13.4_
  - [x] 27.3 图片 alt 审核
    - 确认装饰性图片 `alt=""`、内容性图片 `alt` 有意义；`<img>` 默认启用 `loading="lazy"`（除 Hero/LCP 图片外显式豁免）
    - _Requirements: 13.3, 12.4_

- [x] 28. 性能优化
  - [x] 28.1 验证代码分割
    - 运行 `npm run build`，检查 `dist/assets/` 至少包含 About/Projects/BlogList/BlogPost/Contact/NotFound 各自的独立 chunk
    - _Requirements: 12.3_
  - [x] 28.2 验证懒加载覆盖
    - 编写脚本或测试枚举 Projects 与 BlogList 渲染后的 `<img>`，确认 `loading="lazy"` 已应用
    - _Requirements: 12.4_
  - [ ] 28.3* 为懒加载属性编写聚合属性测试
    - 合并 Property 12 的 projects 与 blog 两部分，在本任务下跑一次统一断言
    - _Requirements: 12.4, 13.3_

- [ ] 29. E2E 与可访问性自动化测试
  - [ ]* 29.1 导航与 aria-current E2E
    - Playwright 脚本：从 `/` 出发依次点击 NavBar 各链接；断言 URL 切换（无整页刷新 via `page.on("framenavigated")`）与 `[aria-current="page"]` 指向正确链接
    - _Requirements: 4.3, 4.4, 13.6_
  - [ ]* 29.2 主题持久化与无 FOUC E2E
    - 访问 `/` → 点击 ThemeToggle → 检查 `<html>` class 与 `localStorage.theme`；`page.reload()` 后首帧断言 `<html>` 类与期望一致（不闪烁）
    - _Requirements: 3.4, 3.5, 3.6_
  - [ ]* 29.3 博客 404 分支 E2E
    - 访问 `/blog/definitely-not-exists`，断言"文章未找到"文案与返回 `/blog` 链接
    - _Requirements: 9.7_
  - [ ]* 29.4 联系表单 E2E（含 mock EmailJS）
    - 使用 `page.route` 拦截 EmailJS 请求；覆盖：空字段提交显示三条错误；合法字段 + mock 成功 → 成功提示 + 字段清空；mock 失败 → 错误提示
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7_
  - [ ]* 29.5 响应式布局 E2E
    - 在 375 / 768 / 1024 / 1440 四档视口访问每个路由；断言：<768 时汉堡按钮可见、≥768 且 <1024 时 Projects 页两列、≥1024 时三列；各视口下 `document.documentElement.scrollWidth <= clientWidth`（无水平滚动）
    - _Requirements: 2.1–2.7, 2.8_
  - [ ]* 29.6 axe-core 可访问性扫描
    - 用 `@axe-core/playwright` 对 6 个页面在 light 与 dark 主题下各扫描一次，断言无 `serious`/`critical` 违规
    - _Requirements: 1.6, 13.1–13.6_
  - [ ]* 29.7 4G throttling 下首页 LCP 基准
    - Playwright 启 CDP 设置 `Network.emulateNetworkConditions` 至 4G；测量首页 LCP（`PerformanceObserver`），断言 ≤ 3000ms
    - _Requirements: 12.1_

- [x] 30. 最终 Checkpoint
  - 运行 `npm run test` 与 `npm run test:e2e`，确认所有测试通过；运行 `npm run build` 无错误；手动访问 `npm run preview` 确认无控制台错误
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- 标记为 `*` 的子任务是测试或可选类任务，追求极速 MVP 时可跳过；但如需验证设计中的 13 条正确性属性，**所有带 Property N 注释的测试任务都应实现**（Property 1–13 分别映射到任务 3.1、4.1、5.1、6.1、7.1、8.1、19.2、20.2 + 21.5、9.1、12.2、16.4、19.5 + 20.5 + 28.3、16.6）。
- 核心实现任务（未加 `*`）必须全部实现。
- 任务间依赖：`ProjectCard` 先于 Home 与 Projects 页面；`BlogCard` 先于 Home 与 BlogList；`data/posts.ts` 先于所有博客相关页面。
- 完成所有任务后，本工作流产物交付完毕；可从任务列表顶部开始点击 "Start task" 开始执行。
