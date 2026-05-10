---
title: "Hello, World：这个博客的由来"
date: "2024-01-15"
tags: ["meta", "thoughts"]
summary: "为什么又要折腾一个个人博客？这篇开篇聊聊建站动机与我想在这里写些什么。"
author: "林时南"
cover: "https://picsum.photos/seed/hello-world/1200/600"
---

在折腾过若干个 Hexo、Hugo、Next.js 之后，我又一次推翻重来，用 Vite + React + TypeScript 写了现在这个站点。这篇文章算是开篇，聊聊动机，也顺便作为后续文章的一条索引。

![keyboard](https://picsum.photos/seed/hello-world-inline/900/400)

## 为什么再做一个博客

托管在大厂平台的内容总归不完全属于自己，隔一段时间去翻旧文，常常觉得像在别人家做客。自建站点的好处很朴素：

- 内容与样式都在我手里
- 可以无负担地实验新技术
- 归档与搜索行为完全可控

> "If you want to go fast, go alone. If you want to go far, go together."
> —— 这里引用这句话，更多是提醒自己别一个人闭门造车。

### 我想写什么

大致会围绕三条主线：

1. 前端工程实践（构建工具、性能、设计系统）
2. TypeScript 类型技巧与常见坑
3. 独立开发的阶段性复盘

## 技术选型速记

最终的技术栈非常朴素，核心依赖只有这些：

```ts
// package.json（节选）
{
  "dependencies": {
    "react": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "framer-motion": "^11.3.0",
    "react-markdown": "^9.0.0"
  }
}
```

更详细的选型理由可以参见后续文章，尤其是 [玻璃拟态的实现笔记](./glassmorphism-deep-dive)。如果你对博客源码感兴趣，欢迎去 [GitHub 仓库](https://github.com/linshinan) 逛逛。

希望这个地方能坚持更新得久一点。
