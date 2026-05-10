---
title: "个人作品集重写复盘：三周、十二次推翻"
date: "2025-01-09"
tags: ["meta", "design", "react", "vite"]
summary: "记录这次重写过程中的三个关键决定：为什么用 MPA 风格的 SPA、为什么选择运行时渲染 Markdown、以及属性测试如何救了我一次。"
author: "林时南"
cover: "https://picsum.photos/seed/portfolio-postmortem/1200/600"
---

这次重写是我过去三年里对个人网站不满意程度最低的一次。断断续续花了三周，推翻了至少十二次布局。写下这篇复盘，一是自我交代，二是给未来的自己留个参考。

## 决策 1：MPA 风格的 SPA

我最终选择了 React Router v6 + `createBrowserRouter`，并把每个页面作为独立路由处理。这等价于一个"感觉像 MPA"的 SPA：

- 页面间的链接有即时的客户端过渡
- 每个路由都有独立的 code split chunk
- URL 可以直接分享、深链

### 为什么不是 Next.js

对我这种纯静态内容的站点来说，Next.js 的能力过剩。Vite + SPA 的复杂度预算更小，我能更多把时间花在内容和样式上。

## 决策 2：运行时渲染 Markdown

构建期预渲染 Markdown 的好处是运行时零成本，但需要更复杂的 Vite 插件链。对本站这个量级（十几篇文章）而言：

```ts
// src/data/posts.ts
const raw = import.meta.glob("../content/posts/*.md", {
  as: "raw",
  eager: true,
});
```

用 `import.meta.glob` 把原始字符串打到 bundle 里，页面渲染时再用 `react-markdown` 处理。代价是首次渲染 BlogPost 页会引入 markdown 解析器，但这部分属于懒加载 chunk，不影响首页 LCP。

## 决策 3：PBT 不是学院派

写完纯逻辑层之后我补了一批属性测试。一开始我以为是仪式感，结果 `paginate` 函数里真的有一个 off-by-one：

```ts
// 错误版本
const totalPages = Math.ceil(items.length / perPage); // items.length === 0 时返回 0
```

但 fast-check 生成了 `items: []` 的用例，期望 `totalPages === 1`（至少有一页，显示 "No results"）。这就是那种单元测试很容易漏掉、但属性测试一下就能抓到的 bug。

### PBT 的正确姿势

我的三条经验法则：

1. 属性测试必须有**明确的不变量**，别写成"跑一遍不报错"
2. 生成器要覆盖边界（空数组、全空白字符串、Unicode）
3. 失败时别急着改代码，先判断"这是 bug、还是属性写得不对"

> 如果一条属性需要十个条件分支才能判断真假，大概率是你把业务逻辑复制进测试了。

## 性能与 a11y 收尾

最后的几个小改动反而最提升质感：

- 首屏内联了 6 行 JS 预加主题 class，彻底干掉 FOUC
- 全站默认启用 `loading="lazy"`，只对 LCP 图豁免
- `prefers-reduced-motion` 下的 Framer Motion 被整体降级为 `duration: 0`

![postmortem](https://picsum.photos/seed/portfolio-shot/900/400)

## 下一步

短期内不再大改样式。接下来想把精力放回写内容上——毕竟工具做得再好，没人回来看也是枉然。
