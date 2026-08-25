# Home 官网 Figma 产品技术文档

## 1. 文档信息

- 状态：Draft，供页面实现前评审
- 更新日期：2026-08-21
- Figma 文件：`ZaggbS0TYv1ljbBzqEwc7h`
- 目标节点：`198:27482`（`v0.2`）
- 设计宽度参考：`1440px`；页面高度不冻结，以实际开始实现各模块时重新读取的 Figma 当前节点为准
- 最近一次文档检查快照：`1440 × 10551.25px`（2026-08-21，仅用于追溯，不是实施锁定尺寸）
- 技术形态：纯静态 HTML、CSS、JavaScript
- 目标模块：`platform-static-prototype/tabs/home/`
- 关联规范：
  - `../README.md`
  - `ITERATION_ARCHITECTURE_MAP.md`
  - `CSS_OWNERSHIP_MAP.md`
  - `MODULE_OWNERSHIP_MAP.md`
  - `FIGMA_VARIABLES_STYLES_IMPLEMENTATION.md`

本文是 Home 官网从 Figma 进入代码的结构、组件、Token、资源、适配和动画合同。正式实现已落到 `platform-static-prototype/index.html` 与 `tabs/home/index.html` 的真实依赖链；14 个模块的滚动、切换、自动播放、外链和弹窗要求已经纳入本文。仍未确认的提交接口、统计、隐私和个别下载地址单列在文末，不由开发自行补全。

## 2. 数据来源与事实边界

本次读取了目标节点的完整顶层元数据、各主要子模块的设计上下文、节点 Variable 定义和整页截图，并检查了仓库内现有 Design System、公共 CSS 与 Logo 资源。设计稿仍在持续修改，因此本文记录的 Y 坐标、区块高度和复合图示自然尺寸都是检查时快照，不拥有高于实施时 Figma 当前状态的优先级。

结论分为三类：

1. **Figma 明确事实**：节点名称、顺序、尺寸、实际绑定的 Variable / Style、`image-` 图层、可见与隐藏状态。
2. **仓库明确规则**：纯静态技术栈、shell / Home 边界、CSS 和资源归属、三档适配断点。
3. **本页实施方案**：组件拆分、1400px rail、边框去重、代码底纹、窄屏重排和动画挂载点。该类结论是后续实现合同，不描述成 Figma 原生属性。

实施时的事实优先级固定为：**实施当日目标节点的 `get_design_context` + 独立截图 > 同次生成的本地 Figma manifest > 本文历史数值快照**。开始每个模块前重新读取对应节点；若名称、尺寸、顺序、Variable 绑定或 `image-` 子层发生变化，先更新该模块 manifest 和资源清单再编码，不为了迁就本文旧数字反向修改页面。交付验收仍以该次实现所记录的 Figma 快照为准；设计稿之后继续变化时，作为下一轮设计变更处理。

2026-08-21 再次读取目标节点时，旧节点 `198:43345` 已不存在；当前顶层也没有与科研成果区重叠的同名隐藏模块。因此删除旧版风险提示，后续不再把该节点列入排除项。当前节点名称以本次实时读取为准，其中 `198:35625`、`198:35635`、`198:51027`、`198:53333` 已分别明确为 `科研基座banner`、`科研基座能力`、`科研案例`、`footer`。

## 3. 页面结构与信息架构

### 3.1 顶层区块

| 顺序 | Figma 节点 | 区块 | 2026-08-21 快照 Y / 高度 | 结构摘要 |
| --- | --- | --- | --- | --- |
| 1 | `198:27483` | Navigation | `0 / 69` | 品牌 Logo、5 个导航入口、在线使用按钮 |
| 2 | `198:27523` | Hero | `69 / 1294` | Badge、主标题、副标题、CTA、浏览器屏幕和 3 张装饰卡 |
| 3 | `198:27557` | 平台核心优势 | `1363 / 889` | 标题区与 3 × 2 优势卡片 |
| 4 | `198:27596` | 全链贯通 | `2252 / 657` | 标题区、点阵底纹、340px 高横向流程参考画布 |
| 5 | `198:27637` | 学科纵深 | `2909 / 863` | 六大学科图示与科研应用、数据、工具卡片展示 |
| 6 | `198:27737` | 产物原生 | `3772 / 861` | 3 张主卡 + 4 张次卡的产物图文网格 |
| 7 | `198:27788` | 科研证据链 | `4633 / 769.25` | 产物步骤导航、来源—结论证据图 |
| 8 | `198:27789` | 安全可控 | `5402.25 / 697` | 点阵底纹、三项安全原则、六个说明节点 |
| 9 | `198:35497` | 生态开放 | `6099.25 / 777` | 六类能力入口、统一接入/调度、品牌落点 |
| 10 | `198:35625` | 科研基座banner | `6876.25 / 464` | 代码网格底纹、两张科研装饰图、居中说明卡 |
| 11 | `198:35635` | 科研基座能力 | `7340.25 / 732` | SCP、Intern-S2、World Model 三列能力卡 |
| 12 | `198:51027` | 科研案例 | `8072.25 / 951` | 左侧案例列表、右侧案例详情和主图 |
| 13 | `198:51082` | 合作共建 | `9023.25 / 810` | 标题、三排机构 Logo、点阵合作 CTA |
| 14 | `198:53303` | 下载客户端 | `9833.25 / 416` | 标题与 5 个下载入口 |
| 15 | `198:53333` | footer | `10249.25 / 302` | 品牌、4 组链接、公众号二维码、备案和协议 |

上表只保留 2026-08-21 的结构检查记录：当时 Navigation 为 69px、`全链贯通` 为 657px、`image-flow` 为 `1400 × 340px`、整页为 10551.25px。它用于说明页面顺序和设计演化，不得直接成为 CSS 高度或实现验收基线；实施前必须重新读取目标节点，并由同次 manifest 锁定实际尺寸。

### 3.2 Shell 与 Home 的责任边界

按仓库现有架构执行：

- Navigation 属于 shell，由未来的根 `index.html`、`shared/css/shell.css` 和 `shared/js/shell.js` 负责。
- Hero 至 Footer 属于 Home 模块，DOM、布局、动画和私有资源位于 `tabs/home/`。
- Navigation 与 Footer 共用的品牌资产继续放在 `shared/assets/logos/`；这不意味着 Footer 需要迁到 shell。
- Home 单独打开时仍应展示完整内容；独立入口提供与 shell 导航同一锚点表驱动的本地导航 fallback，避免页面脱离 shell 后丢失核心导航能力。
- shell 导航如需控制 iframe 内锚点滚动，必须先在 `ITERATION_ARCHITECTURE_MAP.md` 登记消息协议；不得直接跨层操作 DOM。

## 4. Design System 绑定方案

### 4.1 绑定原则

- Figma 已有 code syntax 的 Variable 直接使用同名 CSS Custom Property，不在 Home 中复制字面值。
- 已在 `shared/css/tokens.css` 存在的 Token 直接消费。
- 设计稿实际使用、但代码尚缺失的 Token，应先补到 `shared/css/tokens.css` 并同步 Design System 核对页，再实现 Home。
- 值相同但语义不同的 Variable 不直接合并；确认 Figma Alias 后在 CSS 中保留 Alias，而不是再写一份字面值。
- 1400px rail、具体卡片列数和图示布局是 Home 布局规则，先留在 `home.css`，不伪装成 Figma Variable，也不改写当前全局 `--layout-content-max: 1200px`。

### 4.2 本页使用的颜色与几何 Token

| Token | Figma 解析值 | 当前代码状态 | 本页用途 / 动作 |
| --- | --- | --- | --- |
| `--paper` | `#ffffff` | 已有 | 卡片、节点和图片容器背景 |
| `--ink` | `#1a2332` | 已有 | 主文字、主按钮、深色图形 |
| `--ink-soft` | `#3a4556` | 已有 | 导航与次级正文 |
| `--bg-soft` | `#f7f4ec` | 已有 | 下载卡、浅暖背景 |
| `--line` | `#e8e4d9` | 已有 | 1400px rail、区块分割线、卡片边框 |
| `--muted` | `#7a8394` | 已有 | 副标题与说明文本 |
| `--muted-2` | `#a9b0bd` | 已有 | 弱化文本、不可用说明 |
| `--radius-card` | `8px` | 已有 | 图示节点和通用卡片 |
| `--12px` | `12px` | 已有 | Figma 已绑定的 12px 圆角场景 |
| `--accent` | `#1554a8` | 缺失 | 品牌蓝、强调描边、图示关键节点；实现前补 Token |
| `--bg` | `#fdfcf8` | 缺失 | 页面暖白底色；不能用 `--paper` 代替 |
| `--line-soft` | `#efece2` | 缺失 | Badge、局部轻分隔和小卡描边 |
| `--dot` | `#ebe6da` | 缺失 | 点阵底纹 |
| `--warning-bg` | `#f8f1e3` | 缺失 | 图示中的警示浅底 |
| `--warning` | `#a8864b` | 缺失 | 图示中的警示强调 |
| `--success-bg` | `#f1f3e8` | 缺失 | 证据链关键结论背景 |
| `--success-soft` | `#a4ad7e` | 缺失 | 证据链关键结论描边 |
| `--success` | `#6b7a3a` | 缺失 | 成功/已验证状态 |
| `--success-deep` | `#4d5826` | 缺失 | 成功状态深色文字 |
| `--ai-tint` | `#f5f8fc` | 缺失 | AI 类节点浅色背景 |
| `--accent-soft` | `#88addd` | 缺失 | 品牌蓝弱强调 |
| `--paper-warm` | `#f7f4ec` | 缺失 | 证据链占位条；确认 Alias 后绑定 `--bg-soft` |
| `--rule-soft` | `#efece3` | 缺失 | 更弱的规则线；不得与 `--line-soft` 混成一个值 |

Figma 还返回了“主文字”“辅助文字”“弱化文字”“小标签 Hover”“点阵弱装饰”等中文语义项。若它们在 Collection 中是 Alias，代码只保留可追溯的 Alias 关系，不额外制造一组无消费者的中文 CSS 变量。

### 4.3 Text / Effect Style 映射

| Figma Style | 参数摘要 | 代码动作 |
| --- | --- | --- |
| `Title/content title` | Source Han Serif SC / 700 / 64 / 64 / 2px | Hero 主标题；新增可追溯 Style 映射，并消费下述 700 页面字符子集 Token |
| `Title/h2` | Source Han Serif SC / 600 / 40 / 44 | 重复的二级区块标题；新增 Style 映射，并消费下述 600 页面字符子集 Token |
| `Title/h1` | Source Han Serif SC / 600 / 24 / 32 / 0.48px | 已映射为 `.text-title-h1`；将该 Style 的字体消费切换到下述 600 页面字符子集 Token |
| `Title/h3-h4` | PingFang SC / 600 / 16 / 1.45 | 卡片标题；新增 Style 映射 |
| `Body/XLarge` | PingFang SC / 400 / 18 / 24 | 大号说明文本 |
| `Body/Large` | PingFang SC / 400 / 16 / 24 | 常规大正文 |
| `Body/Default` | PingFang SC / 400 / 14 / 1.6 | 默认正文 |
| `Body/Reading` | PingFang SC / 400 / 14 / 1.7 | 长说明正文 |
| `Body/Compact` | PingFang SC / 400 / 13 / 1.65 | 紧凑元信息 |
| `Control/Default` | PingFang SC / 500 / 13 / 16 | 按钮和控件标签 |
| `Shadow/Overlay` | `0 8px 24px #00000014` | 图示卡片 / 装饰卡阴影；确认后建立 Effect Token |
| `Shadow/Modal` | `0 20px 60px #0000001f` | 合作申请弹窗；由 shell 级 Design System Dialog 消费 |

### 4.4 Source Han Serif SC Web Font 方案

本页可以继续严格使用 Source Han Serif SC，而且不要求访问者预先在系统中安装该字体。实现方式是把官方字体作为 Web Font 随站点发布，浏览器按 `@font-face` 下载；系统字体只承担下载失败或尚未完成时的 fallback。

页面字符子集已于 2026-08-21 生成完成。实施基线如下：

1. 以 Adobe Source Han Serif 2.003R 的简体中文静态 SemiBold / Bold OTF 为源，分别生成 600、700 两份静态 WOFF2。完整上游字体仅作本地构建输入，不进入仓库。
2. 运行时文件为 `shared/assets/fonts/source-han-serif-sc/inkstone-han-serif-sc-home-600.woff2`（88,344 bytes）和 `inkstone-han-serif-sc-home-700.woff2`（75,108 bytes），合计 163,452 bytes。
3. 字符来源不是手工猜测：`SUBSET_MANIFEST.json` 记录了目标 Figma 中每个命中 Source Han Serif SC / CN 的可见标题节点和文本，并为两个字重追加完整 ASCII 英文字母、0–9 数字及常用中英文标点基线。
4. 子集字体内部 family 为 `InkStone Han Serif SC Home`。这是 Source Han Serif SC 的字形子集；因为上游 OFL 将 `Source` 声明为 Reserved Font Name，修改后的字体不继续使用该内部名称。
5. `LICENSE.txt`、文件字节数、SHA-256、FontTools 版本、节点/文字清单和字形数量均与字体文件同目录提交。Figma 标题发生增删改时，必须先更新 manifest 并重新生成受影响字重，不能只依赖 fallback 掩盖缺字。
6. 实现阶段在公共字体声明中注册实际 family，并在 `shared/css/tokens.css` 增加 `--font-serif-cjk: "InkStone Han Serif SC Home", "Source Han Serif SC", "Noto Serif SC", serif;`。Figma 的 `Title/content title`、`Title/h2`、`Title/h1` 映射消费该 Token，不在 Home 私有 CSS 复制字体栈。
7. `Noto Serif SC` 继续作为请求失败或清单外字符的 fallback。首屏只 preload 700 文件；两份 `@font-face` 均使用 `font-display: swap`，并在冷缓存下检查字体切换造成的换行与布局偏移。

实际声明结构如下；该步骤留到页面实现阶段接入，本次只生成和验证字体资产：

```css
@font-face {
  font-family: "InkStone Han Serif SC Home";
  src: url("../assets/fonts/source-han-serif-sc/inkstone-han-serif-sc-home-600.woff2") format("woff2");
  font-style: normal;
  font-weight: 600;
  font-display: swap;
}

@font-face {
  font-family: "InkStone Han Serif SC Home";
  src: url("../assets/fonts/source-han-serif-sc/inkstone-han-serif-sc-home-700.woff2") format("woff2");
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}

:root {
  --font-serif-cjk: "InkStone Han Serif SC Home", "Source Han Serif SC", "Noto Serif SC", serif;
}
```

因此，正式方案是 **Source Han Serif SC 页面字符子集为事实字体，Noto Serif SC 为容错兜底**。[Adobe 官方仓库](https://github.com/adobe-fonts/source-han-serif)和 [OFL 许可文件](https://github.com/adobe-fonts/source-han-serif/blob/master/LICENSE.txt)保留为上游事实来源。

## 5. 1400px rail、描边与分割线

### 5.1 Rail 模型

设计在 1440px 画布上使用 `x = 20px`、`width = 1400px` 的主 rail。Hero 保持全宽；从“平台核心优势”开始，大多数区块在 rail 内连续排列。

Home 私有布局约定：

- `home rail max = 1400px`。
- 1440px 宽度时左右各 20px；更宽屏幕时 rail 居中；小于 1440px 时保持稳定页边距并流式缩窄。
- 不直接复用或修改当前 `--layout-content-max: 1200px`。若未来第二个真实页面也使用相同 rail，再评审是否提升为公共适配 Token。
- 由于项目不引入 reset，rail、卡片和按钮自身必须明确 `box-sizing: border-box`，不能假设 Tailwind Preflight 或全局 reset 存在。

### 5.2 边框所有权

为避免设计中大量 1px 线条叠成 2px，边框按以下单一所有者规则实现：

| 线条 | 唯一所有者 | 规则 |
| --- | --- | --- |
| Navigation 底线 | shell Navigation | 只画一次 `--line` |
| 1400px 两侧长线 | Home rail inner | 使用逻辑方向 `border-inline`，相邻区块不重复画侧线 |
| 区块之间横向分割 | 每个 full-bleed 区块外层 | 只拥有自己的 `border-block-end`，线宽始终等于当前内容视窗宽度；不得由 1400px rail 或内容卡片绘制 |
| 无间距的相邻面板 | 面板父容器 | 父容器画外框，后续子项只画一条起始分隔线 |
| 有间距的独立卡片 | 卡片自身 | 每张卡片完整 1px 边框，间距保证不会重叠 |
| 图示内部连接线 | 图示组件 | 与 rail / 区块线分层，不借用边框拼接 |

横向分割线按用户指定的 [Attio](https://attio.com/) 参考行为做 full-bleed：无论屏幕比 1400px rail 宽多少，分割线都触达左右视窗边缘，不在 rail 两侧留下空白。结构上每个区块必须先有 `width: 100%` 的外层，再在其中放居中的 rail inner；外层拥有横线，inner 只拥有两侧竖线。优先使用正常文档流中的全宽外层，避免用 `width: 100vw` 从 rail 内强行穿出，因为 `100vw` 可能把滚动条宽度计入并制造页面横向溢出。

```text
Home viewport / iframe content viewport
└─ section full-bleed（width: 100%；唯一横向 border 所有者）
   └─ section__rail（width: min(100% - gutters, 1400px)；唯一竖向 border 所有者）
      └─ section content
```

该规则与既有三档适配和 `--layout-content-max: 1200px` 不冲突：断点控制内容重排，1200px Token 仍服务原有公共容器；Home 的 1400px rail 只约束内容与竖向描边，横向分割线从适配容器约束中明确排除。Home 位于 iframe 时，“视窗”指 iframe 内容视窗；shell 必须让 iframe 宽度为 100%，无需为横线增加 `postMessage` 或跨层 DOM 操作。

窄屏从多列切单列时，原来的竖向分隔线应切换成横向分隔线或独立卡片边框；不能继续保留桌面方向的线条。区块 full-bleed 底线仍保持整屏宽。底纹与内容之间使用伪元素或独立装饰层，并设为 `pointer-events: none`。

## 6. Dot 与 Line 底纹的代码实现

### 6.1 Dot field

Figma 中“全链贯通”“安全可控”“科研基座能力”和合作 CTA 的点阵由大量椭圆节点组成。抽样结果为：

- 单点尺寸：`2 × 2px`。
- 横纵步进：`14px`。
- 颜色：`--dot = #ebe6da`。
- 大底纹原始范围约 `1712 × 870px`；合作 CTA 使用同节距的裁切区域。

代码中使用单层 `radial-gradient` 生成 2px 圆点，并以 `14px 14px` 为背景单元。底纹放在区块内部的绝对定位装饰层，由区块裁切，不创建数千个 DOM 节点，也不导出点阵图片。不同区块只配置裁切范围和 background-position，不复制点阵规则。

### 6.2 Line grid

“科研基座 Banner”背景为约 `60px` 步进的水平/垂直浅色网格，并带弱虚线感。实现策略：

- 使用两个独立装饰层分别生成水平线与垂直线，间距约 60px。
- 首选 CSS gradient + mask 形成短划线；不支持 mask 时降级为 1px 实线网格。
- 网格颜色消费 `--line-soft` 或经 Figma 再核对后的专用弱线 Token。
- 左侧层叠科研图和右侧地球仍使用图片；网格和线性定位点不与图片合成，保证适配时可单独缩放和裁切。
- 图示中的流程连接线属于组件结构，不与背景网格共用伪元素。

## 7. 组件规划

本项目不引入 React、Tailwind 或 Web Component 框架。这里的“组件”指稳定的语义 DOM、集中 CSS class、modifier 和必要的局部 JS 控制器。样式改变只改组件规则，不逐个修改所有实例；产品文案仍保留在可检索、可访问的 HTML 中。

### 7.1 Shell / 公共候选组件

| 组件 | 责任 | 初始归属 | 复用控制点 |
| --- | --- | --- | --- |
| `SiteHeader` | Logo、导航、主要 CTA、折叠菜单挂载点 | shell | 高度、间距、active、紧凑模式 |
| `BrandLogo` | Header / Footer / compact 品牌图 | 资源共享，结构各自拥有 | 尺寸变体和替代文本 |
| `PrimaryButton` | 在线使用、申请合作等深色按钮 | 消费现有 Design System `.btn-primary`；产品接入后登记 shell / Home 消费者 | 高度、padding、圆角、hover / focus / active |
| `ShellDialogHost` | 覆盖 Navigation 与 iframe 的 Dialog、焦点与遮罩 | shell；视觉复用现有 Design System Dialog，业务 schema 由 Home 提供 | 宽度、最大高度、关闭规则、焦点恢复 |
| `SiteLinkConfig` | 网页版统一外链 `https://discovery.intern-ai.org.cn/` | `shared/js/site-links.js`（规划中）；shell 与 Home 两个真实消费者 | URL、打开方式、后续统计挂点 |

### 7.2 Home 布局与视觉原语

| 组件 | 责任 | 主要变体 |
| --- | --- | --- |
| `HomeRailSection` | 全视窗区块底线、1400px 内层 rail、裁切和节奏 | `plain`、`dot-field`、`line-grid` |
| `SectionHeading` | 二级标题 + 720px 最大宽度副标题 | 默认、紧凑 |
| `DotField` | 2px / 14px 点阵装饰 | background-position / 裁切高度 |
| `LineGrid` | 60px 代码网格 | 实线 fallback、虚线增强 |
| `DiagramNode` | 证据链、流程图中的节点 | neutral、accent、success、warning |
| `DiagramConnector` | 流程线、接入线 | 水平、垂直、折线；9 个代码化 `image-` 图示（含证据链 7 个状态）中几何锁定，其他模块只有经设计确认的纯装饰线可降级 |
| `RevealGroup` | 观察可见性、按顺序切换入场状态 | once、left-to-right、step-sequence；无 JS 默认可见 |
| `ParallaxLayer` | 只写入局部滚动进度和位移变量 | slow、medium；不拥有响应式缩放 transform |
| `MarqueeViewport` / `MarqueeTrack` | 无缝横向循环与边缘遮罩 | right-fade、both-fades、paused |

这些组件当前只有 Home 消费，全部留在 `tabs/home/home.css` 和 `home.js`。只有出现第二个产品模块并验证形态稳定后，才提升到 `shared/`。

### 7.3 Home 业务组件

| 组件 | 对应区块 | 可集中控制的内容 |
| --- | --- | --- |
| `HeroSection` | Hero | 标题宽度、CTA、浏览器画框、装饰卡位置与降级 |
| `BrowserMockup` | Hero 屏幕 | 顶栏圆点、圆角、阴影、截图比例 |
| `AdvantageGrid` / `AdvantageCard` | 平台核心优势 | 3×2 / 2×3 / 1 列、图片尺寸、文案间距 |
| `ResearchFlow` / `FlowStage` | 全链贯通 | 1400 × 340px 参考画布、6 个阶段、反馈回路、连接线、分阶段显示和整体等比缩放 |
| `DisciplineShowcase` | 学科纵深 | 六大学科图、资源分区、卡片展示窗口 |
| `OutputGallery` / `OutputCard` | 产物原生 | `featured` 与 `compact` 两种卡片变体 |
| `EvidenceChain` / `EvidenceProgressTabs` | 科研证据链 | 7 个进度 Tab、5 秒自动轮播、手动切换、面板与连接线 |
| `SecurityDiagram` | 安全可控 | Figma 节点 `198:35475` 的单张 1400×500 PNG、替代文本和整图等比适配 |
| `EcosystemDiagram` | 生态开放 | Figma 节点 `198:35502` 的单张 868×580 PNG、替代文本和整图等比适配 |
| `ResearchFoundationBanner` | 科研基座 Banner | 网格、两张装饰图、中心说明卡 |
| `CapabilityGrid` / `CapabilityCard` | SCP / Intern-S2 / World Model | 三列布局、能力条目和状态图标 |
| `ResearchFoundationStage` | 科研基座 Banner + 能力 | 相邻文档流、Banner 同步离场、能力区顺序进入 |
| `CaseShowcase` / `CaseTabs` | 科研案例 | 10 个案例、active、详情标题、主图、联合单位和键盘切换 |
| `PartnerLogoWall` / `PartnerLogoTile` | 合作共建 | 三排无缝循环、双侧遮罩、统一容器和 60×60px Logo |
| `CooperationCTA` / `CooperationFormSchema` | 合作共建尾部 | 点阵背景、申请合作按钮、字段定义、校验和 shell 弹窗请求 |
| `DownloadGrid` / `DownloadCard` | 下载客户端 | 平台图标、平台名、架构/状态说明 |
| `SiteFooter` / `FooterLinkGroup` | Footer | 品牌、链接组、二维码、法律信息重排 |

`EvidenceProgressTabs` 与 `CaseTabs` 当前都只服务 Home，先共享一个 Home 私有的 `HomeTabController` 状态核心，样式分别留在对应业务组件 modifier 中；不把“Tab”提前写进 Design System。只有第二个非 Home 产品模块出现相同 ARIA、键盘和状态合同后，才提炼公共 Tab，并同步 `components.html`。`ShellDialogHost` 则不同：合作弹窗必须覆盖吸顶导航，且 Design System 已有 Dialog 基线，因此实现时直接把该候选公共组件接入 shell，而不是在 iframe 内再做一套遮罩。

除产品明确指定为整图 PNG 的 `image-safecontrol` 与 `image-open-ecosystem` 外，代码化复合图示应保持文本为 HTML、图标为真实导出资产、连接线为 CSS/SVG 结构。这两张整图不再承担分节点动画；页面必须提供完整替代文本，并只对整图做等比缩放和完整显示。

## 8. `image-` 图层与资源归属

### 8.1 盘点结论

2026-08-21 首次只遍历页面目标根节点时找到 25 个以 `image-` 开头的图层；该结果漏掉了科研证据链实例所引用组件集 `168:1325` 中的其他变体。补充展开 7 个变体后，本次检查快照修正为 **32 个**：其中 9 个是包含文本、节点、连接线或矢量的复合图示 Frame，继续代码化；其余 23 个使用 Figma 返回的原始 PNG 或精确导出图。`image-safecontrol` 与 `image-open-ecosystem` 虽然是复合图示，但按产品决定分别从节点 `198:35475`、`198:35502` 导出整图 PNG。前缀只是 Figma 命名约定，不等于每个图层都是单张位图。

后续盘点不能只递归页面当前可见实例：必须同时解析页面使用到的 Component / Instance 引用，并继续扫描对应 Component Set 的全部产品状态。实施启动时仍须重新盘点数量、节点 ID 和类型，8.2 清单按差异刷新后再导出。

Figma MCP 资产 URL 约 7 天失效。实现时必须下载并提交真实字节，不把临时 URL 写入代码，也不自行重绘图片内容。

### 8.1.1 Figma 图片自动导出流程

用户不需要手动保存本文清单中的 Figma 图片。实际开始实现时，由执行方按模块自动完成以下流程：

1. 对该模块当前节点重新调用 `get_design_context` 并取得独立截图，先确认 `image-` 图层名称、节点 ID、裁切、蒙版、阴影和实际自然尺寸仍然有效；随后解析页面 Instance 引用，对其 Component Set 的全部业务状态继续执行同样盘点，不能只记录页面当前展示的一个变体。
2. 对清单内每个最终图片节点调用 Figma 资产下载能力：普通图片优先取得原始上传字节；若 Figma 的裁切、蒙版、混合或效果属于最终视觉，则导出该节点的最终 render；图标和复杂矢量取得 Figma 原始 SVG。不能从截图裁图代替可获得的原始资产。
3. 按 8.2 的目标目录自动保存真实文件，先写临时文件并验证 MIME、扩展名、尺寸和非零字节，再替换由同一 Figma 节点生成的旧运行时资产；不覆盖科研案例、合作 Logo 等用户提供的独立源文件。
4. 同步生成 `tabs/home/assets/figma-assets.manifest.json`，每项至少记录 `nodeId`、`layerName`、`checkedAt`、Figma 自然尺寸、导出方式、输出路径、字节数和 SHA-256；来自组件变体的资产另记录 `componentSetNodeId`、`variantNodeId` 和业务 `stateKey`。代码只引用仓库内稳定路径，不引用 7 天临时 URL。
5. 下载后以同次 Figma 截图做 1440px 对照，再检查 1024 / 768 / 390px 适配。若 Figma 在导出后继续修改，只重新导出 manifest 显示已变化的节点，不让旧图和新布局混用。

只有以下情况才需要用户补图：资源没有实际嵌入 Figma、当前账号无下载权限、资源来自外部受限链接，或同一 `image-` 层存在多个无法从设计判断的候选原图。当前已放入仓库的科研案例图和合作 Logo 直接使用本地源文件，不需要再从 Figma 重复导出。正式实现已保存 183 个 Figma 导出资产与 10 个用户提供的科研案例 PNG；运行时只引用仓库内稳定路径，不引用会过期的 Figma 临时 URL。

### 8.2 图片与复合图示清单

| Figma 图层 | 节点 | 类型 / 落地方式 | 目标位置 |
| --- | --- | --- | --- |
| `image-herosection-screen` | `198:27539` | PNG | `tabs/home/assets/images/hero/image-herosection-screen.png` |
| `image-herosection-decoration03` | `198:27540` | PNG 装饰卡 | `tabs/home/assets/images/hero/image-herosection-decoration03.png` |
| `image-herosection-decoration01` | `198:27544` | PNG 装饰卡 | `tabs/home/assets/images/hero/image-herosection-decoration01.png` |
| `image-herosection-decoration02` | `198:27554` | PNG 装饰卡 | `tabs/home/assets/images/hero/image-herosection-decoration02.png` |
| `image-highlight01` | `198:53844` | PNG | `tabs/home/assets/images/highlights/image-highlight01.png` |
| `image-highlight02` | `198:53849` | PNG | `tabs/home/assets/images/highlights/image-highlight02.png` |
| `image-highlight03` | `198:53847` | PNG | `tabs/home/assets/images/highlights/image-highlight03.png` |
| `image-highlight04` | `198:53859` | PNG | `tabs/home/assets/images/highlights/image-highlight04.png` |
| `image-highlight05` | `198:53861` | PNG | `tabs/home/assets/images/highlights/image-highlight05.png` |
| `image-highlight06` | `198:53857` | PNG | `tabs/home/assets/images/highlights/image-highlight06.png` |
| `image-flow` | `198:27602` | **复合图示，代码化** | 不生成整图；需要的真实图标放 `tabs/home/assets/icons/flow/` |
| `image-six-subject` | `210:53949` | **复合图示，代码化** | 不生成整图；图标放 `tabs/home/assets/icons/disciplines/` |
| `image-output01` | `198:27745` | PNG | `tabs/home/assets/images/outputs/image-output01.png` |
| `image-output02` | `198:27751` | PNG | `tabs/home/assets/images/outputs/image-output02.png` |
| `image-output03` | `198:27757` | PNG | `tabs/home/assets/images/outputs/image-output03.png` |
| `image-output04` | `198:27765` | PNG | `tabs/home/assets/images/outputs/image-output04.png` |
| `image-output05` | `198:27771` | PNG | `tabs/home/assets/images/outputs/image-output05.png` |
| `image-output06` | `198:27777` | PNG | `tabs/home/assets/images/outputs/image-output06.png` |
| `image-output07` | `198:27783` | PNG | `tabs/home/assets/images/outputs/image-output07.png` |
| `image-chain01` | `168:938`（内部图示 `221:2138`） | **复合图示，代码化**；文献综述及引用网络 | 不生成整图；精确 SVG / 图标放 `tabs/home/assets/icons/evidence-chain/chain01/` |
| `image-chain02` | `168:896`（内部图示 `221:2805`） | **复合图示，代码化**；数据统计结果 | 不生成整图；精确 SVG / 图标放 `tabs/home/assets/icons/evidence-chain/chain02/` |
| `image-chain03` | `168:1296`（内部图示 `226:3362`） | **复合图示，代码化**；论文插图 | 不生成整图；精确 SVG / 图标放 `tabs/home/assets/icons/evidence-chain/chain03/` |
| `image-chain04` | `168:1015`（内部图示 `226:4390`） | **复合图示，代码化**；分析代码 | 不生成整图；精确 SVG / 图标放 `tabs/home/assets/icons/evidence-chain/chain04/` |
| `image-chain05` | `168:1057`（内部图示 `226:4487`） | **复合图示，代码化**；Tab 为“仿真结果”，内部层当前名为“仿真结构” | 不生成整图；精确 SVG / 图标放 `tabs/home/assets/icons/evidence-chain/chain05/` |
| `image-chain06` | `168:1073`（内部图示 `226:4769`） | **复合图示，代码化**；实验设计 | 不生成整图；精确 SVG / 图标放 `tabs/home/assets/icons/evidence-chain/chain06/` |
| `image-chain07` | `168:1175`（内部图示 `226:4965`） | **复合图示，代码化**；论文草稿 / 技术报告 | 不生成整图；精确 SVG / 图标放 `tabs/home/assets/icons/evidence-chain/chain07/` |
| `image-safecontrol` | `198:35475` | **整图 PNG**；不再代码化拆分 | `tabs/home/assets/images/security/image-safecontrol.png` |
| `image-open-ecosystem` | `198:35502` | **整图 PNG**；不再代码化拆分 | `tabs/home/assets/images/ecosystem/image-open-ecosystem.png` |
| `image-worldmordel` | `198:35630` | 透明背景 PNG；禁止添加容器背景、圆角、`box-shadow` 或 `drop-shadow`；Figma 拼写保留用于追溯 | `tabs/home/assets/images/research-base/image-worldmordel.png` |
| `image-interns2` | `198:35631` | 透明背景 PNG；禁止添加容器背景、圆角、`box-shadow` 或 `drop-shadow` | `tabs/home/assets/images/research-base/image-interns2.png` |
| `image-ResearchCases-Achievements01` | `198:51080` | Figma 当前首个案例 PNG；本地已提供 01–10 全量案例图 | `tabs/home/assets/images/research-cases/image-research-cases-achievements01.png` 至 `...10.png` |
| `image-intern-QRcode` | `220:62071` | PNG | `tabs/home/assets/images/footer/image-intern-qrcode.png` |

除清单中已确定作为运行时整图的 `image-safecontrol` 与 `image-open-ecosystem` 外，如实施阶段确实需要代码化复合图示截图用于人工比对，只能临时导出到任务临时目录；它不进入运行时资源目录，也不能与代码化图示同时成为两个事实来源。

### 8.3 复合图示 1:1 实现合同

9 个“复合图示，代码化”（2 个页面固定图示 + 7 个证据链状态）不能被理解为“按观感重画”。它们必须以 Figma 自然尺寸作为唯一参考坐标系，在实施时页面基准画布上 1:1 复现节点尺寸、中心坐标、连线端点、圆点直径、描边、圆角、阴影和层级；响应式只对完整参考画布做同一比例的二维缩放。`image-safecontrol` 与 `image-open-ecosystem` 不属于该代码化合同，改按 8.2、10.9 与 10.10 的整图 PNG 合同执行。

#### 8.3.1 通用坐标与缩放规则

1. 每个图示组件包含一个流式 wrapper 和一个保持 Figma 自然尺寸的 inner canvas。inner canvas 内的 HTML 节点、图标和覆盖层 SVG 全部使用同一左上角原点和自然坐标，不能分别按视窗百分比猜位置。
2. 缩放因子固定为 `s = min(1, availableWidth / designWidth)`；X、Y 轴必须使用同一个 `s`，禁止非等比拉伸。wrapper 的占位高度为 `designHeight × s`，inner canvas 以顶部居中为变换原点。
3. `ResearchFlow` 及其反馈回路在中等、紧凑宽度都不得创建局部横向滚动，也不得拆成另一套临时折行 DOM。若等比缩放后的文字经产品验收确实不可读，应新增经设计确认的紧凑版，而不是由开发自行引入横向滚动或改变节点拓扑。
4. 文本保留为 HTML，消费 Design System Text Style；图标使用 Figma 返回的原始 SVG。连接线统一放在与节点同坐标系的 SVG overlay 中：直线使用精确 `<line>`，折线/曲线使用精确 `<path>`，端点圆圈使用显式 `<circle cx cy r>`。禁止用字符 `●`、border 拼接或近似箭头替代。
5. 圆点与节点圆圈必须按 Figma 的外径、圆心、fill、stroke、stroke-width 和 `box-sizing: border-box` 复现；连接线端点以节点锚点或设计坐标为准，不能因为容器缩放而重新按百分比计算。整图缩放时描边也随 inner canvas 等比缩放，不使用 `vector-effect: non-scaling-stroke`。
6. SVG/DOM 分层固定为：背景底纹 → 连接线与端点 → 节点底板 → 文本/图标/状态 Badge。连接层设 `pointer-events: none`；需要动画时只改变各层的 opacity、transform 或 SVG stroke reveal，不改写最终几何。
7. Figma 中的 `0.75px`、`43.471px`、`106.878px` 等亚像素值应保留到 CSS/SVG，不在录入阶段擅自取整。复杂多边形、品牌图形和弧线直接下载 Figma 导出的 SVG；不要用 CSS `clip-path` 或手工路径近似。
8. 验收至少在 1440px 做自然尺寸像素对照，并在 1024、768、390px 检查同构缩放。对照范围包括节点包围盒、圆点圆心、连线起止点、文字基线、阴影外扩和图示 wrapper 占位高度；不得只看整区块轮廓。

#### 8.3.2 2026-08-21 图示几何检查快照

| 图示 | Figma 自然尺寸 | 必须锁定的当前几何 |
| --- | --- | --- |
| `image-flow` `198:27602` | `1400 × 340` | 当前 6 个阶段几何为：问题与假设 `(50,61,320,94)`、实验方案规划 `(405,61,160,94)`、实验验证分析 `(600,61,320,94)`、实验成果输出 `(955,61,160,94)`、成果发布 `(1165,38,140,140)`、实验迭代 `(600,209,530,94)`。主链水平连接线从 x=364/559/914/1109、y=102 起，宽分别为 40/40/40/60；实验迭代反馈垂线位于 `(747,138,12,77)`，由实验迭代顶部圆点向上绘制，箭头尖端与 `(712,137,85,0)` 的“实验数据获取”下划线相接；成果输出回落线位于 `(1029,149,12,60)` 并保持向下。所有子步骤、标题色条和端点以 `228:62880`–`228:62923`、`242:63138` 当前节点为准；不得沿用本文旧版 1400×400 画布或旧主链坐标。 |
| `image-six-subject` `210:53949` | `492 × 408` | 6 个外围学科节点均为 120×120：相对 inner group 位于上排 x=88/236、y=0，中排 x=0/324、y=144，下排 x=88/236、y=288；中心节点为 180×180，位于图示局部 `(132,114)`（Figma 页面坐标为 x=190、y=212）。外围浅圆为 200×200，外层圆为 320×320；图标均为 24×24。圆环、径向连接线和图标使用精确 SVG/几何，不按肉眼重新排成六边形。 |
| `image-safecontrol` `198:35475` | `1400 × 500` | 按最新实现决定从该节点直接导出完整 PNG；文字、六边形、图标、连线和端点均烘焙在同一图片内。页面只做整图等比缩放与完整显示，不再拆分或用 HTML/CSS/SVG 重绘内部元素。 |
| `image-open-ecosystem` `198:35502` | `868 × 580` | 从该节点直接导出完整 PNG；六个输入卡、汇聚路径、端点圆圈、中心节点、椭圆底座和品牌 Logo 均烘焙在同一图片内。页面只做整图等比缩放与完整显示，不再拆分或用 HTML/CSS/SVG 重绘内部元素。 |

表中的数值只表示 2026-08-21 检查时的几何，不再声明为未来实现验收基线。实际实现前必须用同一节点 ID 重新读取自然尺寸与子层坐标，并把刷新后的结果写入本地 manifest；同次 manifest 才是该轮开发和截图验收的锁定事实。这样既能追溯设计变化，也不会依赖临时资产 URL、旧文档数字或文件名猜测来源。

#### 8.3.3 科研证据链 7 个复合图示合同

本次已分别读取并截图核对 `image-chain01`—`image-chain07`。7 个外层图层当前都为 `960 × 480px`，内部有效图示都为 `800 × 480px` 并位于外层 `x=80, y=0`；这组共同尺寸是 2026-08-21 检查快照，实施时仍由 manifest 刷新。

| 顺序 / Tab | 组件状态节点 | `image-chain` 外层节点 | 内部图示节点 / 当前名称 |
| --- | --- | --- | --- |
| 1 文献综述及引用网络 | `168:1204` | `168:938` `image-chain01` | `221:2138` 文献综述及引用网络 |
| 2 数据统计结果 | `168:1205` | `168:896` `image-chain02` | `221:2805` 数据统计结果 |
| 3 论文插图 | `168:1317` | `168:1296` `image-chain03` | `226:3362` 论文插图 |
| 4 分析代码 | `168:1207` | `168:1015` `image-chain04` | `226:4390` 分析代码 |
| 5 仿真结果 | `168:1208` | `168:1057` `image-chain05` | `226:4487` 仿真结构；实现业务名称以 Tab“仿真结果”为准 |
| 6 实验设计 | `168:1209` | `168:1073` `image-chain06` | `226:4769` 实验设计 |
| 7 论文草稿 / 技术报告 | `168:1246` | `168:1175` `image-chain07` | `226:4965` 论文草稿/技术报告 |

每个状态使用独立的 `EvidenceChainPanel`，文字、卡片、标签和可读数据用 HTML/CSS 并绑定 Design System Token；流程连接线、端点圆圈和几何图形使用与该状态同坐标系的 SVG overlay，复杂矢量与图标从对应 Figma 子节点精确导出到 `tabs/home/assets/icons/evidence-chain/chain01/`—`chain07/`。禁止把 `960 × 480px` 外层整体导成运行时 PNG，也禁止让 7 个状态共用一套靠改文字和近似移位拼出的连接线。

manifest 必须为每个 `image-chain` 状态保留外层节点、内部图示节点、组件状态节点、自然尺寸、子资产来源节点和输出路径；1440px 验收时逐状态切换并截图对照，不能只验默认的 `image-chain01`。非 active 面板需从可视与辅助技术树中正确隐藏，但不得因此延迟到首次切换时才下载关键 SVG 导致闪烁。

### 8.4 Logo 使用映射

| 场景 | 使用文件 | 说明 |
| --- | --- | --- |
| Navigation 品牌 Logo | `shared/assets/logos/duanyan-default.svg` | 文件尺寸 `120 × 32`，与 Figma Navigation 一致 |
| Footer 品牌 Logo | `shared/assets/logos/duanyan-default.svg` | 按容器宽度缩放，不重复导出 Figma Logo |
| 浏览器 favicon | `shared/assets/logos/favicon.svg` | shell 与 Home 独立入口都应声明 |
| 紧凑品牌图标候选 | `shared/assets/logos/Logo.svg` | 仅在紧凑导航确需只显示图标时使用 |

`shared/assets/logos/书生logo.png` 是 108px 品牌图标，不默认替换 Figma 下载卡中的网页版图标；两者需要先做视觉核对。

合作机构 Logo 不属于上述 25 个 `image-` 图层。现已放入 `shared/assets/orgs/partners/`：共 38 个 SVG，其中 `line1-` 12 个、`line2-` 12 个、`line3-` 14 个；全部文件都符合 `^line[123]-.+\.svg$`，XML 可解析，未发现 `<script>`、`foreignObject` 或 HTTP 外链。`PartnerLogoTile` 只引用该目录，不把机构 Logo 塞进 Home 通用图片目录。

分行与数据规则固定如下：

1. 文件名以 `line1-`、`line2-`、`line3-` 开头的 Logo 分别进入第一、第二、第三行；前缀是布局数据，不参与可见机构名称和 `alt`。
2. 三行固定为 12、12、14 个互不重复的机构，顺序写入 Home 私有 `tabs/home/data/partner-logos.data.js`。浏览器运行时不扫描目录；后续若要精确调整顺序，应同步修改数据数组及对应文件前缀。
3. 不匹配三个前缀之一的新增文件视为未分配资源，资源检查必须报错，不能默默塞入任意一行。marquee 的第二份循环内容由组件克隆数据并设 `aria-hidden`，源数组不重复维护。
4. 当前 38 个 SVG 总计约 9.12MiB，其中 24 个包含嵌入式 image 数据。浏览器对重复 marquee 的同 URL 会复用网络缓存，但首屏传输仍需关注；正式上线前保留这些原始文件，另做无损 SVG 优化或 60px 显示所需的 2x 运行时衍生物，并在截图对照通过后让数据文件引用优化版本，不直接覆盖用户提供的源 Logo。

### 8.5 科研案例补充素材盘点与迁入方案

已只读盘点 `C:\Users\wangyiting1\Downloads\科研成果素材`：目录中有 `RESEARCH_CASES.md` 和 10 张 `3200 × 1800` PNG，命名从 `image-research-cases-achievements01.png` 连续到 `...10.png`，单文件约 1.3–8.1MB。文案包含稳定 ID、成果名称、联合单位、一级领域、二级方向和核心亮点，10 个 ID 依次为 `amix`、`earth-o1`、`brainomni`、`virahunter`、`virtual-heart-cell`、`sigma-brains-lab`、`ceno`、`fuyiao`、`electroplating-materials`、`chip-design-agents`。

后续实现不直接引用 Downloads 绝对路径，也不移动或删除原始素材。执行顺序为：

1. 把 10 张源图复制到 `tabs/home/assets/images/research-cases/`，保持编号文件名；原始目录继续作为交付源备份。
2. 将 `RESEARCH_CASES.md` 中的字段转为 `tabs/home/data/research-cases.data.js` 的静态数据数组。选择 `.js` 而不是运行时 `fetch` JSON，是为了保证 Home 通过静态服务器和直接打开时都不依赖异步文件请求。
3. 数据项固定包含 `id`、`title`、`partners`、`primaryField`、`secondaryField`、`highlight`、`image`、`imageAlt`；Tab 与详情面板只消费这一份数组，禁止在 HTML 和 JS 各维护一套文案。
4. 3200×1800 原图作为源资产先保留；上线前根据 Figma 实际显示尺寸生成 WebP/AVIF 候选和 1x/2x 响应式版本，完成截图对照后再决定是否保留 PNG fallback。不得在未核对文字与锐度前只为压缩体积覆盖源文件。

## 9. 本设计稿的适配方案

### 9.1 断点合同

沿用现有三档断点，不新增设备型断点：

| 模式 | 宽度 | 本页总体行为 |
| --- | --- | --- |
| 宽屏 | `>= 1200px` | 完整导航，多列布局，1400px rail 流式收敛；1440px 时精确为 1400px + 两侧 20px |
| 中等 | `768px - 1199px` | 导航收合，3 列降 2 列，左右分栏改上下；复合图示按固定参考画布整体等比缩放 |
| 紧凑 | `< 768px` | 单列阅读顺序，纯装饰降级；复合图示继续整体等比缩放，页面根和流程图均禁止横向滚动 |

验收宽度沿用 `390 / 768 / 1024 / 1440px`，并抽查 `1199 / 1200px` 与 `1439 / 1440px` 两组临界宽度。

### 9.2 Rail 与排版

- rail 在 1440px 时宽 1400px；不足 1440px 时以左右稳定 20px gutter 流式缩窄。
- 横向区块分割线不属于 rail 宽度计算，在所有断点都由 full-bleed section 撑满当前视窗；大屏上 rail 两侧也不得出现断线或空白。
- rail 的左右 gutter 只影响内容和竖向描边，不应被复用为横向分割线的 inline margin。
- Hero 不受 rail 侧边框约束，但标题、说明和浏览器画框应使用 `max-width` 与流式宽度。
- Hero 64px 主标题在窄屏平滑收敛，二级标题从 40px 收敛；正文不低于现有可读字号。
- DOM 按紧凑模式阅读顺序书写，桌面双栏、三栏仅由 CSS 增强，不复制两套内容。

### 9.3 各模块降级规则

| 模块 | 宽屏 | 中等 | 紧凑 |
| --- | --- | --- | --- |
| Navigation | 完整 5 项 + CTA | Logo、当前页、菜单、主要 CTA | Logo、菜单；主要 CTA 保持可访问，不挤成两行 |
| Hero | 居中标题、1068px 屏幕、3 张浮动装饰 | 屏幕流式缩放，装饰卡向边缘收拢 | 屏幕满可用宽度；装饰卡可隐藏或只保留 1 张，核心标题/CTA 不隐藏 |
| 优势卡 | 3 × 2 | 2 × 3 | 1 列；图片与标题同行或上置 |
| 全链贯通 | 1400×340 单画布流程；分 6 阶段揭示 | 整体等比缩放到可用宽度，不产生局部横向滚动 | 继续整体等比缩放，保持节点拓扑、反馈回路和画布比例，不临时改纵向流程 |
| 学科纵深 | 学科图 + 右侧 3 组无缝资源轨道并排 | 上下堆叠；492×408 学科图等比缩放；轨道仍裁切在自身视窗 | 学科图保持原拓扑整体等比缩放；资源轨道可降速，右侧遮罩保留，左侧不加遮罩 |
| 产物原生 | 3 张主卡 + 4 张次卡 | 2 列 | 1 列；保持图片比例 |
| 科研证据链 | 左侧 7 个进度 Tab + 右侧图示 | Tab 置于图示上方并允许换行，不依赖横向滚动 | Tab 纵向堆叠在当前面板上方；来源节点按阅读顺序重排，纯装饰连接线可隐藏 |
| 安全可控 | 1400×500 中心三原则 + 六个外围说明 | 完整图示整体等比缩放，不重算多边形或连线 | 完整图示继续整体等比缩放；如需额外可读文本只能增加经产品确认的辅助说明，不改图示几何 |
| 生态开放 | 868×580 六类入口汇聚到中心 | 完整图示整体等比缩放，不改为 3×2 重排 | 完整图示继续整体等比缩放，保留六条汇聚路径和品牌落点 |
| 科研基座 Banner | 按 Banner→能力的正常文档流滚动；中心卡 + 两张视差图 | 保持正常文档流，装饰图缩放、中心卡流式 | 保持 Banner→能力正常文档流展示；网格仍填满 Banner |
| 三项基座能力 | 3 列 | 2 + 1 | 单列；条目不压缩成难读小字 |
| 科研案例 | 左侧 10 项 Tab + 右侧详情 | Tab 置顶并换行/分列，详情下置 | Tab 纵向列表或紧凑两列换行，详情单列，主图等比缩放；不把整页带出横向滚动 |
| 合作 Logo | 三排无缝横向循环，双侧渐隐 | 降低速度并保持双侧渐隐 | 保持自动循环；减少动态模式下停止循环并改为可换行静态 Logo 列表 |
| 下载卡 | 5 张并排 | 3 + 2 | 1 或 2 列，以 160px 最小可读尺寸决定 |
| Footer | 品牌 + 4 列链接 | 2 列链接 | 单列/折行，备案和协议上下排列 |

上述 9 个代码化复合图示与安全可控、生态开放两张整图 PNG 均不得采用局部横向滚动；其 wrapper 只负责计算比例和占位高度。证据链与科研案例 Tab 通过换行或纵向重排适配；只有已明确要求连续运动的学科资源轨道和合作 Logo wall 在自身裁切 viewport 内运行 marquee，不能把该例外扩展到流程图、Tab 或复合图示。

## 10. 模块效果与交互执行方案

### 10.1 共享滚动、外链与状态合同

Home iframe 自身是内容滚动容器；shell 只固定 Navigation、承载 iframe 和处理 shell 级 Dialog。所有滚动进度、视差、入场观察和 sticky 场景都在 Home 文档内计算，不让 shell 逐帧转发滚动位置。Home 独立打开时使用同一套控制器，只把顶部偏移切换为本地导航高度。

统一锚点表如下；Navigation 与 Footer 不各写一套选择器：

| 文案入口 | 目标 ID | 对应区块 |
| --- | --- | --- |
| 平台核心优势 / 核心能力 | `home-advantages` | 平台核心优势 |
| 平台工作流 | `home-workflow` | 全链贯通 |
| 科研基座 | `home-research-foundation` | 科研基座 Banner / 能力联合 stage |
| 科研成果 / 科研案例 | `home-research-cases` | 科研案例 |
| 合作共建 | `home-cooperation` | 合作共建 |
| 下载客户端 | `home-downloads` | 下载客户端 |

- shell Navigation 点击锚点后发送 `home:anchor:scroll`，载荷为 `{ requestId, anchorId, behavior: "smooth" }`；Home 完成定位后返回 `home:anchor:scrolled`。协议实现前必须登记到 `ITERATION_ARCHITECTURE_MAP.md`，shell 校验消息来源，Home 只接受上述白名单 ID。
- Footer 位于 Home 内，直接调用同一个 `HomeAnchorController.scrollTo(anchorId)`，不绕行 `postMessage`。锚点使用 `scroll-margin-block-start`；shell 模式按 iframe 顶部实际布局偏移，独立模式按本地 Navigation 69px 加阅读留白计算。
- 平滑滚动使用浏览器原生 `scrollIntoView({ behavior: "smooth", block: "start" })`；`prefers-reduced-motion: reduce` 时切换为即时定位。定位完成后把焦点移到目标区块标题，但不造成第二次滚动，确保键盘和读屏用户知道位置已变化。
- 所有“在线使用”“网页版”统一读取 `SiteLinkConfig.discoveryWebApp`，值为 `https://discovery.intern-ai.org.cn/`。真实链接使用 `<a target="_blank" rel="noopener noreferrer">`，不以 `window.open()` 伪装链接，也不为没有 URL 的卡片制造空链接。
- Home 只注册一个被动 scroll listener，并在 `requestAnimationFrame` 中计算当帧所有 scroll-linked 进度；入场触发使用 `IntersectionObserver`，尺寸变化使用 `ResizeObserver`。CSS 最终只接收 `--scroll-progress`、`--parallax-y` 等数值，避免每个模块各装一套高频监听器。
- 响应式等比缩放和动画 transform 必须分层：外层 canvas 只控制设计画布缩放，内层 motion wrapper 才控制 translate / scale / opacity。两类 transform 不得写在同一元素上。

### 10.2 Navigation

1. `SiteHeader` 在 shell 中使用 `position: sticky; top: 0; z-index` 高于 iframe；高度在实现前从 Navigation 当前节点刷新为 `--site-header-height`（2026-08-21 快照为 69px），底部分割线和背景色始终保持，不随 Home 内容退场。
2. 中间 5 个按钮组以 Navigation 自身为定位容器，使用几何中心定位，使按钮组同时在当前 header 高度内垂直居中、相对浏览器视窗水平居中；不能用左右剩余空间的 `justify-content: space-between` 推算中心，否则 Logo 与 CTA 宽度不等时会偏移。
3. 5 个按钮消费 10.1 的锚点表并走 shell→Home 消息协议。按钮用真实 `<button type="button">`；shell 点击时立即投递并保留最后一次有效锚点请求，收到 `home:ready` 或 iframe `load` 时补投，直到收到匹配的 `home:anchor:scrolled` 才清除，避免一次性就绪消息或 iframe 重载造成请求丢失；不用固定延时猜 iframe 加载完成。
4. Navigation Logo 外包一层 `<button type="button">`，点击或键盘激活时执行当前浏览器页面刷新；shell 模式调用 `window.location.reload()`，从而同时重载 shell 与 Home iframe，独立 Home fallback 则刷新当前 Home 文档。按钮使用 `aria-label="刷新页面"`，图片本身避免重复朗读；不把 Footer Logo 变成刷新按钮。
5. “在线使用”消费 Design System 主按钮样式，是真实外链并新开标签页。紧凑模式的折叠菜单仍引用同一数据表，不能复制另一组 URL 和锚点。

### 10.3 Hero

Hero 拆成 `HeroIntroduction`、`HeroScreenStage` 和 3 个 `HeroDecorationCard`。Introduction 的退场与滚动可逆：用户向下滚动时消失，向上滚动时按同一进度恢复。

- 退场进度从 Introduction 顶部进入滚动起点开始，到约 `min(0.6 × viewportHeight, introductionHeight + 120px)` 的滚动距离结束；实际边界在浏览器截图验收时微调为 Home 私有参数，不写死到公共 Token。
- 进度 `0→1` 对应 `translateY(0→96px)`、`filter: blur(0→12px)`、`scale(1→0.7)`、`opacity(1→0)`；“缩小 70%”在本合同中明确解释为最终尺寸为原尺寸 70%，不是缩到 30%。变换原点为中心，`opacity < .05` 时关闭 pointer events，DOM 不删除。
- `HeroScreenStage` 的屏幕主体与三张装饰图分别包一层 `ParallaxLayer`。屏幕最大位移控制在约 20–24px，装饰图按远近层使用约 18–40px 的不同方向/幅度，进度由该 stage 穿过视窗的相对位置计算；视觉验收不允许产生元素追赶鼠标或脱离 Figma 锚点的强视差。
- 外层仍负责屏幕和装饰图的响应式定位，视差只作用于内层。窄屏被隐藏的纯装饰图不参与计算。减少动态模式下 Introduction 保持可见、视差归零，只保留正常页面滚动。
- Hero “在线使用”与 Navigation 使用同一外链配置并新开标签页。

### 10.4 平台核心优势

该区块不挂 JS。`AdvantageGrid` 在宽屏为 3×2、中等为 2×3、紧凑为单列；卡片用统一 `AdvantageCard` DOM 和 modifier 控制图像位置，不能为 6 张卡复制独立宽高规则。图片容器锁定 Figma 比例并 `object-fit: contain`，文字区允许自然增高；同一行通过 Grid stretch 等高，断点降列后不设置固定卡高，避免长文案溢出。

### 10.5 全链贯通

`ResearchFlow` 以实施时 `image-flow` 当前节点的自然坐标画布实现，不产生局部横向滚动；2026-08-21 文档快照是 `1400 × 340`，如设计已变化则由同次 manifest 自动替换该数值。所有节点、连接线和端点先完成 1:1 静态终态，再增加入场状态。

1. 按 `问题与假设 → 实验方案规划 → 实验验证分析 → 实验成果输出 → 成果发布 → 实验迭代` 为节点和相关连接线标记 `data-flow-stage="1"` 至 `6`。阶段 6 虽在画布下方形成反馈回路，播放顺序仍严格最后。
2. 区块约 25% 进入视窗时只触发一次。每阶段使用约 380ms 的 `opacity + translateY(12px)` 入场，相邻阶段起点间隔约 220ms；进入该阶段的连接线在节点出现前后用约 280ms 的 SVG `stroke-dashoffset` 展开，完整过程约 1.5s，不逐个播放阶段内的小字。
3. 最终几何始终是实施前刷新并写入 manifest 的 Figma 坐标；8.3.2 只用于历史差异检查。动画只改 opacity、内部位移和线条显隐，不在播放时重新计算端点。脚本失败或减少动态模式下直接显示完整终态。

### 10.6 学科纵深

整个 `DisciplineShowcase` 在首次进入视窗时从左到右展示：左侧六学科图先以 `translateX(-32px) + opacity` 进入，右侧标题和 3 条资源轨道依次以 120ms stagger 跟进；单项时长约 480ms。减少动态模式下直接显示终态。

左侧 `image-six-subject` 采用“代码节点 + 精确 SVG 图标/连接线”的复合方案，不使用整张 PNG：

- 492×408 inner canvas、6 个 120×120 外围节点、180×180 中心节点、圆环和径向线完全执行 8.3 的自然坐标合同；卡片、文字、圆形底板用 HTML/CSS，学科图标和复杂线条使用从 Figma 精确导出的 SVG。
- 这样既能在 1440px 做像素对照，也能让文字跟随 Web Font、整图等比缩放并支持后续分节点动画。只有复杂且不可编辑的纹理才允许作为局部 PNG；把整张六学科图导出 PNG 会造成窄屏文字模糊和双重事实来源，因此不采用。

右侧“科研应用 / 科研数据 / 科学工具”标题为 HTML 文本并绑定对应 Text Style。每个标题下是独立的 `MarqueeViewport`：

- 轨道内放两组完全相同、顺序一致的内容集合，第二组 `aria-hidden="true"`，轨道平移到第一组末端后无缝回到起点。内容不足两倍视窗宽时按数据重复补齐，不能用跳帧重置制造闪烁。
- 三条轨道使用略有差异的 24–36s 周期，统一线性速度；鼠标 hover、键盘 focus 或页面不可见时暂停。只在右侧使用 `mask-image: linear-gradient(to right, #000 0%, #000 82%, transparent 100%)` 的渐隐，左边缘保持完全不透明；不额外叠一个左侧白色遮罩。
- 减少动态模式下停止 marquee，仅显示第一组并允许自然换行，不把页面根变成横向滚动容器。

### 10.7 产物原生

该区块静态展示。`OutputCard` 只保留 `featured` 与 `compact` 两种稳定变体；图片按原始比例显示，卡片文本自然增高。宽屏 3 主 + 4 次的组合通过 CSS Grid area 表达，中等和紧凑断点切换列数，不复制或改变 DOM 阅读顺序，也不加入 hover 位移等未要求交互。

### 10.8 科研证据链

当前 Figma 组件集 `168:1325` 明确包含 7 个状态，按页面顺序绑定如下：

| 顺序 | Tab | Figma 状态节点 | 对应图片规范 |
| --- | --- | --- | --- |
| 1 | 文献综述及引用网络 | `168:1204`（科研证据链01） | `image-chain01` `168:938` |
| 2 | 数据统计结果 | `168:1205`（科研证据链02） | `image-chain02` `168:896` |
| 3 | 论文插图 | `168:1317`（科研证据链03） | `image-chain03` `168:1296` |
| 4 | 分析代码 | `168:1207`（科研证据链04） | `image-chain04` `168:1015` |
| 5 | 仿真结果 | `168:1208`（科研证据链05） | `image-chain05` `168:1057` |
| 6 | 实验设计 | `168:1209`（科研证据链06） | `image-chain06` `168:1073` |
| 7 | 论文草稿 / 技术报告 | `168:1246`（科研证据链07） | `image-chain07` `168:1175` |

- 默认选中第 1 项。`HomeTabController` 管理 `activeIndex`，Tab 使用 `role="tablist" / tab / tabpanel`、`aria-selected`、`aria-controls` 和 roving tabindex；方向键、Home、End 可切换焦点，Enter/Space 激活。
- active Tab 按 Figma `168:931` 的展开结构显示“标题 → 描述 → 进度条”；进度条就在描述下方，即用户截图红框位置。`EvidenceTabProgress` 由一条全宽浅色 `ProgressTrack` 和左对齐的蓝色 `ProgressFill` 叠放组成，track / fill 的粗细和间距在实施时从当前实例 `I168:931;126:68785` / `I168:931;126:68787` 刷新；颜色分别绑定实际线条 Token 与 `--accent`。非 active Tab 收起描述和进度条，只保留标题。
- 每个 active Tab 精确停留 5000ms；蓝色 fill 从 0% 线性增长到 100%，`transform-origin: left`，通过 `scaleX(0→1)` 表示同一个 5 秒周期。Figma / 截图里约 92px 的蓝线只是某一时刻的进度示意，不是固定宽度；到第 5 秒必须铺满 track，随后立即切换下一项，第 7 项后回到第 1 项。
- 读秒和蓝线不得使用两个独立计时器。优先以同一个 Web Animations `Animation` 对象作为时钟：激活时取消上一实例、从 0 创建 5000ms linear fill 动画，`animation.finished` 触发下一 Tab；点击某 Tab 时取消旧 animation、切换内容并从 0 重建。无 Web Animations 时才用单一 `performance.now()` + rAF 同时计算 `elapsed` 和 `--tab-progress`，禁止 `setInterval` 与 CSS animation 各自读秒造成漂移。
- 自动播放仅在该区块达到有效可见阈值、文档可见且焦点不在 Tab/面板内时运行；hover / focus / 手动暂停时直接暂停同一个 Animation，恢复后从其 `currentTime` 继续，因此剩余读秒与蓝线位置始终一致。Tab 组旁提供复用 `.btn-text` 的暂停/继续控制。减少动态模式保留手动切换并默认暂停自动轮播，切换不做位移动画。
- 7 个面板按对应 Figma 状态实现为可访问 DOM / SVG；非激活面板使用 `hidden`，不只设 opacity。切换时使用 180–240ms 的淡入，面板容器预留当前断点所需最小高度，避免每 5 秒推动后续页面。
- Tab 的 CSS、timer 和业务数据属于 `tabs/home/`；不写入 Design System。与科研案例共用的只有 Home 私有状态核心，组件视觉互不继承。

### 10.9 安全可控

该区块无点击或自动切换。`SecurityDiagram` 从实施前刷新后的节点 `198:35475` 直接导出完整 PNG（2026-08-21 快照为 1400×500），内部文字、六边形、图标、连线和端点全部烘焙在同一图片中；运行时不得再用 HTML/CSS/SVG 拆分重绘。图片提供完整替代文本，桌面端按自然比例显示，中小屏只整体等比缩放并完整展示，不局部滚动、不裁切、不非等比拉伸。除页面统一的无 JS 可见规则外，不增加额外动态效果。

### 10.10 生态开放

该区块静态展示。`EcosystemDiagram` 从实施前刷新后的节点 `198:35502` 直接导出完整 PNG（2026-08-21 快照为 868×580），六类输入、汇聚连接线、中心节点、椭圆底座与品牌落点全部烘焙在同一图片中；运行时不得再用 HTML/CSS/SVG 拆分重绘。图片提供完整替代文本，中小屏只整体等比缩放并完整展示，不把六入口重排为另一套 3×2 图，也不添加未要求的 hover / 切换交互。

### 10.11 科研基座 Banner 与科研基座能力

两个 Figma 区块在代码中由一个 `ResearchFoundationStage` 包裹，但保持为相邻的正常文档流。能力区内容、文案、卡片顺序和内部间距保持不变，Banner 不得把能力区作为自身 sticky 的滚动作用域。

1. `ResearchFoundationBanner` 使用正常文档流定位，随上一个“生态开放”模块和页面滚动同步移动；不得使用 `position: sticky` 固定在视窗顶部。
2. 当 `CapabilityGrid` 开始进入视窗时，Banner 必须按同一滚动位移继续向上离场，不能等待能力卡片滚动到底后才解除固定，也不能持续覆盖能力区。
3. shell iframe 与 Home 独立模式采用相同的 Banner→能力区顺序；仅锚点的 `scroll-margin-top` 根据导航归属调整，不为该段落增加额外 sticky 滚动距离或占位层。
4. `image-worldmordel` 与 `image-interns2` 使用透明背景 PNG，并各自使用内层 `ParallaxLayer`，最大位移约 24–36px、方向错开；外层仍负责响应式锚点和裁切。图片本身不得添加背景、圆角、`box-shadow`、`filter: drop-shadow()` 等装饰，以保证透明区域直接露出模块网格背景。减少动态模式关闭视差，保持正常顺序。
5. Banner 的装饰网格是 `inset: 0` 的独立代码层，尺寸跟随整个 Banner，而不是只铺 1400px rail；背景步进保持约 60px，在任意断点和超宽屏都填满模块，图片或内容变化不能露出无网格空白。

该场景参考 Attio 首页中 [“SDK. API. MCP. Build anything on Attio.” 与后续客户引语的相邻过渡关系](https://attio.com/)。参考只确定“前一块离场、后一块进入”的观感；本项目按正常文档流实现，不复制第三方页面内部的 sticky 结构。

### 10.12 科研案例

`CaseShowcase` 默认显示 `amix`。左侧 10 项 `CaseTabs` 可点击，右侧只显示对应案例详情；不自动轮播，不在此阶段引入 URL hash 状态。

- 文案和图片只消费 8.5 的静态数据数组，Tab 的 `data-case-id` 与面板 ID 使用稳定英文 ID。切换同样执行 ARIA tabs 和键盘规范；详情使用 180–240ms 交叉淡入，减少动态模式即时切换。
- 10 张首批图片迁入 `tabs/home/assets/images/research-cases/`，首项可 eager，其余 `loading="lazy"` 并指定 16:9 `aspect-ratio`、width/height，避免解码时布局跳动。上线压缩衍生物与源 PNG 并存，引用由数据文件统一控制。
- `CaseTabs` 的视觉属于 Home 私有 `case-list` 变体，不加入 Design System。它可与证据链共用 `HomeTabController` 的激活、键盘和 ARIA 逻辑，但不继承 5 秒 timer 或进度条。
- 中等/紧凑断点按 9.3 重排 Tab 与详情，不将 10 个长标题强行塞入单行横向滚动。原 Downloads 文件只读保留；实现时执行“复制并校验哈希”，不移动源素材。

### 10.13 合作共建

机构 Logo 统一放在 `shared/assets/orgs/partners/`。实现时从静态数据文件按前缀分组：`line1-`、`line2-`、`line3-` 分别进入第一、第二、第三行；当前盘点为 12、12、14 个，前缀去除后作为默认机构名 / `alt`。`PartnerLogoTile` 是统一容器组件：外框尺寸、背景、圆角、描边和间距由组件控制，内部图片盒固定 `60 × 60px`、`object-fit: contain`；纯重复轨道副本设空 alt / `aria-hidden`。

Logo wall 使用三条可反向或错速的无缝 `MarqueeTrack`，两侧通过 mask 渐隐；周期按轨道实际宽度计算恒定像素速度。任一卡片 hover 或键盘 focus 时，对应轨道暂停；卡片内 Logo 图片隐藏并显示文件名前缀后的机构名称。名称态以 Figma `361:39144` 为基准，复用 `--bg-soft`、`--ink` 和 Body/Compact：13px / 400 / 1.65、水平垂直居中，离开卡片后恢复 Logo 与滚动。文档隐藏时暂停，减少动态模式改为静态可换行 Logo 列表。mask 属于 viewport，不覆盖可聚焦内容，也不能让 marquee 产生页面根横向溢出。

合作共建尾部 `CooperationCTA` 只保留点阵背景图片层，容器背景色必须透明，不做白色填充；“申请合作”按钮仅显示文字，不附加箭头图标。CTA 是合作共建内容的最后一个元素，其下边缘直接贴合模块底部分割线，`section-content` 不得以 `min-height`、底部 padding 或空占位继续撑出间距。

“申请合作”点击后由 Home 发送 `home:cooperation-dialog:open` 给 shell。Home 消息只携带白名单化的声明式字段 schema 和 `requestId`；shell 的 `ShellDialogHost` 复用现有 Design System Dialog 表面、按钮、输入框、Textarea 和已有 radio-chip 基线，负责遮罩、焦点陷阱、Esc / 关闭按钮、滚动锁定和触发按钮焦点恢复。当前 Design System 没有已登记的 Checkbox 公共组件，因此实现前要随“合作申请”新变体补充最小 Checkbox 规范、Token 绑定和 focus / checked / error 状态，并在 `components.html` 核对；不能假装现有“创建课题”Dialog 已经覆盖该表单，也不在 iframe 内再叠第二层蒙层。

| 字段 | 控件 | 必填 | 选项 / 规则 |
| --- | --- | --- | --- |
| 姓名 | text input | 是 | trim 后非空 |
| 手机号 | tel input | 是 | trim 后非空；未确认国际化范围前不硬编码仅中国大陆号段正则 |
| 学校/单位 | text input | 是 | trim 后非空 |
| 职位 | text input | 是 | trim 后非空 |
| 研究方向 | radio group | 是 | 生命科学、地球科学、物质科学、神经科学、空间科学、物理科学、数学、化学、其他 |
| 具体研究内容 | textarea | 否 | 保留换行；最大长度待接口合同确认 |
| 希望合作方式 | checkbox group | 是 | 联合课题研究、科研资源接入、其他；至少选 1 项 |
| 具体可合作内容 | textarea | 否 | 保留换行；最大长度待接口合同确认 |

shell 首次校验后通过 `home:cooperation-dialog:submit` 把 `{ requestId, formData }` 返回 Home，Home 再做同一份 schema 校验并调用后续确认的接口；结果使用 shell 级 Toast 反馈。接口地址、隐私同意文案、防重复提交和失败重试未确认前，原型只允许完成表单交互与 payload 输出，不伪造“提交成功”或把个人信息发送到未知地址。

### 10.14 下载客户端

Figma 组件 `242:63272` 的卡片基线为 160×160px、16px 圆角、`--bg-soft` 背景；默认无描边，hover 只增加 1px `--muted-2` 描边，不上浮、不添加阴影、不改变背景色。网页版默认文案是“网页版”，hover 文案变为“点击进入网页版”，图标保持 48×48px。

- 网页版卡片是完整可点击 `<a>`，新开 `https://discovery.intern-ai.org.cn/`，hover、`:focus-visible` 与键盘激活使用同一交互状态；布局不能因文案变化发生位移。
- Mac Intel、Mac ARM64、Linux 可复用组件中的默认/hover 视觉：默认分别显示 `Intel x64`、`Mac ARM64` 或 Linux 标题；hover 切换为真实 `download.svg` 图标与“适用于 macOS 13 及以上”/“适用于 Ubuntu 22.04 及以上”。真实安装包 URL 未确认前不创建空链接、不触发下载；确认 URL 后再转为 `<a download>` 或真实下载导航，并补统计需求。
- Windows 卡片保持 Figma 静态“敬请期待”样式：使用非交互 `<article>`，无 pointer cursor、无 hover 描边、无 tabindex、无点击处理。不能用 disabled `<a>` 模拟。
- Grid 按 9.3 重排，所有卡固定 160px 自然尺寸，在窄屏以容器居中或两列排布，不为塞满宽度非等比拉伸卡片。

### 10.15 Footer

Footer 中黑色文字链接全部作为页内锚点：平台核心能力→`home-advantages`、科研基座→`home-research-foundation`、科研成果→`home-research-cases`、合作共建→`home-cooperation`、下载客户端→`home-downloads`；Footer 不提供“平台工作流”入口。它们消费 Design System `.btn-link` 视觉和 `HomeAnchorController`，点击后执行与 Navigation 相同的平滑滚动、焦点落点和减少动态降级。

“网页版”是统一外链并新开标签页。Footer 的栏目标题“了解平台 / 科研基座 / 成果与合作 / 体验产品”不是链接，不添加伪点击；协议、备案、公众号等未在本轮指定的目标继续等待真实地址，不用 `href="#"` 占位。

## 11. 动画预留与规则兼容性

当前 Figma 节点没有确认 Motion Variable，仓库也没有公共动画 Token。后续增加出场/退场动画与现有架构不冲突，但必须遵守以下边界：

1. Home 内容动画放在 `home.css` / `home.js`，不写进 `shell.js` 或过渡层 `shared/css/styles.css`。
2. 首轮使用 Home 私有时长、缓动和 stagger；只有第二个真实模块复用后才提议公共化。
3. 动画挂在 rail 内部内容包装层，不移动 rail、区块边框和底纹层，避免连续描边断裂或出现缝隙。
4. 优先动画 `opacity`、`transform`，必要时使用局部 `clip-path`；不动画 `width`、`height`、border 和大范围 background-position，避免布局抖动和重绘。
5. 页面无 JS 时内容默认可见。JS 只在初始化成功后增加 motion 状态，不能让失败脚本留下永久不可见内容。
6. 必须支持 `prefers-reduced-motion: reduce`，关闭非必要位移、视差、marquee 和自动轮播；锚点改为即时定位，证据链停在当前 Tab 并保留手动切换。
7. 复合图示保留分节点 DOM，后续可为流程节点、连接线和 Logo tile 分别设置动画；这也是不把整张图示导出为 PNG 的原因。
8. IntersectionObserver 以 Home 文档的滚动容器为准。若最终滚动由 shell 接管，再登记协议或调整 observer root，不能用轮询或延时猜测可见性。
9. 全链贯通和学科纵深的入场每次页面加载只执行一次；Hero Introduction 直接绑定滚动进度，可随反向滚动恢复。科研基座 Banner 按正常文档流离场，仅两张装饰图保留轻微视差。静态模块不因统一 runtime 被擅自增加入场动画。
10. 复合图示的响应式 `scale(s)` 与节点出场动画必须分层：外层 canvas 只负责固定比例缩放，内层 node wrapper 才负责 translate/opacity。动画不得覆盖 canvas 的 transform，也不得在退场后留下不同的连线端点或圆心坐标。

本轮已确认的挂载点仅包括 Hero Introduction / 画框 / 装饰卡、全链阶段、学科纵深、证据链 Tab 与面板、科研基座两张视差装饰图、科研案例面板、机构 Logo wall 和下载卡交互态。平台核心优势、产物原生、安全可控和生态开放保持静态；Navigation 与 Footer 只保留 sticky、focus、hover 和平滑锚点行为，不加入内容时间线。

## 12. 后续实施顺序

1. 实施启动时先对目标根节点和各模块重新执行 `get_design_context` + 截图，生成本轮 Figma manifest；刷新顶层顺序、尺寸、文字、Variable、`image-` 清单和复合图示坐标。标题文字若有变化，先重生成 Source Han Serif SC 600/700 页面字符子集。
2. 接入本轮字体子集，补齐本页缺失 Token 和 Text / Effect Style 映射，并同步 Design System 核对页；随后创建 shell 入口与 Navigation，在架构地图登记 `home:ready`、锚点滚动和合作 Dialog 的跨 iframe 协议，并建立统一外链配置。
3. 创建 `tabs/home/index.html`、`home.css`、`home.js`，先搭 rail、full-bleed 分割线、代码底纹、锚点和无 JS 可见基线。
4. 下载 23 个 Figma 运行时图片图层的真实资产（包含 `image-safecontrol` 与 `image-open-ecosystem` 整图 PNG）；代码化 9 个复合图示（含证据链 7 个状态）并下载其真实图标 / 精确 SVG；把科研案例 02–10 补充源图从 Downloads **复制**到 Home 资源目录并校验。
5. 先实现全部静态终态和 390 / 768 / 1024 / 1440px 适配，再接 `HomeAnchorController`、`HomeTabController`、marquee 和统一 motion runtime。
6. 依次实现 Hero、全链、学科、证据链、科研基座、案例与 Logo wall 的滚动/切换效果；每完成一类先验证减少动态和脚本失败降级。
7. 把合作申请登记为 Design System Dialog 新变体并在 `components.html` 核对，再接入 shell host；提交接口确认前只验证 schema、校验和消息 payload。
8. 最后接下载真实地址、Footer 真实链接、统计和合作提交接口，执行完整浏览器视觉/交互验收。

## 13. 实施验收清单

- 1440px 下 rail 为 1400px，左右 20px，连续侧线没有中断或双线。
- 所有区块横向分割线在 390 / 768 / 1024 / 1440px 及更宽视窗都触达左右边缘；大屏 rail 两侧不存在空白段，页面也不因 `100vw` 产生横向溢出。
- 相邻区块分割线保持 1px，不因父子边框叠加变成 2px。
- 点阵为 2px / 14px 的代码背景，line grid 为约 60px 的代码背景；DOM 中不存在数千个点节点。
- Home 不复制 Design System 已有颜色、字体、圆角字面值。
- 本文列出的缺失 Token 在 Home 使用前已进入 `tokens.css`，并在 Design System 页面可核对。
- Figma 标题实际命中 `InkStone Han Serif SC Home` 页面子集；Noto Serif SC 只作为失败/缺字 fallback，字体许可与 manifest 随资产提交，冷缓存时无永久不可见文字。
- 实施时 manifest 中全部 `image-` 图层都有明确去向；2026-08-21 修正快照为 32 个，其中必须包含组件集 `168:1325` 的 `image-chain01`—`image-chain07`，最终数量仍以同次 Figma 盘点为准，临时 Figma URL 不进入代码。
- Navigation / Footer / favicon 使用仓库内既有 Logo 文件；点击 Navigation Logo 会刷新当前页面，Footer Logo 保持非刷新入口。
- 合作机构 Logo 单独进入 `shared/assets/orgs/partners/`，不污染 `shared/assets/common/`；`line1-`、`line2-`、`line3-` 分别进入三行，当前 12 / 12 / 14 个文件全部被分配且三行无重复，每个可见图盒为 60×60px。
- 9 个代码化复合图示的文本仍可选择、缩放和被辅助技术读取；节点包围盒、连线端点、圆心、描边与 Figma 自然尺寸基线逐项对齐。安全可控与生态开放整图 PNG 均提供完整替代文本。
- 9 个代码化复合图示和两张整图 PNG 在中等/紧凑宽度使用统一比例整体缩放，不存在局部横向滚动、非等比拉伸或开发自行重排拓扑；证据链 7 个状态逐项完成截图对照。
- 页面根无非预期横向滚动；流程图、证据链 Tab 和科研案例 Tab 均不依赖局部横向滚动。学科资源轨道与 Logo wall 的 marquee 必须在自身 viewport 裁切。
- Navigation 吸顶且中心按钮组不受左右 Logo / CTA 宽度影响；Nav 与 Footer 的每个锚点都到达同一目标并正确处理焦点。
- Navigation、Hero、Footer 的“在线使用 / 网页版”都从统一配置新开正确地址，并带 `noopener noreferrer`。
- Hero Introduction 最终为 `translateY + blur + scale(.7) + opacity(0)`，向上滚动可恢复；屏幕和 3 张图的视差不覆盖响应式定位 transform。
- 全链 6 个阶段严格按指定顺序完成一次性渐进展示；终态节点和连接线与实施时 manifest 记录的 Figma 自然画布对齐，不以本文旧快照替代。
- 学科区从左到右入场；六学科代码图在自然尺寸像素对照通过，3 条资源轨道只有右侧渐隐、左侧没有遮罩。
- 证据链 7 个 Tab 与 Figma 状态一一对应；active 描述下方存在浅色 track 和蓝色 fill，fill 与同一个 5 秒时钟从 0% 同步到 100%。点击重置、离屏 / 隐藏 / focus 暂停后，读秒与蓝线位置无漂移且不存在重复 timer。
- 科研基座 Banner 在所有断点均随页面正常滚动；能力区开始进入视窗时 Banner 同步离场，不会吸顶等待能力区滚动到底。
- 科研案例 10 个 Tab 与 10 份数据、10 张图片稳定配对，切换无布局跳动；运行时不引用 Downloads 绝对路径。
- Logo wall 无缝循环且两侧渐隐；hover / focus 卡片时轨道暂停、Logo 切换为对应机构名称，离开后恢复；重复集合不被读屏重复朗读，减少动态模式停止循环。
- 合作申请由 shell 级 Design System Dialog 覆盖 Navigation 和 Home，必填 / 单选 / 多选校验正确，关闭后焦点返回触发按钮；接口未确认时不发送个人信息。
- 下载网页版卡片具备 default / hover / focus 状态并打开正确地址；Windows 卡无 hover、无指针、无 tabindex 和点击处理。
- 200% 文本缩放时核心内容与操作仍可访问。
- 动画关闭或脚本失败时内容仍可见；减少动态偏好生效。
- 通过 shell iframe 与直接打开 Home 时，资源、布局和适配结果一致。
- 实现完成后执行 `git diff --check`、HTML/CSS/JS 静态检查、资源路径检查和浏览器视觉/交互验收；静态检查不代替与 Figma 的视觉对照。

## 14. 待后续产品确认

- 合作申请的提交接口、鉴权 / 防刷策略、隐私同意文案、字段最大长度、成功与失败业务文案。
- Mac Intel、Mac ARM64、Linux 的真实下载 URL、版本号、平台检测和下载统计；Windows 何时从“敬请期待”转为可交互另行确认。
- Footer 公众号、平台服务协议、个人信息保护政策的最终地址，以及二维码目标与替代文本。
- 是否需要把科研案例 active 状态同步到 URL、是否采集导航 / Tab / CTA / 下载埋点；当前实现合同不默认加入。
- 10 张科研案例源 PNG 的上线压缩格式与质量阈值，在 1440 / 1024 / 390px 截图对照后确定。
