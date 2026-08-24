# 静态原型持续迭代架构地图

本文记录平台 shell、模块、公共能力和跨 iframe 协议的责任边界。修改 shell、公共 CSS、模块边界或通信协议前，应先更新或核对本文。

## 迭代原则

1. 先复原，再隔离：先保证目标页面视觉和交互成立，再收敛模块作用域。
2. 先私有，后公共：单模块能力留在模块目录；两个及以上模块真实复用且形态稳定后再提升到 `shared/`。
3. Shell 只处理平台级能力，模块只处理自身 DOM 和交互。
4. 公共文件小步修改，每次明确受影响的模块与验证范围。
5. 当前不存在的页面或协议必须标为“规划中”，不能按已实现能力依赖。

## 当前责任地图

| 区域 | 路径 | 责任 | 当前状态 |
| --- | --- | --- | --- |
| 平台 shell | `index.html`、`shared/js/shell.js`、`shared/css/shell.css` | 顶部导航、路由、iframe、shell 级遮罩 | 已实现 Home 路由、锚点导航、active 状态与合作申请弹窗 |
| Home 模块 | `tabs/home/` | Home 页 DOM、私有样式、私有交互和资源 | 已实现，支持 shell iframe 与独立打开 |
| Design System | `design-system/` | 原子规范、组件规范、交互示例与人工核对 | 原子页及 Buttons（含文字按钮、文字链接按钮）、指定 Create Topic Dialog、Toast 组件页已创建；产品模块验证尚未开始 |
| 公共样式 | `shared/css/` | Token、基础样式、shell 样式和稳定或已批准的候选组件覆盖 | Home 与 Design System 已消费；Source Han Serif SC 页面子集、官网语义 Token、Buttons 和 Dialog 已接入 |
| 公共组件交互 | `shared/js/components.js` | Dialog、表单计数 / 单选、Toast 的轻量公共行为 | 已创建；当前消费者仅 Design System，不包含产品业务提交逻辑 |
| 公共资源 | `shared/assets/` | shell 或多个模块共用的资源 | 官网 logo、favicon 和 `orgs/partners/` 合作机构 logo 已接入 |

## 影响级别

- 高影响：平台入口、shell 路由、shell 遮罩、公共 Token、公共组件规则、跨 iframe 协议。
- 中影响：被多个页面引用的共享资源或轻量运行时。
- 低影响：单个模块目录内且没有外部消费者的文件。

高影响修改必须在交付说明中列出消费者和验证结果。

## Shell 与模块边界

Shell 拥有：

- 顶部导航及 active 状态。
- 已登记的页面路由与 iframe 加载；当前只有 Home 默认路由，尚未实现 hash/query deep link。
- 需要覆盖顶部导航和内容区域的弹窗、遮罩与全局反馈。
- 跨 iframe 消息的统一接收、来源校验和分发。

模块拥有：

- 自己的 DOM、页面状态、交互和私有资源。
- 单独打开时所需的兼容逻辑。
- 向 shell 发请求并接收结果，但不直接修改 shell DOM。

## 跨 iframe 通信登记

Home 与 shell 当前使用以下协议：

| 消息名 | 方向 | 载荷 | 返回消息 | 负责人 | 状态 |
| --- | --- | --- | --- | --- | --- |
| `home:ready` | Home → shell | 无 | 无 | Home | 已实现 |
| `home:anchor:scroll` | shell → Home | `requestId`、`anchorId`、`behavior` | `home:anchor:scrolled` | shell | 已实现；shell 立即投递并保留最新请求，在 Home ready / iframe load 时补投 |
| `home:anchor:scrolled` | Home → shell | 原请求的 `requestId`、`anchorId` | 无 | Home | 已实现；shell 按白名单及最新请求配对，匹配后清除待发请求 |
| `home:section:active` | Home → shell | `anchorId` | 无 | Home | 已实现 |
| `home:cooperation-dialog:open` | Home → shell | `requestId` | `home:cooperation-dialog:opened` | Home / shell | 已实现；未确认时 Home 在 300ms 后重试一次 |
| `home:cooperation-dialog:opened` | shell → Home | 原请求的 `requestId` | 无 | shell / Home | 已实现；用于停止打开请求重试 |
| `home:cooperation-dialog:closed` | shell → Home | 无 | 无 | shell / Home | 已实现；用于恢复 Home 内触发按钮焦点 |
| `home:cooperation-dialog:submit` | shell → Home | `requestId`、`formData` | 无；提交 API 待接入 | shell | 已实现消息，外部提交未启用 |

通信实现至少满足：

- 使用稳定、带模块前缀的消息名。
- 请求与结果需要配对时携带 `requestId`。
- Shell 校验 `event.source === frame.contentWindow`，并按需校验来源。
- 不通过延时或 DOM 观察器拼接跨 iframe 视觉状态。

## 模块能力公共化门槛

从模块中提炼的组件、布局模式或交互能力，只有同时满足以下条件才可提升到 `shared/`：

1. 至少两个真实消费者已经使用。
2. DOM、视觉和交互形态基本稳定。
3. 可以说明兼容边界和覆盖风险。
4. 已在 CSS 或模块归属地图中登记。
5. Design System 页面可以展示或核对该公共规范。

Figma Variables、项目级字体与适配 Token、元素级安全基础规则和有节点证据的 Figma Text Style 映射属于系统基础规范，按 `FIGMA_VARIABLES_STYLES_IMPLEMENTATION.md` 的证据与归属规则进入公共 CSS，不适用“先由两个模块消费”的提升流程。它们进入 `shared/` 只表示代码归属已确定，不等于产品组件已经稳定，也不等于完成了多模块或浏览器视觉回归。

用户明确批准从参考 Design System 直接迁入的项目级组件基线不属于“从单一产品模块提炼”。这类组件可以先作为候选公共库进入 `shared/`，但必须登记参考来源、当前消费者和待验证边界；在两个产品模块真实使用前，不得标记为已完成跨模块稳定性验证。

## 修改检查

- 修改 shell：检查顶部导航、路由、iframe、active 状态和 shell 级遮罩。
- 修改公共 CSS：检查 Design System 页面及所有已登记消费者；当前没有已实现的产品模块时，不得把 Design System 检查描述成产品页回归。
- 修改模块：检查 shell 内加载和模块单独打开两种场景。
- 修改协议：同步更新本文件的通信登记表。
- 交付前执行 `git status --short` 与 `git diff --check`；未跟踪文件不受后者覆盖，必须另做静态检查。
