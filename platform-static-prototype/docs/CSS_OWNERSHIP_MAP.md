# CSS 归属地图

本文决定样式应该放在哪个文件。当前原型处于初始阶段，没有真实复用证据的样式默认归模块私有。

## 公共 CSS 加载顺序

所有需要公共样式的页面按以下顺序加载：

1. `shared/css/tokens.css`
2. `shared/css/base.css`
3. `shared/css/shell.css`
4. `shared/css/styles.css`
5. `shared/css/design-system-overrides.css`

模块或 Design System 的私有样式在以上公共层之后加载，并且不能反向成为其他模块的隐式依赖。

## 文件责任

| 文件 | 允许内容 | 不允许内容 | 当前状态 |
| --- | --- | --- | --- |
| `tokens.css` | 有证据的 Figma Variable、项目字体基线、登记过的适配 Token、来源明确的项目语义 Token | 单页面选择器、未确认的 Figma 资产 | 第一批颜色、圆角、字体与适配 Token 已创建；组件迁移所需 5 个状态色与 `--radius-pill` 已按非 Figma Token 登记；Mode 与 Alias 未实现 |
| `base.css` | 元素级基础样式与明确的可访问性基础规则 | 模块布局 | 字体、媒体、表单继承与焦点基础代码已创建；Home 与 Design System 消费 |
| `shell.css` | 顶部导航、shell 布局、iframe 容器、shell 遮罩 | 模块内容样式 | Home shell 已实现 |
| `styles.css` | 尚未完成归属迁移的过渡公共样式 | 无期限累积的新模块样式 | 只有责任注释，尚无迁移规则 |
| `design-system-overrides.css` | 已确认的 Figma Text Style 映射、已稳定的公共组件覆盖、已批准的候选公共组件基线 | 单模块特例、Design System 展示页私有布局 | `Title/h1`、Buttons、Dialog、Checkbox 和 Toast 已创建；Home 与 Design System 消费 |
| `tabs/<module>/<module>.css` | 模块私有布局、状态与组件变体 | 其他模块选择器 | 按模块创建 |
| `design-system/design-system.css` | 规范核对页自身布局 | 产品模块样式 | 原子与组件规范页展示布局已创建；组件浏览器视觉与交互验收待本任务登记 |

## 选择规则

1. 选择器只服务一个模块时，放入该模块 CSS。
2. Shell 布局和顶部导航只放 `shell.css`。
3. 有 Figma 证据的 Variable 与 Text Style 映射，以及技术文档明确登记的字体、适配 Token 和元素级安全基础规则，按各自固定责任进入公共层；这不代表公共产品组件已经稳定。
4. 从模块中提炼的组件、布局模式或交互样式，只有两个以上产品模块真实复用且规则稳定后，才考虑提升到公共层。
5. 用户明确批准从参考 Design System 迁入的项目级组件基线不属于“从单模块提炼”；可以作为候选公共规则进入公共层，但必须记录来源、当前消费者和未完成的产品验证，不能据此声称已完成跨模块复用。
6. 提升模块能力或迁入候选组件前记录消费者、迁移来源和验证页面。
7. 不通过高特异性、`!important` 或无边界全局选择器掩盖归属问题。
8. 从公共层迁出样式时，先验证视觉不变，再删除旧规则。

## 候选公共组件登记

| 组件 | 迁移来源 | 当前消费者 | 公共文件 | 待验证 |
| --- | --- | --- | --- | --- |
| Buttons | 基础层级来自参考项目；`.btn-text` 来自 Figma `242:63219` / `242:63221`；`.btn-link` 按用户明确交互规则补充 | Home、shell、Design System | `design-system-overrides.css` | 后续模块复用时继续验证状态一致性 |
| Dialog / 表单控件 | 参考项目 Design System，并按合作申请字段扩展 Checkbox | Home shell、Design System | `design-system-overrides.css`、`shared/js/components.js`、`shared/js/shell.js` | 真实提交 API 与移动端实机键盘 |
| Toast | 参考项目 Design System `atoms.html` | Home shell、Design System | `design-system-overrides.css`、`shared/js/components.js` | 后续产品消息文案 |

## 当前模块登记

| 模块 | 私有 CSS | 公共依赖 | 备注 |
| --- | --- | --- | --- |
| Home | `tabs/home/home.css` | `tokens.css`、`base.css`、`design-system-overrides.css`；shell 场景由 `shell.css` 承载外框 | 1400px rail、复合图示、动画、Tab、marquee 和响应式均保持 Home 私有 |

## 公共样式修改检查

- 列出受影响的选择器和已知消费者。
- 检查 `design-system/index.html`。
- 检查所有已登记的产品页面。
- 运行 `git status --short` 和 `git diff --check`；对状态为 `??` 的文件另做空白、语法和路径检查，因为 `git diff --check` 不覆盖未跟踪文件。
- 不把浏览器资源检查或静态检查描述成视觉回归验证。
