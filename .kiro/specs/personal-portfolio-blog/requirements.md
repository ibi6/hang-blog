# Requirements Document

## Introduction

本特性旨在构建一个个人作品集与博客网站（Personal Portfolio Blog），采用玻璃拟态（Glassmorphism）设计风格，基于 React + Tailwind CSS 实现。网站需要支持响应式布局，覆盖桌面、平板与手机三类设备，并提供深色/浅色两种主题。网站包含首页（Hero）、关于、项目展示、博客列表、博客详情、联系、导航与页脚共 8 个主要模块/页面。

## Glossary

- **Portfolio_Site**: 本特性所构建的个人作品集与博客站点整体。
- **UI_System**: 前端视觉与交互系统，负责渲染组件、处理布局与主题。
- **Theme_Manager**: 管理浅色（Light）与深色（Dark）两种主题切换与持久化的子系统。
- **Router**: 负责页面路由与导航的前端路由子系统。
- **Navigation_Bar**: 网站顶部导航组件，包含站点 Logo、页面链接与主题切换控件。
- **Footer**: 网站底部组件，包含版权信息与社交链接。
- **Home_Page**: 首页，展示 Hero 区域、个人简介摘要与精选内容。
- **About_Page**: 关于页面，展示作者个人介绍、技能与经历。
- **Projects_Page**: 项目展示页面，以卡片列表形式呈现作品。
- **Project_Card**: 单个项目的可视化卡片组件，采用玻璃拟态样式。
- **Blog_List_Page**: 博客列表页面，按时间倒序呈现文章摘要。
- **Blog_Post_Page**: 博客详情页面，渲染单篇文章完整内容。
- **Contact_Page**: 联系页面，包含联系表单与社交方式。
- **Contact_Form**: 联系表单组件，用于提交访客留言。
- **Glassmorphism_Style**: 一种视觉风格，核心特征为半透明背景、背景模糊（backdrop-filter: blur）、细边框、柔和阴影与彩色渐变底层。
- **Responsive_Layout**: 能够根据视口宽度自适应的布局策略，覆盖桌面（≥1024px）、平板（≥768px 且 <1024px）、手机（<768px）三档断点。
- **Light_Theme**: 以明亮色调为主的配色方案。
- **Dark_Theme**: 以深色调为主的配色方案。
- **Viewport**: 浏览器可视区域，其宽度用于响应式断点判断。
- **Accessible_Contrast**: 前景文本与其所在玻璃卡片背景之间的对比度，符合 WCAG 2.1 AA 等级的最低阈值（正文 4.5:1，大号文本 3:1）。

## Requirements

### Requirement 1: 玻璃拟态视觉风格

**User Story:** As a 访客, I want 网站整体呈现统一的玻璃拟态视觉风格, so that 我能获得现代、有质感的浏览体验。

#### Acceptance Criteria

1. THE UI_System SHALL 在所有主要容器组件（导航栏、卡片、弹层、表单容器）上应用半透明背景（背景色透明度介于 0.1 至 0.3 之间）。
2. THE UI_System SHALL 在所有玻璃拟态容器上应用背景模糊效果（backdrop-filter: blur），模糊半径介于 8px 至 24px 之间。
3. THE UI_System SHALL 为每个玻璃拟态容器渲染 1px 宽度的细边框，边框颜色为白色或浅色，且透明度介于 0.15 至 0.35 之间。
4. THE UI_System SHALL 在页面根层渲染彩色渐变背景层，作为玻璃拟态效果的视觉底色。
5. THE UI_System SHALL 为每个玻璃拟态容器应用柔和阴影，阴影扩散半径介于 16px 至 48px 之间。
6. WHERE 文本被渲染在玻璃拟态容器之上，THE UI_System SHALL 保证文本与容器可视背景之间达到 Accessible_Contrast 定义的对比度阈值。

### Requirement 2: 响应式布局

**User Story:** As a 访客, I want 网站在不同设备上都能正确展示, so that 我可以在桌面、平板和手机上都获得良好的阅读与浏览体验。

#### Acceptance Criteria

1. WHEN Viewport 宽度 ≥1024px, THE UI_System SHALL 以桌面布局渲染所有页面。
2. WHEN Viewport 宽度 ≥768px 且 <1024px, THE UI_System SHALL 以平板布局渲染所有页面。
3. WHEN Viewport 宽度 <768px, THE UI_System SHALL 以手机布局渲染所有页面。
4. WHEN Viewport 宽度 <768px, THE Navigation_Bar SHALL 折叠为汉堡菜单形式。
5. WHEN 用户在手机布局下点击汉堡菜单图标, THE Navigation_Bar SHALL 展开完整的页面链接列表。
6. THE UI_System SHALL 保证在 320px 至 1920px 之间的任意 Viewport 宽度下，页面内容均不出现水平滚动条。
7. THE Projects_Page SHALL 在桌面布局下以三列网格渲染 Project_Card，在平板布局下以两列网格渲染，在手机布局下以单列渲染。
8. THE Blog_List_Page SHALL 在桌面布局下以两列网格渲染文章卡片，在平板与手机布局下以单列渲染。

### Requirement 3: 深色与浅色主题切换

**User Story:** As a 访客, I want 能够在深色和浅色主题之间切换, so that 我可以在不同光照环境下舒适阅读。

#### Acceptance Criteria

1. THE Theme_Manager SHALL 提供 Light_Theme 与 Dark_Theme 两种主题。
2. WHEN 访客首次访问 Portfolio_Site 且未存在已保存的主题设置, THE Theme_Manager SHALL 根据操作系统的 prefers-color-scheme 媒体查询结果设置初始主题。
3. THE Navigation_Bar SHALL 渲染一个主题切换控件。
4. WHEN 访客点击主题切换控件, THE Theme_Manager SHALL 在 Light_Theme 与 Dark_Theme 之间切换当前主题。
5. WHEN 主题被切换, THE Theme_Manager SHALL 将新的主题值持久化到浏览器 localStorage 中，键名为 "theme"。
6. WHEN 访客在已持久化主题的状态下再次访问 Portfolio_Site, THE Theme_Manager SHALL 在首屏渲染前读取 localStorage 中的主题值并应用。
7. IF localStorage 中的主题值既不是 "light" 也不是 "dark", THEN THE Theme_Manager SHALL 回退到根据 prefers-color-scheme 决定的主题。
8. THE UI_System SHALL 在主题切换后的 300ms 内完成所有组件的配色过渡。

### Requirement 4: 页面路由与导航

**User Story:** As a 访客, I want 能够在不同页面之间顺畅导航, so that 我可以查看我感兴趣的内容。

#### Acceptance Criteria

1. THE Router SHALL 提供以下路由：`/`（Home_Page）、`/about`（About_Page）、`/projects`（Projects_Page）、`/blog`（Blog_List_Page）、`/blog/:slug`（Blog_Post_Page）、`/contact`（Contact_Page）。
2. THE Navigation_Bar SHALL 渲染指向 Home_Page、About_Page、Projects_Page、Blog_List_Page、Contact_Page 的链接。
3. WHEN 访客点击 Navigation_Bar 中的页面链接, THE Router SHALL 在不刷新整个浏览器页面的前提下切换到对应路由。
4. WHEN 当前路由与 Navigation_Bar 中的某条链接匹配, THE Navigation_Bar SHALL 以视觉上可识别的方式高亮该链接。
5. IF 访客访问一个未定义的路由, THEN THE Router SHALL 渲染 404 页面并提供返回 Home_Page 的链接。
6. THE Navigation_Bar SHALL 在所有页面的顶部保持可见。
7. THE Footer SHALL 在所有页面的底部保持可见。

### Requirement 5: 首页 Hero 区域

**User Story:** As a 访客, I want 首页能直观展示作者身份与站点亮点, so that 我能在几秒内了解这是谁的站点以及能找到什么内容。

#### Acceptance Criteria

1. THE Home_Page SHALL 在首屏渲染 Hero 区域，Hero 区域的高度在桌面布局下介于 Viewport 高度的 70% 至 100% 之间。
2. THE Home_Page 的 Hero 区域 SHALL 渲染作者姓名、一句话身份介绍、一段简短描述以及至少一个行动按钮（CTA）。
3. WHEN 访客点击 Hero 区域的主 CTA 按钮, THE Router SHALL 导航至 Projects_Page 或 Contact_Page（按钮的目标路由在实现时确定并在设计阶段明确）。
4. THE Home_Page SHALL 在 Hero 区域之下渲染精选项目区块，展示至多 3 个 Project_Card。
5. THE Home_Page SHALL 在精选项目区块之下渲染最新文章区块，展示至多 3 篇博客摘要。

### Requirement 6: 关于页面

**User Story:** As a 访客, I want 在关于页面详细了解作者, so that 我可以判断作者的专业背景与兴趣是否与我的需求匹配。

#### Acceptance Criteria

1. THE About_Page SHALL 渲染作者头像、姓名、身份标签。
2. THE About_Page SHALL 渲染一段自我介绍正文。
3. THE About_Page SHALL 渲染技能区块，以可视化方式列出作者掌握的技术栈。
4. THE About_Page SHALL 渲染经历时间线区块，按时间倒序展示教育与工作经历。
5. WHERE 作者提供了简历下载链接, THE About_Page SHALL 渲染一个简历下载按钮。

### Requirement 7: 项目展示页面

**User Story:** As a 访客, I want 浏览作者的项目作品, so that 我可以评估作者的能力与风格。

#### Acceptance Criteria

1. THE Projects_Page SHALL 渲染 Project_Card 列表。
2. THE Project_Card SHALL 展示项目封面图、项目名称、简短描述、使用的技术标签。
3. WHERE 项目提供了外部链接（如在线预览或代码仓库）, THE Project_Card SHALL 渲染指向该链接的按钮。
4. WHEN 访客将鼠标悬停在 Project_Card 上（桌面布局）, THE UI_System SHALL 对该卡片应用悬停视觉反馈（如阴影增强或轻微缩放），视觉变化在 300ms 内完成。
5. THE Projects_Page SHALL 提供按技术标签筛选项目的控件。
6. WHEN 访客选择某个技术标签筛选条件, THE Projects_Page SHALL 仅显示包含该标签的 Project_Card。
7. WHEN 筛选结果为空, THE Projects_Page SHALL 渲染一段提示文本告知访客当前筛选无匹配项目。

### Requirement 8: 博客列表页面

**User Story:** As a 访客, I want 浏览博客文章列表, so that 我可以挑选感兴趣的文章阅读。

#### Acceptance Criteria

1. THE Blog_List_Page SHALL 按发布时间倒序渲染博客文章卡片。
2. THE Blog_List_Page 的文章卡片 SHALL 展示文章标题、发布日期、阅读时长估计、摘要、标签。
3. WHEN 访客点击某篇文章卡片, THE Router SHALL 导航至该文章对应的 Blog_Post_Page。
4. THE Blog_List_Page SHALL 渲染按标签筛选的控件。
5. WHERE 文章总数超过每页显示数量, THE Blog_List_Page SHALL 渲染分页控件。
6. THE Blog_List_Page SHALL 渲染搜索输入框，支持按文章标题进行前端过滤。

### Requirement 9: 博客详情页面

**User Story:** As a 访客, I want 阅读完整的博客文章, so that 我可以获取文章提供的信息。

#### Acceptance Criteria

1. THE Blog_Post_Page SHALL 渲染文章标题、发布日期、作者、阅读时长、标签。
2. THE Blog_Post_Page SHALL 渲染文章正文，支持 Markdown 渲染，包括标题、段落、列表、引用、代码块、图片、链接。
3. THE Blog_Post_Page SHALL 为代码块应用语法高亮。
4. THE Blog_Post_Page SHALL 在正文侧边或顶部渲染目录（TOC），目录项点击后跳转至对应小节。
5. WHEN 访客滚动正文时, THE Blog_Post_Page SHALL 在目录中高亮当前正在阅读的小节。
6. THE Blog_Post_Page SHALL 在文章末尾渲染上一篇/下一篇导航链接。
7. IF 访客访问的 `/blog/:slug` 对应的文章不存在, THEN THE Blog_Post_Page SHALL 渲染"文章未找到"提示并提供返回 Blog_List_Page 的链接。

### Requirement 10: 联系页面与表单

**User Story:** As a 访客, I want 通过联系页面与作者沟通, so that 我可以提出合作、咨询或反馈。

#### Acceptance Criteria

1. THE Contact_Page SHALL 渲染 Contact_Form，表单字段包含姓名、邮箱、主题、消息内容。
2. THE Contact_Page SHALL 渲染作者的社交链接区块（如邮箱、GitHub、LinkedIn、Twitter 等）。
3. WHEN 访客提交 Contact_Form, THE Contact_Form SHALL 在提交前校验姓名为非空、邮箱符合 RFC 5322 邮箱格式、消息内容为非空。
4. IF Contact_Form 的任一字段校验失败, THEN THE Contact_Form SHALL 在对应字段下方渲染具体的错误提示文本，并阻止提交。
5. WHEN Contact_Form 校验通过并提交成功, THE Contact_Form SHALL 清空所有字段并渲染提交成功的提示信息。
6. IF Contact_Form 提交过程中发生网络错误, THEN THE Contact_Form SHALL 渲染错误提示并允许访客重试。
7. WHILE Contact_Form 正在提交, THE Contact_Form SHALL 禁用提交按钮以防止重复提交。

### Requirement 11: 页脚

**User Story:** As a 访客, I want 在页脚获取站点附加信息, so that 我可以快速找到版权、社交链接等补充内容。

#### Acceptance Criteria

1. THE Footer SHALL 渲染站点版权声明，包含站点所有者姓名与当前年份。
2. THE Footer SHALL 渲染指向作者社交媒体的图标链接。
3. THE Footer SHALL 以玻璃拟态风格渲染。

### Requirement 12: 性能与加载体验

**User Story:** As a 访客, I want 页面能够快速加载并流畅交互, so that 我不会因等待而离开站点。

#### Acceptance Criteria

1. WHEN 访客首次访问 Home_Page 且网络为 4G 模拟条件, THE UI_System SHALL 在 3000ms 内完成首屏内容的渲染。
2. WHILE 图片正在加载, THE UI_System SHALL 为图片位置渲染占位骨架屏或模糊占位图。
3. THE UI_System SHALL 对非首屏的路由组件应用代码分割（code splitting），在访客导航至对应路由时按需加载。
4. THE UI_System SHALL 对 Blog_List_Page 与 Projects_Page 中首屏之外的图片应用懒加载（loading="lazy"）。

### Requirement 13: 可访问性

**User Story:** As a 使用键盘或辅助技术的访客, I want 能够无障碍地使用网站, so that 我也能获得等同的浏览体验。

#### Acceptance Criteria

1. THE UI_System SHALL 为所有交互元素（链接、按钮、表单控件、主题切换）提供可见的键盘焦点样式。
2. THE UI_System SHALL 保证访客可以仅使用 Tab、Shift+Tab、Enter、空格键完成站点内所有主要导航与交互。
3. THE UI_System SHALL 为所有图片提供 alt 文本。
4. THE UI_System SHALL 为所有仅含图标的按钮提供 aria-label 属性。
5. THE UI_System SHALL 使用语义化 HTML 标签（header、nav、main、article、aside、footer）组织页面结构。
6. WHEN 访客使用屏幕阅读器访问 Navigation_Bar, THE Navigation_Bar SHALL 通过 aria-current 属性标识当前页面链接。

### Requirement 14: 动画与过渡

**User Story:** As a 访客, I want 页面过渡与交互拥有流畅自然的动效, so that 浏览过程愉悦且信息层次清晰。

#### Acceptance Criteria

1. WHEN 访客在路由之间切换, THE UI_System SHALL 对页面主内容区域应用淡入过渡，过渡时长介于 200ms 至 400ms 之间。
2. WHEN 访客滚动页面至某个区块进入 Viewport, THE UI_System SHALL 对该区块应用进入动画（如上移淡入），动画时长介于 300ms 至 600ms 之间。
3. IF 访客操作系统启用了 prefers-reduced-motion 设置, THEN THE UI_System SHALL 禁用或显著降低上述动画与过渡的幅度与时长。
