# 组件迁移登记

## 来源与范围

本批组件按用户指定从以下参考实现直接迁移，不以截图重新设计：

- `C:/Users/wangyiting1/Documents/interndiscovery/platform-static-prototype/design-system/atoms.html`
- `C:/Users/wangyiting1/Documents/interndiscovery/platform-static-prototype/shared/css/design-system-overrides.css`
- `C:/Users/wangyiting1/Documents/interndiscovery/platform-static-prototype/shared/js/components/research-field-picker.js`（仅使用截图所需的 5 个领域图标）

迁入范围：

- Buttons：32px / 36px、一级 / 二级 / 三级、危险态、禁用态及原使用规则。
- Toast：success、warning、error，顶部单实例，显示 1.8 秒后收起。
- Modal / Dialog：只迁移“创建课题”表单；包含名称输入与计数、领域 radio chips、描述文本域与计数、取消和创建动作。

未迁入参考页面中的添加到课题、文件选择、删除确认、上传错误等其他 Dialog，也未迁入与本项目无关的兼容选择器。

## Token 重绑

| 参考实现依赖 | 当前项目绑定 | 说明 |
| --- | --- | --- |
| `--paper` | `--paper` | 纸白表面与反白文字 |
| `--ink` | `--ink` | 一级按钮、Toast 与正文主色 |
| `--ink-soft` | `--ink-soft` | hover 与次级文字 |
| `--bg-soft` | `--bg-soft` | hover、active 与选中底色 |
| `--line` / `--line-soft` | `--line` | 边框与 icon button pressed 背景 |
| `--muted` / `--muted-2` | `--muted` / `--muted-2` | 辅助文字、占位符与弱边框 |
| `--sans` | `--font-sans` | 所有组件正文与表单字体 |
| 参考实现的计数器字体依赖 | `--font-sans` + tabular numerals | 本项目不引入独立等宽字体；计数器仍保持数字对齐 |
| `--accent` / 蓝色 focus ring | `--ink-soft` / 墨色透明 focus ring | 交互规则保留，颜色重绑到当前项目墨色系统 |
| 危险与反馈色字面值 | `--state-danger*`、`--state-success`、`--state-warning`、`--state-error` | 作为迁移来源明确的项目代码 Token 登记；不计入 Figma Variable |
| 4px / 8px / pill 圆角 | `--radius` / `--radius-card` / `--radius-pill` | pill 为组件代码 Token，非 Figma Variable |

## 公共接口与状态

- 公共样式：`../shared/css/design-system-overrides.css`
- 公共交互：`../shared/js/components.js`
- 核对页面：`components.html`
- 浏览器全局接口：`window.InternInkStoneUI.openDialog()`、`closeDialog()`、`showToast()`
- 创建成功事件：`interninkstone:topic-created`

当前真实消费者只有 Design System 核对页，尚未完成产品模块接入；产品页开始使用后，应在 CSS 和模块归属地图登记消费者并复核视觉与交互。

## Figma 新增按钮

以下两个按钮是后续按当前项目 Figma 设计补充的公共候选组件，不属于上文的参考项目迁移范围：

| 组件接口 | 设计证据 | 当前实现 |
| --- | --- | --- |
| `.btn-text` | `242:63219` 默认、`242:63221` hover | 84px 参考内容宽度、36px 高、Padding X 12px、Radius 8px、15px / 24px；背景 `--bg` -> `--bg-soft`，文字 `--ink-soft` |
| `.btn-link` | 用户给出的 `242:63225`、`242:63226` 当前已不在 Figma 文件节点清单中 | 采用用户明确的默认无下划线、hover 下划线从左向右出现规则；字体和颜色暂复用同组 `.btn-text` 基线 |

两类按钮在可交互状态都使用 `cursor: pointer`；文字链接按钮同时在 `:focus-visible` 展示完整下划线，并在 `prefers-reduced-motion: reduce` 下取消可见的过渡时长。
