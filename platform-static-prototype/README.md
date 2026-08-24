# InternInkStone 静态原型

`platform-static-prototype/` 是纯静态 HTML、CSS 和 JavaScript 原型，由平台 shell、独立模块和一套用于核对公共规范的 Design System 页面组成。当前已实现 Home 官网、shell 顶部导航与 shell 级合作申请弹窗，并完成第一批公共 Token、原子规范页及 Buttons、Dialog、Toast 候选组件库。

## 规则来源

1. 仓库级协作、安全和交付规则以根目录 `AGENTS.md` 为准。
2. 本文件负责静态原型的目录、模块和资源规则。
3. 架构与归属细则位于 `docs/`。同一事项存在多层规定时，优先采用更具体、离目标模块更近的规定。
4. Figma Variables 与 Styles 的代码化规则见 `docs/FIGMA_VARIABLES_STYLES_IMPLEMENTATION.md`。

## 当前目录

```text
platform-static-prototype/
├── design-system/
│   ├── index.html                     # 公共规范核对页
│   ├── components.html                # 组件规范与交互核对页
│   ├── design-system.css              # 仅供规范页使用的样式
│   ├── COMPONENT_MIGRATION.md          # 组件来源与 Token 重绑登记
│   └── README.md
├── docs/
│   ├── ITERATION_ARCHITECTURE_MAP.md
│   ├── CSS_OWNERSHIP_MAP.md
│   ├── FIGMA_VARIABLES_STYLES_IMPLEMENTATION.md
│   ├── MODULE_OWNERSHIP_MAP.md
│   └── SAFE_PARALLEL_WORKFLOW.md
├── shared/
│   ├── css/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── shell.css                  # shell、顶部导航、iframe 和 shell 弹窗布局
│   │   ├── styles.css                 # 只有迁移层占位
│   │   └── design-system-overrides.css
│   ├── js/
│   │   ├── components.js             # Design System 候选公共组件交互
│   │   ├── shell.js                  # shell 路由、导航与跨 iframe 消息
│   │   └── site-links.js             # 官网稳定外链配置
│   └── assets/
│       ├── common/
│       ├── logos/                     # 官网 logo、favicon
│       └── orgs/partners/             # 合作机构 logo，按 line1 / line2 分行
└── tabs/
    └── home/
        ├── index.html                 # Home 独立入口
        ├── home.css
        ├── home.js
        ├── data/                      # 科研案例和合作机构静态数据
        └── assets/                    # Home 私有图片、SVG 与 Figma manifest
```

`shared/js/standalone-redirect.js` 与 `shared/js/module-runtime.js` 当前仍未创建；Home 自己处理独立打开兼容和私有交互，不依赖这两个规划文件。

Home 当前资源清单由 `tabs/home/build-asset-manifest.ps1` 从正式资源目录重建：共 221 个运行时资产，其中 211 个为 Figma 导出、10 个为用户提供的科研案例 PNG。`figma-assets.manifest.json` 另登记 `image-chain01`—`image-chain07` 的组件集、变体、外层/内部节点和自然画布；38 个合作机构 Logo 不计入 Home 私有 manifest，由 `data/partner-logos.data.js` 按 `line1-` 16 个、`line2-` 22 个引用。

## 查看方式

在 `platform-static-prototype/` 下启动任意静态文件服务器。例如：

```powershell
python -m http.server 8023
```

平台入口为 `index.html`，Home 独立入口为 `tabs/home/index.html`；原子规范页为 `design-system/index.html`，组件规范页为 `design-system/components.html`。

## 模块边界

- `index.html` 负责外层 shell、顶部导航、iframe 容器、路由和 shell 级遮罩。
- `tabs/<module-id>/index.html` 是独立模块页面，既要能被 shell 加载，也要能单独打开。
- 模块 DOM、私有交互、私有样式和私有资源归模块自己所有。
- 模块不得直接操作 shell DOM。跨 iframe 行为使用明确的 `postMessage` 协议，并先登记到架构地图。
- `design-system/` 是公共规范的核对与示例区域，不自动成为主导航模块。

## 资源与代码归属

- 只被一个模块使用的内容放在 `tabs/<module-id>/` 或其 `assets/` 下。
- 从产品模块提炼的能力须被两个及以上模块真实复用且形态稳定后再提升到 `shared/`；由用户明确批准从参考 Design System 迁入的候选公共基线需单独登记来源和未完成的产品验证。
- 平台 logo 放在 `shared/assets/logos/`，机构 logo 放在 `shared/assets/orgs/`，稳定的跨模块图片放在 `shared/assets/common/`。
- 公共 CSS 固定按 `tokens.css`、`base.css`、`shell.css`、`styles.css`、`design-system-overrides.css` 的顺序加载。
- `styles.css` 当前只是迁移期占位，不能无边界增长；如果后续确有需要创建 `module-runtime.js`，它也只承载已经登记的轻量共享交互。

## 新增模块

1. 在 `tabs/<module-id>/` 创建 `index.html`。
2. 模块样式、脚本分别放在该目录内的 `<module-id>.css`、`<module-id>.js`。
3. 模块私有资源放在 `assets/`。
4. 在 `docs/MODULE_OWNERSHIP_MAP.md` 登记模块边界。
5. 需要 shell 路由时，再修改 shell 路由表；不要仅凭目录存在自动加入主导航。
6. 新增跨 iframe 消息前，在 `docs/ITERATION_ARCHITECTURE_MAP.md` 登记消息名、发送方、接收方和返回方式。

## 最低验证

- 开始和交付前执行 `git status --short`，区分本任务文件与已有改动。
- 执行 `git diff --check`。它只覆盖 Git 已跟踪差异；状态为 `??` 的未跟踪文件还要单独做语法、路径和空白检查，不能仅凭该命令宣称已经验证。
- 检查新增 HTML、CSS 和 JS 的静态语法。
- 确认入口、模块页和 Design System 页引用的资源路径可以解析。
- 修改 shell 后检查顶部导航、路由、iframe 和 active 状态。
- 修改公共 CSS 后同时检查受影响产品页和 `design-system/index.html`。
- 静态语法和资源路径检查不等于浏览器视觉或交互验收；未执行浏览器验证时应明确说明。
