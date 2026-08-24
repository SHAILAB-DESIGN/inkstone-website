# Design System 核对区

本目录用于展示和核对已经稳定的公共 Token、组件与状态，不承载产品业务逻辑，也不自动加入平台主导航。

- `index.html`：原子规范入口，展示颜色、圆角、字体、Text Style、适配 Token 和三档适配原则。
- `components.html`：组件规范入口，展示并实际运行 Buttons、指定的“创建课题”Dialog 和三类 Toast。
- `design-system.css`：仅供本目录页面使用的展示样式。
- `COMPONENT_MIGRATION.md`：组件来源、迁入范围、Token 重绑和公共接口登记。
- 公共产品规则位于 `../shared/css/`，不能为了展示方便复制到本目录。
- 公共组件交互位于 `../shared/js/components.js`；规范页只提供示例 DOM，不复制实现逻辑。
- Figma Variable 与 Style 只有在当前文件的实际节点或导出数据可以追溯时，才进入代码和本页。
- 从产品模块提炼的公共组件仍需两个以上真实消费者；本次由用户明确批准从参考 Design System 迁入的组件作为候选公共基线，当前消费者只有本核对区，不能表述为已完成产品复用验证。
