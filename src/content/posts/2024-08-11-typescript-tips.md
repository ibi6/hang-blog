---
title: "日常写业务时用得到的 TypeScript 技巧"
date: "2024-08-11"
tags: ["typescript", "frontend"]
summary: "收集几个我在审查代码时频繁出现在评论里的 TypeScript 技巧，偏实用、不炫技。"
author: "林时南"
---

这篇文章不聊类型体操，只收集那些我在业务代码 Review 时反复写的 TypeScript 小技巧。

## 1. 用 `as const` 收窄字面量

很多状态枚举其实不需要 `enum`，一个 `as const` 数组配合 `typeof` 就够用：

```ts
const STATUSES = ["idle", "loading", "success", "error"] as const;
type Status = (typeof STATUSES)[number];

function render(status: Status) {
  // status 被收窄到四个字面量
}
```

好处是可以直接 `STATUSES.map` 做 UI 渲染，也能被运行时消费。

### 什么时候还是该用 enum

一般只在需要跨语言共享的协议里使用 `enum`（比如后端用 Protobuf 生成的类型）。业务代码里 99% 用 `as const` 更轻量。

## 2. 用 `satisfies` 做类型校验，但保留窄类型

新手写配置常见的两种写法都有缺点：

```ts
// 写法 A：类型被泛化成 Record<string, string>
const routes: Record<string, string> = { home: "/", about: "/about" };

// 写法 B：没有任何校验
const routes = { home: "/", about: "/about" };
```

`satisfies` 可以让类型**既被校验、又保留字面量信息**：

```ts
const routes = { home: "/", about: "/about" } satisfies Record<string, `/${string}`>;
routes.home; // 类型是 "/"，而不是 string
```

## 3. 判别联合（discriminated union）优先于可选字段

这是我 Review 里出现频率最高的评论之一：

```ts
// 不推荐：各字段互相独立可选，容易出现"非法组合"
interface Result {
  ok?: boolean;
  data?: T;
  error?: Error;
}

// 推荐：用 kind 做判别
type Result<T> =
  | { kind: "ok"; data: T }
  | { kind: "error"; error: Error };
```

判别联合能让下游消费方通过 `switch (r.kind)` 自动获得完整的窄类型推断。

## 4. `never` 用于穷尽检查

```ts
function handle(r: Result<string>) {
  switch (r.kind) {
    case "ok":
      return r.data;
    case "error":
      return r.error.message;
    default:
      // 当未来有人新增 kind 时会在编译期就失败
      const _exhaustive: never = r;
      return _exhaustive;
  }
}
```

## 5. 别把类型写到"业务边界"之外

最后一个不算技术性技巧，但很重要：

> 类型是内部约束，边界（HTTP、LocalStorage、URL）外的数据都是 `unknown`。

![typescript-tips](https://picsum.photos/seed/ts-tips/900/400)

在边界处用 `zod` 或手写 guard 做一次校验，中间层才有资格相信数据形状。
