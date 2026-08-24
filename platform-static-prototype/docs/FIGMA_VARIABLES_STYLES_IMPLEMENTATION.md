# Figma Variables 与 Styles 代码化产品技术方案

## 1. 文档信息

- 状态：Draft
- 更新日期：2026-08-21
- Figma 文件：[InternInkStone 设计稿](https://www.figma.com/file/ZaggbS0TYv1ljbBzqEwc7h?type=design)
- Figma file key：`ZaggbS0TYv1ljbBzqEwc7h`
- 目标项目：`platform-static-prototype/`
- 技术形态：纯静态 HTML、CSS、JavaScript
- 实施状态：第一批已确认 Variables、字体基线、`Title/h1` 与适配 Token 已落地

本文定义 Figma Variables 与 Styles 如何进入代码，并补充跨页面统一的大模块适配原则；不定义具体页面结构、交互流程、组件 DOM 或单页视觉验收结果。第一批公共 Token、基础样式和 Design System 核对页已经按本文实施，Home 等具体页面仍须在取得精确 Frame 后单独实现。

## 2. 数据来源与证据边界

本次通过 Figma 文件级元数据和实际节点的 Variable 使用信息完成盘点；设计系统搜索只用于区分当前文件资产与其他可访问库，不能作为当前文件的资产清单。本阶段没有按页面实现设计。

已确认：

- 文件包含一个顶层 Page：`Page 1`。
- 当前文件的 `libraries_added_to_file` 为空，没有订阅外部设计库。
- 从实际页面节点中可以读取到当前使用的颜色 Variables、圆角 Variables，以及 `Title/h1` Text Style。当前抽样证据包括节点 `139:606`、`155:642`、`198:53298` 和 `198:53299`。
- 设计系统搜索曾返回另一个可访问库；该库没有被当前文件订阅，也没有证据表明它属于本项目，因此完全排除在本文范围外。

当前证据边界：

- 节点级 Variable 读取只证明该节点或子树实际使用了哪些资产，不能据此推导整个文件的 Collection 总数、Variable 总数或 Style 总数。
- 当前尚未取得完整的 Variable Collection 导出数据，因此 Collection 名称、Modes、全部 Variables 和 Alias 链仍待确认。
- 当前尚未完成全文件 Text、Effect、Grid Styles 盘点；没有被实际节点或导出数据直接证明的 Style 名称、数量和参数都不写成已确认事实。
- 后续如再次使用设计系统搜索，必须同时核对 `libraryName`、`libraryKey`、当前文件订阅状态和实际节点引用；不能仅凭名称相似就判定资产归属。

## 3. 设计资产盘点

### 3.1 Variables

以下内容来自实际页面节点，不是设计系统搜索结果：

| 类别 | 已确认 Variable | 当前值 | 默认代码位置 |
| --- | --- | --- | --- |
| 颜色 | `--paper` | `#ffffff` | `shared/css/tokens.css` |
| 颜色 | `--bg` | `#fdfcf8` | `shared/css/tokens.css` |
| 颜色 | `--ink` | `#1a2332` | `shared/css/tokens.css` |
| 颜色 | `--ink-soft` | `#3a4556` | `shared/css/tokens.css` |
| 颜色 | `--bg-soft` | `#f7f4ec` | `shared/css/tokens.css` |
| 颜色 | `--bg-soft-1` | `#faf8f2` | `shared/css/tokens.css` |
| 颜色 | `--line` | `#e8e4d9` | `shared/css/tokens.css` |
| 颜色 | `--muted` | `#7a8394` | `shared/css/tokens.css` |
| 颜色 | `--muted-2` | `#a9b0bd` | `shared/css/tokens.css` |
| 圆角 | `--radius` | `4` | `shared/css/tokens.css` |
| 圆角 | `--radius-card` | `8` | `shared/css/tokens.css` |
| 圆角 | `--12px` | `12` | `shared/css/tokens.css` |

代码化时优先保留 Figma 已设置的 Variable code syntax，例如继续使用 `--paper` 和 `--radius-card`，不在没有产品需求的情况下自动改名为 `--color-paper` 或其他新命名。

圆角 Variables 在 CSS 中消费时使用适合几何尺寸的单位。当前表格中的 `4`、`8`、`12` 是 Figma 节点读取结果，代码分别落为 `4px`、`8px`、`12px`；`--12px` 保留 Figma 已生成的 code syntax，不在首轮自动改名。

间距、排版数值、布局尺寸、透明度、动画、滚动条和图标尺寸等类别目前没有通过当前文件的实际节点或完整导出数据确认。后续若获得证据，再增补到本节；在此之前不建立数量和命名清单。

### 3.2 Styles

#### Text Styles

当前实际标题节点已确认使用 `Title/h1`：

| Style | 已确认参数 | 证据范围 | 代码策略 |
| --- | --- | --- | --- |
| `Title/h1` | Source Han Serif SC、SemiBold、字号 24px、字重 600、行高 32px、字间距 0.48px | 节点 `198:53298`、`198:53299` | 映射为 `design-system-overrides.css` 中的 `.text-title-h1`；字体按第 3.3 节使用项目 Serif 栈 |

当前读取结果只能证明 `Title/h1` 在抽样节点中实际使用，不能证明它是唯一 Text Style，也不能据此推导完整 Text Style 数量。其他 Text Styles 必须从实际绑定节点或完整导出数据逐项确认。

Text Style 的字体家族、字重、字号、行高和字间距必须按 Figma 原值实现。不能仅根据 Style 名称猜测参数，也不提前创建 `.type-*` class 清单。

#### Effect 与 Grid Styles

当前没有足够证据列出 Effect Styles 和 Grid Styles 的名称、数量或完整参数。以后确认 Effect Style 后，阴影原子值写入 `tokens.css`，消费者写入公共组件 CSS 或模块私有 CSS；确认 Grid Style 后，具体布局仍由实际使用模块负责，不批量生成全局工具 class。

### 3.3 Font Family 代码基线（暂按参考项目）

本节不是从当前 Figma 文件推导出的资产，而是按用户指定，从 `interndiscovery` 项目的 `platform-static-prototype/design-system/tokens/Paper_Design_Token.md` 与 `Paper_Design_Token.css` 抄录的暂定代码基线。它只为后续实现提供 font-family 方案，不改变第 2 节关于 Figma 证据边界的结论，也不会让当前项目在运行时依赖另一个本地项目。

#### 字体栈 Token

参考项目的规范源定义为：

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Noto Sans SC', sans-serif;
--font-serif: 'Cormorant Garamond', 'Noto Serif SC', serif;
```

| Token | 主字体与 fallback | 语义角色 |
| --- | --- | --- |
| `--font-sans` | Inter -> 系统 UI 字体 -> PingFang SC / Noto Sans SC -> `sans-serif` | 正文、导航、Tab、按钮、表单、卡片标题和其他控件文本 |
| `--font-serif` | Cormorant Garamond -> Noto Serif SC -> `serif` | 品牌印记、Hero 标题和需要阅读的内容标题 |

参考项目的 Design System 展示页实际通过 `var(--sans)`、`var(--serif)`、`var(--display)` 等短别名消费字体，并在页面 `<head>` 通过 Google Fonts 加载 Web Font。短别名属于参考项目当前运行时实现；本项目后续先以本节的 `--font-*` 作为规范名称，不直接复制短别名，除非已有代码兼容确实需要。

#### 字体语义规则

- 平台默认正文和控件使用 Sans，不允许各模块各自定义新的正文常用字体栈。
- 内容标题使用 Serif；中文内容标题使用 Noto Serif SC 600，CJK 字间距使用 `0.02em`。
- 品牌 Logo 可以使用 Cormorant Garamond Italic；Hero 标题使用 Cormorant Garamond 400。品牌字体不扩散到正文和控件。
- 元信息继续使用 Sans，通过字号、字重和字间距区分层级，不引入独立字体栈。
- 中文 placeholder 保持 `font-style: normal`。
- 中英文混排不为中文片段单独包裹字体，让字体栈按字符 fallback。
- Web Font 通过页面 `<head>` 加载；加载失败时必须依靠上述 fallback 保持可读，不能因远程字体失败导致文字不可见或布局不可用。

#### 与当前 Figma Style 的关系

当前 Figma 抽样节点的 `Title/h1` 使用 Source Han Serif SC，而参考字体栈的中文 Serif 是 Noto Serif SC；两者不是同一字体。按本次要求，代码文档先采用参考项目字体栈，但保留这项差异：后续实现 `Title/h1` 前必须进行视觉对照，不能把两种字体描述为完全等价。如果产品最终要求严格跟随 Figma，应再决定把 Source Han Serif SC 加入或替换 Serif 栈。

### 3.4 组件迁移代码 Token（非 Figma Variable）

按用户批准的参考 Design System 组件迁移，`tokens.css` 新增 `--state-danger`、`--state-danger-strong`、`--state-success`、`--state-warning`、`--state-error` 和 `--radius-pill`。这些值用于保留 Buttons、Toast 与指定 Dialog 的危险、反馈和胶囊状态，不来自当前 Figma Variables，不进入第 3.1 节计数，也不能反推当前 Figma Collection。完整来源、组件范围与重绑表见 `../design-system/COMPONENT_MIGRATION.md`。

## 4. Figma 到代码的映射规则

### 4.1 命名来源与约定

- 已有 Figma Variable 优先直接使用其 code syntax，例如 `--paper`、`--ink-soft`、`--radius-card`。
- 小写英文连字符形式只是新增代码专属 Token 的建议约定，不是 Figma 规定，也不是当前仓库已经存在的强制规则。
- 不为了统一前缀自动把现有 Variables 改成 `--color-*`、`--space-*` 等另一套名称。
- Figma Style 名称可以包含中文、斜杠或其他分组信息；如果需要转换为 CSS class，必须在文档中记录一对一映射，不能无依据省略语义。
- 当前首个 Style 映射为 `Title/h1` -> `.text-title-h1`。
- Figma 节点 `242:63219` / `242:63221` 映射为 `.btn-text` 的默认 / hover 状态；`--bg`、`--bg-soft` 与 `--ink-soft` 继续使用节点返回的 Variable code syntax。
- 用户给出的文字链接按钮节点 `242:63225` / `242:63226` 当前不在 Figma 文件节点清单中；`.btn-link` 只落实已明确的下划线交互规则，并暂复用 `.btn-text` 的排版与颜色基线，不将其记作已完成节点参数复核。
- 外部设计系统搜索结果的库名和 Collection 名不得进入本项目代码命名空间。
- 一个已采用的 Figma Variable 对应一个可追溯的 CSS Custom Property；只有实际存在 Alias 时，代码才保留 Alias 关系。

### 4.2 Mode 与 Alias

- 当前尚未完整读取 Variable Collection 的 Modes 和 Alias 链，因此不预设 Light、Dark、High Contrast 或 Density。
- 已确认的默认值可以先写入 `:root`；只有 Figma 明确存在其他 Mode 时，才增加对应的主题属性作用域。
- 如果确认存在 Dark Mode，使用明确的 `[data-theme="dark"]`，由 shell 管理主题属性。
- 其他业务 Mode 使用明确的 `data-theme` 或 `data-density`，不能用页面 class 隐式覆盖。
- Figma Alias 在 CSS 中继续引用目标 Token；禁止把 Alias 解析成重复的字面值。

### 4.3 数值与单位

- 颜色保持 Figma 的 sRGB 值和 Alpha；不自行调色。
- 尺寸、间距、圆角、边框宽度默认使用 `px`。
- 动画时长根据 Variable 描述使用 `ms`。
- 透明度使用 `0` 到 `1` 的无单位值。
- 行高如果 Figma 提供百分比或倍率，优先保留无单位比例；固定像素行高则保留 `px`。
- Letter spacing 首轮按 Figma 原单位实现，视觉对齐后再决定是否转换为 `em`。

## 5. 页面适配统一原则

### 5.1 参考结论与适用边界

本节参考 [Attio 官网](https://attio.com/) 在宽屏、中等宽度和手机宽度下的实际布局变化，只吸收其适配逻辑，不复制页面视觉、文案或具体断点数值。

观察到的主要模式：

- 宽屏顶部导航完整展开；空间不足时保留品牌入口，把多项导航和次要操作收进菜单。
- 带章节导航的大模块在宽屏使用侧向固定导航，在中小宽度改为横向导航；条目较多时只让导航自身横向滚动。
- 内容与产品演示在宽屏可以分栏，宽度下降后先减少列数，手机端按阅读顺序单列堆叠。
- 标题、页面留白和区块间距随可用宽度分档收敛，但信息层级、主要操作和可点击尺寸不随意缩小。
- 页面根容器不产生横向滚动；只有表格、时间线、标签导航等确有横向语义的局部区域可以独立滚动。

这些结论用于建立本项目统一规则。后续页面仍以 Figma 设计稿和真实内容为准，不以 Attio 的结构作为页面需求。

### 5.2 三档适配模式

项目先采用三档粗粒度模式。断点是实现起点，后续可以根据真实内容发生挤压的位置微调，但各页面不得自行创建一套无登记的断点体系。

| 模式 | 建议宽度 | 大模块行为 |
| --- | --- | --- |
| 宽屏 | `>= 1200px` | 顶部导航完整展示；主内容使用最大宽度容器；允许多列网格、左右分栏和模块内侧向导航 |
| 中等 | `768px - 1199px` | 顶部导航收合次要入口；减少网格列数；左右分栏可改为上下布局；模块内导航改为顶部横向形式 |
| 紧凑 | `< 768px` | 主要内容单列；操作区按优先级换行或纵向排列；装饰性内容可降级；页面使用紧凑但稳定的左右留白 |

断点选择遵循“内容先于设备”：如果导航、标题或卡片在某个中间宽度已经挤压，应在内容开始失真前切换布局，不为特定手机或平板型号增加例外。

### 5.3 大模块适配规则

#### 顶部导航与 shell

- 宽屏展示完整顶部导航、用户操作和主要行动按钮。
- 中等与紧凑模式保留 logo、当前页面识别和一个明确的菜单入口；次要导航进入菜单，不允许硬挤成两行。
- shell 高度变化必须通过统一布局变量管理；iframe 内容依据可用内容宽度适配，不能按浏览器外窗宽度重复判断一套规则。

#### 页面容器与区块

- 页面使用居中的流式容器：宽屏受最大内容宽度约束，中小宽度使用稳定的页面边距。
- 区块主要缩减外部留白和列间距，不压缩到影响正文阅读、表单输入或点击目标。
- DOM 顺序按紧凑模式的阅读顺序组织；宽屏分栏只通过 CSS 布局增强，避免为了不同宽度复制两套内容。

#### 网格、卡片与分栏

- 卡片区按“多列 -> 少列 -> 单列”降级；以卡片最小可读宽度决定何时减列，不强行缩窄卡片。
- 主次分栏在宽屏并排，中等宽度优先缩为单列或主宽辅窄，紧凑模式统一上下排列。
- 模块内侧向导航在空间不足时改为横向导航；只有导航容器自身可以横向滚动，正文区域仍保持无横向溢出。

#### 产品演示、图表与表格

- 图片、视频和产品演示保持比例并受容器约束，不通过非等比压缩塞入窄屏。
- 复杂演示在中小宽度优先简化外围装饰、缩减辅助面板或改为上下结构，核心信息和主要操作必须保留。
- 表格确实无法压缩时使用局部横向滚动，并保留关键列或明确的滚动提示；禁止让整页跟随表格横向滚动。

#### 排版、操作与内容优先级

- 大标题和区块标题采用分档字号或 `clamp()` 平滑收敛，正文保持可读字号和合理行长。
- 主要行动按钮始终可见；次要操作可以收进菜单或移动到下一行，但不能只靠隐藏解决空间不足。
- 紧凑模式可以减少纯装饰、重复 logo 或非关键辅助信息；不得隐藏核心业务内容、状态、错误提示和表单标签。
- 所有模式保持键盘焦点可见，并保证按钮、菜单和横向滚动区域可以通过触控正常操作。

### 5.4 代码归属

| 适配内容 | 目标路径 | 原则 |
| --- | --- | --- |
| 页面最大宽度、页面边距、区块间距、流式排版等适配 Token | `shared/css/tokens.css` | 只定义数值，不写模块选择器；媒体查询断点在文件注释和本文件登记，因为 CSS Custom Property 不能直接作为普通媒体查询条件 |
| 顶部导航、菜单收合、shell 高度与 iframe 可用区域 | `shared/css/shell.css` | shell 统一负责，模块不得复制顶部导航断点逻辑 |
| 元素级图片、媒体和排版基础约束 | `shared/css/base.css` | 只放所有模块都应遵守的安全默认值 |
| 跨模块稳定的卡片、操作组或局部滚动模式 | `shared/css/design-system-overrides.css` | 只有两个及以上模块确认复用后才能进入公共层 |
| Home 的卡片列数、区块堆叠、演示区布局 | `tabs/home/home.css` | 消费全局 Token，保留页面私有结构和断点实现 |
| 适配示例与状态对照 | `design-system/index.html`、`design-system/design-system.css` | 只作为规范展示，不成为产品页面依赖 |

实现媒体查询时优先以紧凑模式为基础样式，再用 `min-width` 增强中等和宽屏布局；已有模块若采用其他写法，不要求无关重构，但新增页面必须保持同一组登记断点和相同行为方向。

### 5.5 适配验收

- 至少检查 `390px`、`768px`、`1024px`、`1440px` 四个代表宽度，并抽查断点之间的中间宽度。
- 页面根节点没有非预期横向滚动，允许滚动的局部区域边界清晰。
- 顶部导航不会换成不可控的两行；菜单入口、当前页识别和主要操作可用。
- 卡片、分栏和产品演示按照内容阅读顺序降级，不出现重叠、截断或不可操作区域。
- 文本缩放到 `200%` 时核心内容与操作仍可访问。
- 通过 shell iframe 打开和直接打开模块页时，适配结果保持一致。

## 6. 代码存放位置

| 代码内容 | 目标路径 | 约束 |
| --- | --- | --- |
| 已确认的 Variables，以及后续确认的 Mode、Alias、Effect 原值 | `shared/css/tokens.css` | Figma Token 必须有证据；用户批准的项目级代码 Token 可放在同文件的独立注释区，并明确标记“非 Figma Variable”；不写页面选择器 |
| `--font-sans`、`--font-serif` 字体栈 | `shared/css/tokens.css` | 暂按第 3.3 节参考项目基线实现；不在模块中重复定义字体栈 |
| HTML 元素基础排版、焦点基础规则 | `shared/css/base.css` | 不写 Home 布局或组件变体 |
| 默认正文的 `font-family` | `shared/css/base.css` | `body` 消费 `var(--font-sans)`；表单控件继承正文或显式使用相同 Token |
| 顶部导航、shell 高度和 shell 布局 | `shared/css/shell.css` | 只能消费 Token，不重复定义 Token |
| 已确认的复合 Text Style、稳定公共组件状态、用户批准的候选公共组件基线 | `shared/css/design-system-overrides.css` | 候选组件必须登记迁移来源、当前消费者和未完成的产品验证 |
| Design System 展示结构 | `design-system/index.html`、`design-system/components.html` | 原子规范与组件规范分开核对；组件页不能承载产品业务逻辑 |
| Design System 页面自身布局 | `design-system/design-system.css` | 不能成为产品页面依赖 |
| Web Font 加载声明 | `index.html`、`design-system/index.html`、`design-system/components.html`、相关 `tabs/<module-id>/index.html` 的 `<head>` | shell 和模块页都能独立打开；加载同一字体家族与所需字重，并保留 Token 中的 fallback |
| Home 的 Grid、区块、页面特例 | `tabs/home/home.css` | 不反向成为其他模块依赖 |
| Home DOM 与语义结构 | `tabs/home/index.html` | 后续读取具体页面设计时再实现 |
| Home 交互 | `tabs/home/home.js` | 不存放视觉 Token |

公共 CSS 仍按 `tokens.css`、`base.css`、`shell.css`、`styles.css`、`design-system-overrides.css` 的固定顺序加载。模块私有 CSS 在公共 CSS 之后加载。

## 7. 当前设计资产与项目架构

### 7.1 顶部导航与未确认的 Sidebar 资产

当前 Figma 证据没有确认本文件存在完整的 Sidebar 颜色、宽度或动画 Variables。此前记录的 `sidebar*`、`layout/sidebar-width-*`、`transitions/duration-sidebar` 和 `radius/nav-item` 来自其他设计系统搜索结果，不属于当前文件资产，本文不再登记或映射它们。

当前项目规范已经明确使用顶部导航，因此代码实施遵循：

- 顶部导航与 shell 布局继续由 `shared/css/shell.css` 负责。
- 不因为外部搜索结果添加 Sidebar Token、Sidebar 布局或左侧导航组件。
- 如果未来在本文件实际节点或完整导出数据中确认 Sidebar 资产，也要先判断它是页面内容、历史残留还是正式架构需求，不能仅凭名称进入代码。

只有产品架构重新确认使用 Sidebar，并同步修改 `AGENTS.md`、`README.md`、架构地图和模块地图后，才能实现 Sidebar 相关代码。

### 7.2 当前设计稿实际使用的 Variables 与 Styles

第 3 节列出的颜色和圆角 Variables 是设计稿实际节点正在使用的资产，不是“遗留变量”，也不与任何已确认的新 Collection 冲突。`--12px` 已通过节点 `155:642` 重新核对并纳入第一批实现。

当前代码化原则：

1. 以实际节点读取结果和后续完整导出数据作为事实来源。
2. 首轮在 `tokens.css` 保留现有 Variable code syntax，不自动改名或建立迁移 Alias。
3. `Title/h1` 等实际使用的 Styles 要逐个记录来源节点和完整参数，再决定代码选择器。
4. 如果以后确实引入第二个 Collection，再按语义、引用关系和 Mode 比较是否需要 Alias 或迁移；不能预先假设存在新旧两套体系。
5. 设计系统搜索命中的未订阅外部资产不参与比较，也不进入迁移计划。

## 8. 实施顺序

### 阶段 A：补齐精确设计数据

1. 提供当前文件的 Variables 导出数据，或按页面和组件提供包含 `node-id` 的代表节点链接。
2. 读取真实 Collection 名称、Modes、全部 Variable 值、code syntax 和 Alias 链。
3. 从实际绑定节点逐项读取 Text、Effect 和 Grid Styles 的完整参数，不预设数量。
4. 为每项资产记录“当前文件实际使用”“当前文件存在但未使用”“外部搜索结果”三种来源状态。
5. 将未能精确读取的资产标记为待确认，不猜值、不补数量。

### 阶段 B：建立 Token 层

1. 把确认过的 Variables 按现有 code syntax 写入 `shared/css/tokens.css`。第一批颜色与圆角已完成。
2. 按第 3.3 节把两套 font-family 写为 `--font-sans`、`--font-serif`；模块只消费 Token。字体基线已完成。
3. 默认值写入 `:root`；只有确认存在其他 Mode 时，才建立对应主题属性作用域。
4. 为每个 Figma Token 记录 Variable 名称、值和来源节点；没有实际 Alias 时不创建代码 Alias。非 Figma 的项目代码 Token 另行记录批准来源和用途，不能伪造 Figma 节点。
5. 在 Design System 页面展示所有已实现的颜色、圆角、字体栈和后续确认的 Token，并区分 Figma Variable 与项目代码 Token。

### 阶段 C：建立 Style 层

1. 从 `Title/h1` 等已确认 Style 开始建立 Figma 到 CSS 的一对一映射。`.text-title-h1` 已完成，其他 Style 待逐项确认。
2. 先按第 3.3 节落实 Sans、Serif 的语义分工，再核对 `Title/h1` 的 Source Han Serif SC 与参考 Serif 栈差异。
3. 只有确认 Effect Styles 的完整参数后，才建立阴影 Token 和组件示例。
4. 只有确认 Grid Styles 的实际使用位置后才落地；Home 私有 Grid 放入 `home.css`。

### 阶段 D：实现 Home

1. 再读取 Home 精确 Frame 的结构和截图。
2. 创建 `tabs/home/index.html`、`home.css`、`home.js`。
3. 页面只消费已登记 Token；没有依据的视觉值不得补写为全局规范。
4. 页面布局遵循第 5 节的统一适配原则，再根据 Home 的实际 Frame 确认具体列数和顺序。

## 9. 验收标准

- 每个已采用的 Figma Variable 都能追溯到唯一 CSS Token。
- 每个已实现的 Text、Effect、Grid Style 都有来源节点、完整参数、代码位置和消费者。
- 所有模块从 `tokens.css` 消费统一 font-family，不在页面私有 CSS 中复制或重排常用字体栈。
- Sans、Serif 的语义角色符合第 3.3 节；远程字体加载失败时 fallback 仍可读。
- `Title/h1` 的实际渲染字体与 Figma 做视觉对照，并明确记录 Source Han Serif SC 与暂定 Serif 栈的处理结论。
- Home 页面不复制公共 Token 的字面值。
- 未确认的 Sidebar 资产不会在顶部导航架构下进入产品实现。
- 外部设计库资产不会被误认为当前文件资产或本项目规范。
- 不根据抽样节点推导全文件资产总数，不为未确认的 Mode 或 Alias 创建代码。
- Design System 页面能够展示所有已实现并有证据的 Token、Mode 和 Style。
- 修改公共 CSS 后同时检查 Design System 页面和所有登记消费者。
- 页面适配遵循第 5 节的统一模式，断点、shell 和模块私有规则没有重复定义或相互冲突。
- 执行 `git diff --check`、本地资源路径检查以及与 Figma 的视觉对照；静态检查不能替代浏览器视觉验证。

## 10. 当前结论

当前 Figma 文件已经确认有一组实际使用的颜色和圆角 Variables，以及抽样节点使用的 `Title/h1` Text Style。这些资产已经作为第一批代码化输入落到公共 CSS 与 Design System 核对页。

Font Family 暂按参考项目的 Design System 基线补充为 Sans、Serif 两套语义字体栈，并统一存放在 `shared/css/tokens.css`。这部分是用户指定的代码方案来源，不是从当前 Figma Collection 推导出的 Variable。

当前尚未确认完整 Collection 名称、Modes、全部 Variables、Alias 链以及完整 Text、Effect、Grid Styles 清单，因此不能宣称文件已经形成包含间距、布局、动画、阴影和栅格的完整体系，也不能按外部设计系统搜索结果批量生成 CSS。

下一步补齐阶段 A 的完整 Collection、Modes、Alias 与 Styles 数据，再增量扩展 `tokens.css` 和 Style 映射。本文是代码化的数据来源、归属和实施合同，不包含假设的新旧 Collection 迁移关系。

页面适配部分已经可以作为后续实现的统一合同：新增页面先遵循三档模式和大模块降级方向，再结合具体 Figma 页面确认每个区块的最终列数、顺序和视觉细节。
