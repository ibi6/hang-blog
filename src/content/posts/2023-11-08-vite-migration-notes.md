---
title: "从 webpack 迁移到 Vite 的那些不显眼的坑"
date: "2023-11-08"
tags: ["vite", "frontend", "tooling"]
summary: "迁移完成后 CI 能跑、本地能开，并不代表就完事了。记录一些只有在生产环境才会浮出的问题。"
author: "林时南"
---

迁移到 Vite 的收益在本地开发体验上显而易见：冷启动从 30s 变成 300ms 是会让人上瘾的。但真正让我头疼的，是那些在 CI 通过、本地也正常，却在生产环境悄悄出问题的坑。

## 坑 1：环境变量命名空间

webpack 时代大家习惯 `process.env.XXX`，Vite 默认只暴露 `import.meta.env.VITE_*` 前缀的变量。迁移脚本里我用了一个简单的 grep 做批量替换：

```bash
rg -l "process\\.env\\." src | xargs sed -i "s/process\\.env\\./import.meta.env./g"
```

但真正的坑在于**三方库内部仍然在读 `process.env.NODE_ENV`**。需要在 `vite.config.ts` 里显式 define：

```ts
export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "production"),
  },
});
```

### 顺带一提：`.env` 的加载顺序

Vite 的 `.env` 加载顺序比 webpack 复杂一些，容易被忽略：

1. `.env`
2. `.env.local`
3. `.env.[mode]`
4. `.env.[mode].local`

后加载的会覆盖前面的。如果你在 `.env.production` 里覆盖某个值但没生效，先检查是不是 `.env.local` 里残留了旧值。

## 坑 2：依赖预构建与 SSR 表现不同

Vite 对 ESM 依赖做了预构建优化，但在 SSR 或老旧 CJS 依赖上行为会有差异。典型例子：

```ts
// CJS 库暴露为 default 导出，Vite 可能把它挂成 named
import _ from "lodash"; // 在 CJS 下是默认导出
import { debounce } from "lodash"; // 在 Vite 下更推荐
```

如果迁移过程中遇到 "xxx is not a function"，90% 的情况都是 CJS/ESM 互操作没处理好。

## 坑 3：构建产物的静态资源路径

Vite 默认把静态资源放在 `/assets/` 下，并生成 hash 文件名。当你把产物部署到 CDN 子路径（比如 `/static/`）时，需要在配置里显式声明：

```ts
export default defineConfig({
  base: process.env.DEPLOY_BASE || "/",
});
```

忘掉这一步会表现为"HTML 加载成功但静态资源 404"。

> 这是我迁移过程中最难发现的一类 bug，因为本地开发时一切正常。

## 小结

Vite 的默认值对新项目非常友好，但对历史项目迁移来说，有几个假设需要被显式打破：

- `process.env` 不再自动暴露
- 依赖互操作更严格
- 构建基础路径必须显式

![migration](https://picsum.photos/seed/vite-migration/900/400)

如果你正打算开启一次迁移，建议先在一个小规模的子包上试点两周再决定。
