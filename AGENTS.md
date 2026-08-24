# AI Agent 工作约束

本文件适用于在本仓库内工作的 Claude Code 与 Codex。所有自动化代码修改、页面迁移、静态资源整理和原型修复都应遵守以下规则。

`platform-static-prototype/README.md` 是静态原型的项目细则来源；本文件提供跨工具协作和验证要求。如果两者都覆盖同一事项，优先遵守更具体、更贴近当前模块的规则。

`platform-static-prototype/docs/ITERATION_ARCHITECTURE_MAP.md` 是持续迭代协作总地图。修改 shell / iframe 通信、公共 CSS、模块边界或多人并行任务前，先对照该文档确认责任归属和影响范围；需要更细的 CSS、模块或并行协作规则时，再查 `platform-static-prototype/docs/CSS_OWNERSHIP_MAP.md`、`platform-static-prototype/docs/MODULE_OWNERSHIP_MAP.md` 和 `platform-static-prototype/docs/SAFE_PARALLEL_WORKFLOW.md`。

## 静态原型结构

`platform-static-prototype/` 保持纯静态 HTML / CSS / JS，不依赖 Vite、React、Tailwind、shadcn、normalize.css、reset.css 或任何会改变默认样式的框架。

静态原型遵循一个入口 shell 加多个独立模块的结构：

```text
platform-static-prototype/
├── index.html
├── design-system/
│   └── index.html
├── docs/
├── shared/
│   ├── css/
│   ├── js/
│   └── assets/
└── tabs/
    └── <module-id>/
        ├── index.html
        └── assets/
```

### 模块页面

- `platform-static-prototype/index.html` 是平台总入口，负责外层 shell、顶部导航和 iframe 容器。
- 每个主导航模块都必须有独立目录：`tabs/<module-id>/index.html`。
- 模块页面应能独立打开，不依赖其他模块的 DOM、状态或私有资源。
- 入口 shell 中的主路由必须指向真实模块页面，不要指向旧的一体化 HTML、临时 wrapper 或未拆分的 legacy 页面。
- 子页面可以放在 `tabs/<subpage-id>/index.html`，但不要擅自把子页面加入主导航，除非用户明确要求。

### 静态资源归属

- 单个模块独占的图片、图标、媒体、样例数据、页面脚本和页面样式，放在该模块目录或 `tabs/<module-id>/assets/` 下。
- `shared/` 只能存放 shell 使用的资源，或被两个及以上模块共同引用的资源。
- `shared/assets/` 不是兜底资源池。不能因为不确定归属就把资源放进去。
- 平台 logo 放在 `shared/assets/logos/`，机构 logo 放在 `shared/assets/orgs/`，多个模块共用图片放在 `shared/assets/common/`。
- 如果资源归属不明确，优先放到最可能拥有它的模块目录，并在交付说明中标注假设；必要时询问用户。
- 不要让模块引用仓库外的绝对文件路径，例如 `/Users/...`。

### CSS 与 JS

- 公共 CSS 按固定顺序加载：`shared/css/tokens.css` -> `shared/css/base.css` -> `shared/css/shell.css` -> `shared/css/styles.css` -> `shared/css/design-system-overrides.css`。
- `shared/js/shell.js` 只维护平台 shell、顶部导航和模块路由。
- `shared/js/standalone-redirect.js` 只处理模块单独打开时的跳转和兼容逻辑。
- `shared/js/module-runtime.js` 只承载仍需共享的轻量交互；模块变大后优先迁移到模块自己的 JS。
- 模块专属交互和样式优先放在模块目录，例如 `tabs/home/home.js`、`tabs/home/home.css`。
- 如果要从公共 CSS 中抽出模块样式，先确认页面视觉没有变化，再删除公共 CSS 中对应部分。
- 不随意重命名已有 class，不做无关视觉优化，不引入新的 UI 框架。

## 迁移与拆分

- 迁移旧页面时，应先盘点源页面、资源、脚本和目标模块映射。
- 大 HTML 拆模块遵循“先复原，再隔离”：先恢复目标页面视觉和交互，再收敛模块作用域、隔离脚本和样式，最后再清理临时文件和旧资源。
- 迁移结果必须让目标目录成为新的事实来源，不能只是包一层旧项目。
- 从大 HTML 中拆模块时，只保留目标模块所需的 DOM、样式、脚本和资源，移除无关隐藏视图和旧切换逻辑。
- 更新所有相对路径，确保直接打开模块页和通过 shell iframe 打开都能加载资源。
- 不要删除旧文件或共享资源，除非已经验证目标页面、资源引用和路由都正常，并且用户明确允许清理。

## iframe 弹窗规则

- 从 iframe 模块触发、但需要覆盖顶部导航和内容区域的弹窗，优先由外层 `index.html` / `shared/js/shell.js` 渲染。
- iframe 内模块只负责发送打开请求和接收提交结果，例如课题模块使用 `topics:modal:open` 与 `topics:modal:submit`。
- 不要用 iframe 内弹窗再额外同步一个顶部导航蒙层来拼接遮罩；这种方式容易产生导航先亮再暗、分割线消失、上下颜色不一致或中间缝隙。
- 模块单独打开时可以保留 iframe 内的本地弹窗作为 fallback，但在平台 shell 中应走 shell 级弹窗。
- 如果必须使用 iframe 内本地弹窗，同源场景下应先同步激活 shell mask，再打开 iframe 内弹窗；不要依赖延迟观察或异步消息制造视觉遮罩。

## 验证要求

完成修改后至少按影响范围验证：

- `git diff --check`
- 相关 HTML、CSS、JS 语法或静态检查
- 入口 `platform-static-prototype/index.html` 能加载
- 相关 `tabs/<module-id>/index.html` 能直接打开
- 新增或移动的静态资源路径能解析
- shell 路由、hash deep link 和 active 状态符合预期
- 如果修改公共规范，同步检查产品页面和 `platform-static-prototype/design-system/` 页面是否一致

如果新增了测试或已有相关测试，必须运行并在最终说明中列出命令。无法运行的验证要说明原因。

## 正式开发后的 HTML 事实来源与预览交付

- 本节从对应产品页面进入正式开发、创建正式 HTML 入口后生效；纯调研、产品技术文档和尚未创建页面入口的阶段不强制生成占位 HTML。
- 每次页面修改最终都必须落到该页面的正式 HTML 入口及其真实依赖链中。正式 HTML 是浏览器验收入口，不得只修改临时 demo、截图、开发服务器内存状态或未被正式 HTML 引用的孤立 CSS / JS。
- “落到 HTML”不等于把全部 CSS 和 JS 内联。样式、脚本和资源继续遵守既有归属规则独立存放，但正式 HTML 必须引用本轮最新文件；修改已引用的 CSS / JS 后，同步递增 HTML 中对应资源的版本查询参数，避免用户再次直接打开同一 HTML 时命中旧缓存。
- 交付前必须直接验证正式 HTML：页面结构完整、最新 CSS / JS / 图片均能加载，且本轮内容和交互已进入该入口。若功能依赖 shell，同时验证 shell 入口和模块独立入口，但以能够完整呈现用户验收场景的那个正式 HTML 作为主要交付入口。
- 正式开发后的每次对话交付说明都必须包含一个可点击的本地正式 HTML 文件链接。Home 全站效果完成后默认交付 `platform-static-prototype/index.html`；在 shell 尚未创建或本轮只验收模块独立形态时，交付对应的 `tabs/<module-id>/index.html`。链接必须指向仓库内真实文件，不能指向临时副本或生成目录。
- 可以在内部使用静态服务器完成自动化浏览器验证，但交付给用户时不返回 `localhost`、`127.0.0.1`、局域网 IP、随机端口或其他临时预览地址；用户只需点击正式 HTML 文件链接查看结果。

## 协作交付

- 每次交付说明只总结本次实际修改，不把用户或其他工具的既有改动算入自己的成果。
- 涉及新模块、较大页面或多人协作时，优先建议新建独立分支。
- 合并前重点看 diff：是否改到了公共样式、公共脚本、共享资源路径。
- 需要推送时，先说明将推送的文件范围；不要把无关脏改动一起推上去。
