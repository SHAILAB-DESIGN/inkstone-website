# 模块责任归属地图

本文登记平台 shell、主导航模块、辅助页面与共享能力的所有权。新增模块或修改模块边界时同步更新。

## 平台入口

| 区域 | 路径 | 责任 | 影响级别 | 状态 |
| --- | --- | --- | --- | --- |
| 平台 shell | `index.html` | 顶部导航、iframe 容器和 shell 级合作申请挂载点 | 高 | 已实现 |
| Shell 脚本 | `shared/js/shell.js` | Home 路由、顶部导航、锚点与跨 iframe 分发 | 高 | 已实现 |
| Shell 样式 | `shared/css/shell.css` | 顶部导航、shell 布局、iframe 与 shell 弹窗 | 高 | 已实现 |

## 模块清单

| 模块 | 路径 | 是否进入主导航 | 所有权 | 状态 |
| --- | --- | --- | --- | --- |
| Home | `tabs/home/` | 是，shell 默认路由 | Home DOM、私有样式、脚本、数据和 Figma 资源 | 已实现 |

目录存在不等于已经加入主导航。只有在 shell 路由表和顶部导航中显式登记后，模块才成为可导航页面。

## 辅助页面

| 页面 | 路径 | 责任 | 限制 |
| --- | --- | --- | --- |
| Design System | `design-system/` | 展示和核对公共 Token、组件与状态 | 不自动加入产品主导航，不承载产品逻辑 |

## 共享依赖

| 路径 | 责任 | 修改要求 |
| --- | --- | --- |
| `shared/css/` | 公共 Token、基础样式、shell 和稳定组件规则 | 查 CSS 归属地图并检查消费者 |
| `shared/js/components.js` | 候选公共组件的 Dialog、计数 / 单选与 Toast 行为 | 不放产品提交、路由或模块私有状态；当前消费者仅 Design System |
| `shared/js/` 其他文件 | Shell 与确需共享的轻量运行时 | 不放模块私有交互 |
| `shared/assets/` | Shell 或两个以上模块共同使用的资源 | 记录消费者，避免作为兜底资源池 |

## 模块修改边界

模块任务默认只修改：

```text
tabs/<module-id>/
├── index.html
├── <module-id>.css
├── <module-id>.js
└── assets/
```

需要修改 shell、公共 CSS、共享 JS 或共享资源时，应在动手前说明原因、影响范围和消费者。

## 新增模块登记

1. 创建模块目录和独立入口。
2. 在本文件的模块清单登记名称、路径、导航状态与所有权。
3. 如需主导航入口，再更新 shell 路由与顶部导航。
4. 如需跨 iframe 能力，在架构地图登记协议。
5. 模块专属样式和脚本留在模块目录。
