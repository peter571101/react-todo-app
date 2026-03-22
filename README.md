在线预览链接:<https://peter571101.github.io/react-todo-app>



https://github.com/user-attachments/assets/bbcbc609-6f16-458e-9238-7d3744150c68



### 核心功能

①**基础增删改查**：支持添加任务、编辑名称以及单项或批量删除。

②**状态切换**：可以手动标记任务为“已完成”或“待完成”，不同状态会有不同的视觉反馈。

③**时间记录**：利用 `dayjs` 库记录了每个任务的创建时间和最后修改时间。

④**交互弹窗**：使用 React Portal 思想实现了自定义模态框，用于二次确认删除和编辑内容，防止误操作。

### 技术实现

①**框架**：React + TypeScript (确保代码逻辑更严谨)

②**样式**：Tailwind CSS (响应式布局，适配了不同尺寸的屏幕)

③**图标**：Lucide React (简洁的矢量图标)

④**工具**：`clsx` 和 `tailwind-merge` 用于处理复杂的动态类名。

### 本地运行

①下载代码到本地。

②在终端运行 `npm install` 安装必要的依赖包。

③运行 `npm run dev` 即可在浏览器预览。

④如需部署到 GitHub Pages，请确保在 `vite.config.ts` 中配置正确的 `base` 路径，然后执行 `npm run deploy`。

### 待改进的地方

①目前数据存储在内存中，页面刷新后会重置，后续计划接入 `localStorage` 实现持久化存储。

②计划增加任务优先级分类（高、中、低）。
