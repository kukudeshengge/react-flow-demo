# Canvas Studio · 自由画布 Demo

一个基于 [React Flow](https://reactflow.dev) 的「AI 视频创作自由画布」原型，对标 LibTV / 小云雀类产品，用于演示以无限画布为核心的创作工作流交互。

> 当前为纯前端本地 Demo，使用 Mock 数据模拟生成过程，未接入真实 AI 模型、账号、计费、云端存储或任务队列。完整规划见 [`自由画布技术方案.md`](./自由画布技术方案.md)。

## 技术栈

- React 18 + TypeScript
- Vite 5（开发服务器与构建工具）
- [@xyflow/react](https://npmjs.com/package/@xyflow/react) v12（画布核心）
- ESLint + react-hooks 插件

## 功能特性

### 已实现

- **节点体系**：10 种创作节点 —— 灵感、文本、剧本、角色、场景、分镜、图片、视频、音频、生成器，统一采用卡片式设计，按类型区分图标与主题色。
- **添加节点**：左侧工具栏打开节点选择器；双击画布空白处快速添加文本节点。
- **连线**：拖拽节点端口建立连接（smoothstep 曲线），边携带关系类型（context / reference / result）。
- **对齐吸附**：拖动节点时自动检测与其他节点的左/中/右、上/中/下对齐关系，8px 阈值内吸附并显示辅助线。
- **画布体验**：无限画布平移、缩放（0.2x–4x）、MiniMap 导航、适应画布、点状背景网格。
- **视觉反馈**：选中或悬停时连接线播放流动动画；生成中的节点显示进度条与状态标签。

### 待实现（当前为占位交互）

- 撤销 / 重做
- 项目 JSON 导出
- 预览模式（模拟播放器）
- 右侧属性面板（风格库、画布设置、节点属性、资产详情）
- 资产库、模板库、风格库浮层

## 示例数据

内置示例项目「我的 AI 短片 · 一场关于月亮的旅行」，演示完整创作链路：

```text
灵感 → 剧本大纲 ─┐
角色设定 ────────┼→ 分镜 → 生成视频
场景设定 ────────┘
```

## 快速开始

```bash
# 安装依赖
npm install   # 或 pnpm install

# 启动开发服务器
npm run dev

# 代码检查（零警告要求）
npm run lint

# 类型检查 + 生产构建
npm run build
```

## 项目结构

```text
src/
├── App.tsx               # 主应用：顶栏、左侧工具栏、画布、状态栏
├── main.tsx              # 入口
├── index.css             # 全部样式（深色工作台主题）
├── canvasTypes.ts        # 节点/边类型定义
├── data/
│   └── demoProject.ts    # 示例项目的初始节点与连线
├── nodes/
│   ├── CreativeNode.tsx  # 所有节点共用的卡片组件
│   ├── index.ts          # nodeTypes 注册表
│   └── types.ts          # 节点类型辅助定义
└── edges/
    └── index.ts          # 边类型导出
```

## 核心概念

### 节点类型（`CreativeNodeType`）

| 类型 | 说明 |
|---|---|
| `idea` | 灵感记录 |
| `text` | 文本 / 提示词 |
| `script` | 剧本大纲 |
| `character` | 角色设定资产 |
| `scene` | 场景设定资产 |
| `storyboard` | 分镜镜头 |
| `image` | 图片生成结果 |
| `video` | 视频生成结果 |
| `audio` | 音频生成结果 |
| `generator` | 生成器节点 |

所有类型共用同一个 `CreativeNode` 组件渲染，通过 `data` 中的 `title`、`description`、`content`、`prompt`、`tags`、`status` 等字段控制展示。

## 相关文档

- [React Flow 官方文档](https://reactflow.dev)
- [`自由画布技术方案.md`](./自由画布技术方案.md) — 完整的产品与技术规划（页面布局、交互细节、阶段目标）
- [`react-flow.md`](./react-flow.md) — React Flow 相关笔记

## License

MIT
