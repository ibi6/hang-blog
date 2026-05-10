---
title: "玻璃拟态（Glassmorphism）深入指南"
date: "2024-05-20"
tags: ["css", "design", "tailwind"]
summary: "从透明度、blur、border、shadow 四个维度拆解玻璃拟态，并给出一套可配置的 Tailwind 实现。"
author: "林时南"
cover: "https://picsum.photos/seed/glassmorphism/1200/600"
---

玻璃拟态这几年在设计界时髦又"土"：做得好像 iOS 控制中心，做得不好就像磨砂塑料袋。这篇文章系统聊一下我在本站使用的那套实现。

## 四个可调参数

做玻璃拟态的关键其实就是四个 CSS 属性的组合：

1. `background-color` 的透明度（0.1–0.3）
2. `backdrop-filter: blur(...)` 的半径（8–24px）
3. 1px 的半透明 border（0.15–0.35）
4. `box-shadow` 的扩散半径（16–48px）

任何一个参数调过头，都会让卡片看起来"太塑料"。

### 关键：渐变背景是灵魂

玻璃拟态需要有底色变化才能体现质感。纯白背景上再 blur 也看不出效果。本站用一层固定的 `fixed inset-0 -z-10` 渐变承载：

```css
:root, html.light {
  --bg-from: #fce7f3;
  --bg-to:   #dbeafe;
}
html.dark {
  --bg-from: #0f172a;
  --bg-to:   #1e1b4b;
}
```

## Tailwind 的 `.glass` utility

我把这四个参数集中在 `tailwind.config.ts` 里：

```ts
import plugin from "tailwindcss/plugin";

export default {
  plugins: [
    plugin(({ addComponents }) => {
      addComponents({
        ".glass": {
          backgroundColor: "rgb(var(--glass-bg) / 0.18)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgb(var(--glass-border) / 0.25)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.12)",
          borderRadius: "1rem",
        },
      });
    }),
  ],
};
```

这样任何地方只要加上 `className="glass"`，参数就会被统一管理。当设计系统需要调整时，改一处即可。

## 可访问性与性能

玻璃拟态有几个容易被忽略的坑：

- 文字对比度：半透明背景会让低对比度的文本难以阅读，务必对主文本使用更实的颜色变量
- 滚动性能：`backdrop-filter` 对 GPU 有一定成本，一个页面里堆 50 个玻璃卡会开始掉帧
- Safari 兼容：务必同时写 `-webkit-backdrop-filter`

> 一句不完美的经验：玻璃拟态是"点缀"，不是"基建"。

## 深浅主题的一致性

我选择让 `--glass-bg` 在浅色是白色、在深色是深蓝色，两边的透明度保持一致，这样卡片在两种主题下都有一致的厚度感。

![glass-mock](https://picsum.photos/seed/glass-mock/900/400)

希望这套参数能作为你的起点。
