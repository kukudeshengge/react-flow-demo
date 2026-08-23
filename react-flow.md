# `@xyflow/react` 使用文档

> 本文档根据本项目当前安装的 `@xyflow/react` `12.10.x` 类型声明整理。
> 它覆盖公开导出的 React 组件、Props、Hooks、类型、工具函数和常见用法。

## 1. 安装与最小示例

```bash
npm install @xyflow/react
```

```tsx
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '开始' } },
  { id: '2', position: { x: 200, y: 100 }, data: { label: '结束' } },
];
const initialEdges = [{ id: '1-2', source: '1', target: '2' }];

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection) => setEdges((current) => addEdge(connection, current)),
    [setEdges],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

`ReactFlow` 的父元素必须有明确的宽高。受控模式下需要同时传入 `nodes`、`edges`、`onNodesChange` 和 `onEdgesChange`，否则拖拽、选择、删除等交互不会同步回 React 状态。

## 2. 核心组件

### 2.1 `<ReactFlow />`

主画布组件，负责渲染节点、边、连接线、视口、选择框和交互。

#### 数据 Props

| Prop | 类型 | 默认值 | 说明 |
|---|---|---:|---|
| `nodes` | `Node[]` | `[]` | 受控节点数组。|
| `edges` | `Edge[]` | `[]` | 受控边数组。|
| `defaultNodes` | `Node[]` | `[]` | 非受控模式的初始节点。|
| `defaultEdges` | `Edge[]` | `[]` | 非受控模式的初始边。|
| `defaultEdgeOptions` | `DefaultEdgeOptions` | - | 新建边统一应用的默认属性，单条边自身属性优先。|
| `nodeTypes` | `NodeTypes` | 内置节点 | 自定义节点类型映射，例如 `{ task: TaskNode }`。|
| `edgeTypes` | `EdgeTypes` | 内置边 | 自定义边类型映射，例如 `{ relation: RelationEdge }`。|
| `connectionLineType` | `ConnectionLineType` | `Bezier` | 正在创建连接时的预览线类型。|
| `connectionLineStyle` | `CSSProperties` | - | 连接预览线样式。|
| `connectionLineComponent` | `ConnectionLineComponent` | - | 自定义连接预览线组件。|
| `connectionLineContainerStyle` | `CSSProperties` | - | 预览线容器样式。|
| `viewport` | `Viewport` | - | 受控视口 `{ x, y, zoom }`。需要配合 `onViewportChange`。|
| `defaultViewport` | `Viewport` | `{ x: 0, y: 0, zoom: 1 }` | 初始视口；开启 `fitView` 时会被忽略。|
| `translateExtent` | `CoordinateExtent` | 无限 | 视口可平移边界，如 `[[0, 0], [2000, 2000]]`。|
| `nodeExtent` | `CoordinateExtent` | 无限 | 节点可放置边界。|
| `nodeOrigin` | `NodeOrigin` | `[0, 0]` | 节点定位原点；`[0, 0]` 左上角，`[0.5, 0.5]` 中心。|
| `fitView` | `boolean` | `false` | 初次渲染时缩放并平移，使节点全部可见。|
| `fitViewOptions` | `FitViewOptions` | - | 初始 `fitView` 的 `padding`、`minZoom`、`maxZoom`、`duration`、`nodes` 等配置。|

#### 节点、边与连接交互 Props

| Prop | 类型 | 说明 |
|---|---|---|
| `onNodesChange` | `OnNodesChange` | 节点位置、尺寸、选中、删除、添加、替换等变化。通常直接使用 `useNodesState` 返回值。|
| `onEdgesChange` | `OnEdgesChange` | 边选中、删除、添加、替换等变化。|
| `onConnect` | `OnConnect` | 用户完成连接时触发；使用 `addEdge(connection, edges)` 添加边。|
| `onConnectStart` | `OnConnectStart` | 开始拖拽/点击连接时触发。|
| `onConnectEnd` | `OnConnectEnd` | 连接结束时触发，无论连接是否有效。|
| `onClickConnectStart` | `OnConnectStart` | 点击 Handle 开始连接时触发。|
| `onClickConnectEnd` | `OnConnectEnd` | 点击完成或取消连接时触发。|
| `onNodeClick` | `(event, node) => void` | 单击节点。|
| `onNodeDoubleClick` | `(event, node) => void` | 双击节点。|
| `onNodeContextMenu` | `(event, node) => void` | 右键节点。|
| `onNodeMouseEnter` | `(event, node) => void` | 鼠标进入节点。|
| `onNodeMouseMove` | `(event, node) => void` | 鼠标在节点上移动。|
| `onNodeMouseLeave` | `(event, node) => void` | 鼠标离开节点。|
| `onNodeDragStart` | `OnNodeDrag` | 节点开始拖动。|
| `onNodeDrag` | `OnNodeDrag` | 节点拖动中。|
| `onNodeDragStop` | `OnNodeDrag` | 节点拖动结束。|
| `onEdgeClick` | `(event, edge) => void` | 单击边。|
| `onEdgeDoubleClick` | `(event, edge) => void` | 双击边。|
| `onEdgeContextMenu` | `(event, edge) => void` | 右键边。|
| `onEdgeMouseEnter` | `(event, edge) => void` | 鼠标进入边。|
| `onEdgeMouseMove` | `(event, edge) => void` | 鼠标在边上移动。|
| `onEdgeMouseLeave` | `(event, edge) => void` | 鼠标离开边。|
| `onReconnect` | `OnReconnect` | 拖动已有边的端点重新连接；通常使用 `reconnectEdge`。|
| `onReconnectStart` | `(event, edge, handleType) => void` | 开始重新连接边。|
| `onReconnectEnd` | `(event, edge, handleType, state) => void` | 重新连接结束。|
| `onNodesDelete` | `(nodes) => void` | 节点被删除。|
| `onEdgesDelete` | `(edges) => void` | 边被删除。|
| `onDelete` | `(params) => void` | 节点或边删除。|
| `onBeforeDelete` | `OnBeforeDelete` | 删除前拦截；返回 `false` 可取消，也可以返回修改后的节点和边。|
| `isValidConnection` | `(connection) => boolean` | 全局连接校验；返回 `false` 阻止连接。|
| `connectionMode` | `ConnectionMode.Strict | Loose` | `strict` 只允许 source → target；`loose` 允许 source ↔ source，但不允许 target → target。|
| `connectOnClick` | `boolean` | 是否允许点击 source Handle 后再点击 target Handle 完成连接。|
| `connectionRadius` | `number` | 连接线落点附近可触发连接的半径，默认 `20`。|
| `reconnectRadius` | `number` | 触发边重新连接的半径，默认 `10`。|
| `nodeDragThreshold` | `number` | 节点移动超过多少像素后才视为拖动，默认 `1`。|
| `connectionDragThreshold` | `number` | 连接线移动超过多少像素后才开始创建，默认 `1`。|

#### 选择、键盘与可访问性 Props

| Prop | 类型 | 默认值 | 说明 |
|---|---|---:|---|
| `elementsSelectable` | `boolean` | `true` | 是否允许选择节点和边。单个元素可用 `selectable` 覆盖。|
| `selectNodesOnDrag` | `boolean` | `true` | 拖动节点时是否自动选中。|
| `selectionKeyCode` | `KeyCode \| null` | `Shift` | 按住该键拖动空白处创建选择框。|
| `selectionOnDrag` | `boolean` | `false` | 不按辅助键也允许拖拽选择框。|
| `selectionMode` | `SelectionMode` | `full` | `full` 完全包含才选中；`partial` 部分相交即可选中。|
| `multiSelectionKeyCode` | `KeyCode \| null` | macOS `Meta`，其他 `Control` | 多选节点/边的按键。|
| `deleteKeyCode` | `KeyCode \| null` | `Backspace` | 删除选中节点和边；设为 `null` 禁用。|
| `nodesFocusable` | `boolean` | `true` | 是否可用 Tab 在节点间切换、Enter 选中。|
| `edgesFocusable` | `boolean` | `true` | 是否可用键盘聚焦边。|
| `disableKeyboardA11y` | `boolean` | `false` | 禁用键盘可访问能力。|
| `ariaLabelConfig` | `Partial<AriaLabelConfig>` | - | 自定义控件、MiniMap 和交互描述文本。|

#### 画布平移与缩放 Props

| Prop | 类型 | 默认值 | 说明 |
|---|---|---:|---|
| `panOnDrag` | `boolean \| number[]` | `true` | 拖动画布平移；数组可指定鼠标按键，`[0, 2]` 表示左键和右键。|
| `panOnScroll` | `boolean` | `false` | 用鼠标滚轮或触摸板滚动平移画布。|
| `panOnScrollSpeed` | `number` | `0.5` | 滚动平移速度。|
| `panOnScrollMode` | `PanOnScrollMode` | `free` | `free`、`horizontal`、`vertical`。|
| `panActivationKeyCode` | `KeyCode \| null` | `Space` | 按住该键临时平移。|
| `zoomOnScroll` | `boolean` | `true` | 滚轮缩放；与 `panOnScroll` 通常二选一。|
| `zoomOnPinch` | `boolean` | `true` | 触摸屏/触摸板 pinch 缩放。|
| `zoomOnDoubleClick` | `boolean` | `true` | 双击画布缩放。|
| `minZoom` | `number` | `0.5` | 最小缩放。|
| `maxZoom` | `number` | `2` | 最大缩放。|
| `preventScrolling` | `boolean` | `true` | 指针在画布内时是否阻止页面滚动。|
| `noDragClassName` | `string` | `nodrag` | 给节点内部元素加此 class，阻止节点拖动。|
| `noWheelClassName` | `string` | `nowheel` | 给内部元素加此 class，阻止滚轮行为。|
| `noPanClassName` | `string` | `nopan` | 给内部元素加此 class，阻止拖动事件平移画布。|
| `autoPanOnNodeDrag` | `boolean` | `true` | 拖节点靠近边缘时自动平移。|
| `autoPanOnConnect` | `boolean` | `true` | 创建连接靠近边缘时自动平移。|
| `autoPanOnSelection` | `boolean` | `true` | 框选靠近边缘时自动平移。|
| `autoPanSpeed` | `number` | `15` | 自动平移速度。|

#### 视觉、性能与其他 Props

| Prop | 类型 | 默认值 | 说明 |
|---|---|---:|---|
| `onlyRenderVisibleElements` | `boolean` | `false` | 只渲染视口可见节点和边；大图性能优化，但增加可见性计算开销。|
| `nodesDraggable` | `boolean` | `true` | 全局控制节点是否可拖动。|
| `nodesConnectable` | `boolean` | `true` | 全局控制节点是否可连接。|
| `edgesReconnectable` | `boolean` | `true` | 是否允许重新连接已有边。|
| `autoPanOnNodeFocus` | `boolean` | `true` | 聚焦节点时自动移动视口。|
| `elevateNodesOnSelect` | `boolean` | `true` | 选中节点时提高 z-index。|
| `elevateEdgesOnSelect` | `boolean` | `false` | 选中边时提高 z-index。|
| `zIndexMode` | `'auto' \| 'basic' \| 'manual'` | `basic` | z-index 计算策略。|
| `defaultMarkerColor` | `string \| null` | `#b1b1b7` | 边箭头颜色；`null` 使用 CSS 变量。|
| `snapToGrid` | `boolean` | `false` | 节点拖动时吸附网格。|
| `snapGrid` | `[number, number]` | - | 网格横向和纵向间距。|
| `colorMode` | `'system' \| 'light' \| 'dark'` | `light` | React Flow 内置颜色模式。|
| `debug` | `boolean` | `false` | 输出事件调试信息。|
| `proOptions` | `ProOptions` | - | attribution 等 Pro 相关配置。|
| `attributionPosition` | `PanelPosition` | `bottom-right` | attribution 位置。|
| `onInit` | `(instance) => void` | - | 视口初始化完成后取得 `ReactFlowInstance`。|
| `onMoveStart` | `OnMoveStart` | - | 开始平移或缩放。|
| `onMove` | `OnMove` | - | 平移或缩放中。|
| `onMoveEnd` | `OnMoveEnd` | - | 平移或缩放结束。|
| `onViewportChange` | `(viewport) => void` | - | 受控视口变化回调。|
| `onSelectionChange` | `({ nodes, edges }) => void` | - | 选中集合变化。|
| `onPaneClick` | `(event) => void` | - | 单击空白画布。|
| `onPaneScroll` | `(event) => void` | - | 画布滚动。|
| `onPaneContextMenu` | `(event) => void` | - | 右键空白画布。|
| `onPaneMouseEnter` | `(event) => void` | - | 鼠标进入空白画布。|
| `onPaneMouseMove` | `(event) => void` | - | 鼠标在空白画布移动。|
| `onPaneMouseLeave` | `(event) => void` | - | 鼠标离开空白画布。|
| `paneClickDistance` | `number` | `1` | 画布点击判定允许的移动距离。|
| `nodeClickDistance` | `number` | `0` | 节点点击判定允许的移动距离。|
| `width` / `height` | `number` | - | 固定画布尺寸。|

`ReactFlowProps` 同时继承 `HTMLAttributes<HTMLDivElement>`，因此可以传入 `className`、`style`、`id`、`aria-*` 和普通 DOM 事件。注意 `onError` 使用 React Flow 自己的 `OnError` 类型。

### 2.2 `<ReactFlowProvider />`

提供 React Flow Context，使画布外部的 Sidebar、Toolbar 等组件可以使用 Hooks。

```tsx
<ReactFlowProvider initialNodes={nodes} initialEdges={edges}>
  <ReactFlow />
  <Sidebar />
</ReactFlowProvider>
```

Props：`initialNodes`、`initialEdges`、`defaultNodes`、`defaultEdges`、`initialWidth`、`initialHeight`、`fitView`、`initialFitViewOptions`、`initialMinZoom`、`initialMaxZoom`、`nodeOrigin`、`nodeExtent`、`zIndexMode`、`children`。

需要使用 `useReactFlow`、`useNodes`、`useEdges`、`useViewport` 等 Hook 的组件必须是 `<ReactFlowProvider>` 或 `<ReactFlow>` 的后代。

## 3. 辅助组件

### 3.1 `<Background />`

渲染画布背景图案。`BackgroundVariant`：`Lines`、`Dots`、`Cross`。

Props：

| Prop | 类型 | 默认值 |
|---|---|---:|
| `id` | `string` | - |
| `variant` | `BackgroundVariant` | `Dots` |
| `gap` | `number \| [number, number]` | `20` |
| `size` | `number` | dots `1`，cross `6` |
| `offset` | `number \| [number, number]` | `0` |
| `lineWidth` | `number` | `1` |
| `color` | `string` | - |
| `bgColor` | `string` | - |
| `className` / `patternClassName` | `string` | - |
| `style` | `CSSProperties` | - |

可叠加多个 Background，但每个必须有唯一 `id`。

### 3.2 `<Controls />` 与 `<ControlButton />`

`Controls` 提供放大、缩小、适应视图和交互锁定按钮。

`Controls` Props：`showZoom`、`showFitView`、`showInteractive`（默认均为 `true`）、`fitViewOptions`、`onZoomIn`、`onZoomOut`、`onFitView`、`onInteractiveChange`、`position`、`orientation`（`horizontal | vertical`）、`style`、`className`、`aria-label`、`children`。

```tsx
<Controls position="top-right" orientation="horizontal">
  <ControlButton onClick={() => console.log('custom')}>自定义</ControlButton>
</Controls>
```

`ControlButton` 继承 `ButtonHTMLAttributes<HTMLButtonElement>`，支持 `children`、`onClick`、`title`、`className`、`disabled` 等原生按钮属性。

### 3.3 `<MiniMap />` 与 `<MiniMapNode />`

`MiniMap` 展示全图缩略图和当前视口。

主要 Props：

| Prop | 类型 | 说明 |
|---|---|---|
| `nodeColor` | `string \| (node) => string` | 节点填充色。|
| `nodeStrokeColor` | `string \| (node) => string` | 节点边框色。|
| `nodeClassName` | `string \| (node) => string` | 节点 class。|
| `nodeBorderRadius` | `number` | 节点圆角，默认 `5`。|
| `nodeStrokeWidth` | `number` | 边框宽度，默认 `2`。|
| `nodeComponent` | `ComponentType<MiniMapNodeProps>` | 自定义 SVG 节点组件。|
| `bgColor` | `string` | MiniMap 背景色。|
| `maskColor` | `string` | 非当前视口区域遮罩色。|
| `maskStrokeColor` / `maskStrokeWidth` | `string` / `number` | 视口边框。|
| `position` | `PanelPosition` | 默认 `bottom-right`。|
| `onClick` | `(event, position) => void` | 点击缩略图定位。|
| `onNodeClick` | `(event, node) => void` | 点击缩略图节点。|
| `pannable` | `boolean` | 是否可以拖动缩略图平移主视口。|
| `zoomable` | `boolean` | 是否可以在缩略图滚动缩放。|
| `ariaLabel` | `string \| null` | 无障碍名称。|
| `inversePan` / `zoomStep` / `offsetScale` | `boolean` / `number` / `number` | 反向平移、缩放步长、视口边距。|

`MiniMapNode` 是自定义缩略图节点组件，接收 `id`、`x`、`y`、`width`、`height`、`style`、`color`、`strokeColor`、`strokeWidth`、`className`、`borderRadius`、`shapeRendering`、`selected`、`onClick`。

### 3.4 `<Panel />`

在画布上方定位任意内容，不随画布缩放。

```tsx
<Panel position="top-left">节点数量：{nodes.length}</Panel>
```

Props：继承 `HTMLAttributes<HTMLDivElement>`，另外有 `position`：`top-left`、`top-center`、`top-right`、`bottom-left`、`bottom-center`、`bottom-right`。

### 3.5 `<Handle />`

自定义节点的连接点。

```tsx
<Handle type="target" position={Position.Left} id="input" />
<Handle type="source" position={Position.Right} id="output" />
```

主要 Props：`type`（`source | target`）、`position`（`Top | Right | Bottom | Left`）、`id`、`isConnectable`、`isConnectableStart`、`isConnectableEnd`、`style`、`className`、`aria-*`、`onConnect`、`onMouseDown` 等原生 div 属性。

`id` 在同一节点拥有多个相同类型 Handle 时必须设置。单个 Handle 的 `isConnectable` 可以是布尔值或连接数量限制。

### 3.6 `<NodeResizer />`、`<NodeResizeControl />`

为节点提供尺寸调整能力。

```tsx
<NodeResizer minWidth={120} minHeight={40} isVisible={selected} />
```

共同 Props：`nodeId`、`isVisible`、`color`、`minWidth`、`minHeight`、`maxWidth`、`maxHeight`、`keepAspectRatio`、`autoScale`、`shouldResize`、`onResizeStart`、`onResize`、`onResizeEnd`。

`NodeResizer` 自动渲染四条边和八个角控制点。

`NodeResizeControl` 支持自定义内容，额外 Props：`position`、`variant`（`handle | line`）、`resizeDirection`、`className`、`style`、`children`。`ResizeControlLine` 是线型控制的辅助组件。

### 3.7 `<NodeToolbar />`

在节点旁显示不随画布缩放的工具栏或 Tooltip。

```tsx
<NodeToolbar isVisible={selected} position={Position.Top}>
  <button>删除</button>
</NodeToolbar>
```

Props：继承 `HTMLAttributes<HTMLDivElement>`，另外有 `nodeId`（单个或多个节点）、`isVisible`、`position`、`offset`（默认 `10`）、`align`（`start | center | end`）。默认仅在节点选中且单选时显示。

### 3.8 `<EdgeToolbar />`

在自定义边中显示不随画布缩放的工具栏。

```tsx
<EdgeToolbar edgeId={id} x={centerX} y={centerY} isVisible>
  <button>删除边</button>
</EdgeToolbar>
```

Props：必填 `edgeId`、`x`、`y`；以及 `isVisible`、`alignX`、`alignY`、`children` 和原生 div 属性。

### 3.9 `<EdgeLabelRenderer />`

通过 Portal 在边上方渲染 HTML 标签。默认没有 pointer events；需要交互时设置 `pointerEvents: 'all'`，并在交互元素上使用 `nodrag nopan`。

```tsx
<EdgeLabelRenderer>
  <div
    className="nodrag nopan"
    style={{
      position: 'absolute',
      transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
      pointerEvents: 'all',
    }}
  >
    标签
  </div>
</EdgeLabelRenderer>
```

Props：只有 `children: ReactNode`。

### 3.10 `<ViewportPortal />`

把自定义 DOM 放入与节点、边相同的 viewport 坐标系，会随平移和缩放变化。

```tsx
<ViewportPortal>
  <div style={{ position: 'absolute', transform: 'translate(100px, 100px)' }}>
    画布坐标内容
  </div>
</ViewportPortal>
```

Props：`children: ReactNode`。

## 4. 内置边组件与边工具

内置边类型：`default`（Bezier）、`straight`、`step`、`smoothstep`、`simplebezier`。

可直接使用的边组件：`BaseEdge`、`BezierEdge`、`StraightEdge`、`StepEdge`、`SmoothStepEdge`、`SimpleBezierEdge`、`EdgeText`。

### 边通用 Props

自定义边组件接收 `EdgeProps`，常用字段如下：

| 字段 | 说明 |
|---|---|
| `id` | 边唯一 ID。|
| `source` / `target` | 源节点和目标节点 ID。|
| `sourceHandle` / `targetHandle` | 连接的 Handle ID。|
| `sourceX` / `sourceY` | 源端绝对坐标。|
| `targetX` / `targetY` | 目标端绝对坐标。|
| `sourcePosition` / `targetPosition` | 端点方向。|
| `label` | 边标签，可为 ReactNode。|
| `labelStyle` | SVG 标签样式。|
| `labelShowBg` | 是否显示标签背景。|
| `labelBgStyle` | 标签背景样式。|
| `labelBgPadding` | `[x, y]` 标签背景内边距。|
| `labelBgBorderRadius` | 标签背景圆角。|
| `style` | 边 SVG 样式。|
| `markerStart` / `markerEnd` | 起点/终点箭头。|
| `animated` | 是否动画。|
| `selectable` / `deletable` / `focusable` | 交互能力。|
| `reconnectable` | 是否允许重新连接。|
| `interactionWidth` | 不可见的可交互边宽度。|
| `data` | 自定义业务数据。|

`BaseEdge` 额外处理边的交互区域、标签、箭头和可访问性，推荐自定义边时复用它。

`EdgeText` Props：`x`、`y`、`label`、`labelStyle`、`labelShowBg`、`labelBgStyle`、`labelBgPadding`、`labelBgBorderRadius`、`children`、`className` 及 SVG 文本属性。

## 5. 自定义节点

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';

type TaskNode = Node<{ title: string }, 'task'>;

function Task({ data, selected }: NodeProps<TaskNode>) {
  return (
    <div className={selected ? 'selected' : ''}>
      <Handle type="target" position={Position.Left} />
      <strong>{data.title}</strong>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes = { task: Task };
const nodes = [
  {
    id: 'task-1',
    type: 'task',
    position: { x: 100, y: 100 },
    data: { title: '审核' },
  },
];
```

`NodeProps<NodeType>` 常用字段：`id`、`data`、`type`、`selected`、`dragging`、`selectable`、`deletable`、`isConnectable`、`positionAbsoluteX`、`positionAbsoluteY`、`zIndex`、`width`、`height`、`sourcePosition`、`targetPosition`、`parentId`、`draggable`、`focusable`。

节点对象常用字段：

| 字段 | 类型/说明 |
|---|---|
| `id` | 必填，唯一字符串。|
| `type` | `input`、`default`、`output`、`group` 或 `nodeTypes` 中的自定义 key。|
| `position` | 必填，画布坐标 `{ x, y }`。|
| `data` | 业务数据。|
| `style` | 节点容器样式。|
| `className` | 节点 class。|
| `hidden` | 是否隐藏。|
| `selected` | 是否选中。|
| `dragging` | 是否正在拖动。|
| `draggable` | 是否可拖动。|
| `selectable` | 是否可选中。|
| `connectable` | 是否允许连接。|
| `deletable` | 是否可删除。|
| `focusable` | 是否可聚焦。|
| `width` / `height` | 节点尺寸；通常由 React Flow 测量。|
| `parentId` | 父节点 ID，用于嵌套/分组。|
| `extent` | 节点移动边界或 `'parent'`。|
| `expandParent` | 子节点拖到边缘时是否扩展父节点。|
| `sourcePosition` / `targetPosition` | 默认 Handle 方向。|
| `origin` | 节点自身定位原点。|
| `ariaLabel` | 节点无障碍名称。|

## 6. Hooks

### `useReactFlow<Node, Edge>()`

返回 `ReactFlowInstance`，用于读写节点、边、视口和坐标。

主要方法：

| 方法 | 说明 |
|---|---|
| `getNodes()` / `getNode(id)` | 获取全部节点或单个节点。|
| `getEdges()` / `getEdge(id)` | 获取全部边或单条边。|
| `setNodes(nodesOrUpdater)` | 替换/更新节点。|
| `setEdges(edgesOrUpdater)` | 替换/更新边。|
| `addNodes(nodes)` / `addEdges(edges)` | 添加节点/边。|
| `updateNode(id, update, options?)` | 更新节点。|
| `updateNodeData(id, data, options?)` | 更新节点 `data`。|
| `updateEdge(id, update, options?)` | 更新边。|
| `updateEdgeData(id, data, options?)` | 更新边 `data`。|
| `deleteElements({ nodes, edges })` | 删除元素，返回 Promise。|
| `getIntersectingNodes(node, partially, excludeNonSelectableNodes)` | 查找相交节点。|
| `isNodeIntersecting(node, area, partially, excludeNonSelectableNodes)` | 判断节点与区域是否相交。|
| `getNodesBounds(nodes)` | 获取节点包围盒。|
| `getViewport()` | 获取 `{ x, y, zoom }`。|
| `setViewport(viewport, options?)` | 设置视口。|
| `setCenter(x, y, options?)` | 将指定画布坐标居中。|
| `fitView(options?)` | 让节点适应视口。|
| `fitBounds(bounds, options?)` | 让矩形区域适应视口。|
| `zoomIn(options?)` / `zoomOut(options?)` | 缩放一步。|
| `zoomTo(zoom, options?)` | 缩放到指定倍数。|
| `setViewportConstrained(viewport, options?)` | 设置受边界约束的视口。|
| `screenToFlowPosition({ x, y }, options?)` | 屏幕坐标转换为画布坐标，适合点击添加节点。|
| `flowToScreenPosition({ x, y })` | 画布坐标转换为屏幕坐标。|
| `getHandleConnections({ type, nodeId, id })` | 获取 Handle 连接。|
| `getNodeConnections({ type, nodeId, handleId })` | 获取节点连接。|
| `getIncomers(node)` / `getOutgoers(node)` | 获取上游/下游节点。|
| `viewportInitialized` | 当前视口是否已初始化。|

### `useNodesState(initialNodes)` / `useEdgesState(initialEdges)`

返回三元组：`[items, setItems, onItemsChange]`。

```tsx
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

setNodes((current) => [
  ...current,
  { id: 'new', position: { x: 0, y: 0 }, data: { label: '新节点' } },
]);
```

该 Hook 适合快速开发和中小型应用；大型应用可以使用 Zustand 或其他状态管理方案。

### 状态读取 Hooks

| Hook | 返回值/用途 |
|---|---|
| `useNodes()` | 当前所有节点；任一节点变化都会重新渲染。|
| `useEdges()` | 当前所有边；任一边变化都会重新渲染。|
| `useNodesData(id)` | 单个节点的 `{ id, type, data }`。传数组则返回数组。|
| `useInternalNode(id)` | 内部节点对象，包含测量信息和绝对位置。|
| `useNodeId()` | 当前自定义节点的 ID。|
| `useViewport()` | 当前 `{ x, y, zoom }`；视口变化时重新渲染。|
| `useNodesInitialized(options?)` | 所有节点是否已完成宽高测量；可传 `includeHiddenNodes`。|
| `useConnection(selector?)` | 当前正在创建的连接状态。|
| `useNodeConnections(params)` | 读取节点/Handle 的连接，推荐 API。|
| `useHandleConnections(params)` | 读取 Handle 连接，已 deprecated，推荐 `useNodeConnections`。|
| `useKeyPress(keyCode, options?)` | 监听按键是否处于按下状态。|
| `useOnSelectionChange({ onChange })` | 监听节点和边的选中变化；回调需 memoize。|
| `useOnViewportChange({ onStart, onChange, onEnd })` | 监听视口变化的开始、过程和结束。|
| `useUpdateNodeInternals()` | 动态增删 Handle 或改变 Handle 位置后刷新节点内部尺寸。|
| `useStore(selector, equalityFn?)` | 订阅内部 Zustand store 的选定状态。|
| `useStoreApi()` | 取得内部 store 的 `getState`、`setState`、`subscribe`。|

`useNodes`、`useEdges` 等 Hook 要放在 Provider 内。`useStore` 和 `useStoreApi` 属于底层能力，优先使用上层 Hook 或 `useReactFlow`。

### 实验性 Middleware

```tsx
experimental_useOnNodesChangeMiddleware((changes) => changes);
experimental_useOnEdgesChangeMiddleware((changes) => changes);
```

用于在变化进入状态处理前转换 `NodeChange[]` 或 `EdgeChange[]`。传入的函数应该使用 `useCallback` 保持稳定。

## 7. 数据变化与工具函数

### `applyNodeChanges` / `applyEdgeChanges`

把 React Flow 产生的 Change 数组应用到现有状态：

```tsx
const onNodesChange = useCallback(
  (changes) => setNodes((nodes) => applyNodeChanges(changes, nodes)),
  [],
);
```

常见 Change：`position`、`dimensions`、`select`、`remove`、`add`、`replace`。

### `addEdge(connection, edges, options?)`

将 `Connection` 转成完整 `Edge` 并追加；如果相同连接已存在，不会重复添加。

```tsx
setEdges((edges) => addEdge({ source: 'a', target: 'b' }, edges));
```

### `reconnectEdge(oldEdge, connection, edges, options?)`

根据新的 source/target 替换已有边的连接端点。`options.shouldReplaceId` 默认 `true`。

### `isNode(value)` / `isEdge(value)`

运行时判断对象是否为节点或边。

### 图关系工具

| 函数 | 作用 |
|---|---|
| `getConnectedEdges(nodes, edges)` | 获取与节点集合相连的边。|
| `getIncomers(node, nodes, edges)` | 获取指向节点的上游节点。|
| `getOutgoers(node, nodes, edges)` | 获取节点指向的下游节点。|
| `getNodesBounds(nodes)` | 计算节点包围盒。|

## 8. 路径、边和几何工具

### 路径函数

```tsx
const [path, labelX, labelY, offsetX, offsetY] = getBezierPath({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
});
```

公开函数：

- `getBezierPath(options)`：Bezier 曲线。
- `getSimpleBezierPath(options)`：简单 Bezier 曲线。
- `getSmoothStepPath(options)`：带圆角的折线。
- `getStraightPath(options)`：直线。
- `getBezierEdgeCenter(...)`：Bezier 中心点和偏移。
- `getEdgeCenter(...)`：通用边中心点和偏移。
- `getViewportForBounds(bounds, width, height, minZoom, maxZoom, padding)`：根据包围盒计算视口。

所有路径函数通常返回 `[path, labelX, labelY, offsetX, offsetY]`，其中前三项适合绘制路径和放置标签。

### Marker

`MarkerType`：`Arrow`、`ArrowClosed`。通过 `markerStart`、`markerEnd` 和 `EdgeMarker` 配置箭头。

```tsx
const edges = [
  {
    id: 'a-b',
    source: 'a',
    target: 'b',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#555' },
  },
];
```

## 9. 关键类型与枚举

```ts
type XYPosition = { x: number; y: number };
type Viewport = { x: number; y: number; zoom: number };
type CoordinateExtent = [[number, number], [number, number]];
type SnapGrid = [number, number];
type NodeOrigin = [number, number];
```

常用枚举/联合类型：

- `Position`: `Top`、`Right`、`Bottom`、`Left`。
- `ConnectionMode`: `Strict`、`Loose`。
- `ConnectionLineType`: `Bezier`、`Straight`、`Step`、`SmoothStep`、`SimpleBezier`。
- `SelectionMode`: `Full`、`Partial`。
- `PanOnScrollMode`: `Free`、`Horizontal`、`Vertical`。
- `BackgroundVariant`: `Lines`、`Dots`、`Cross`。
- `PanelPosition`: 六个角落/中间位置。
- `ResizeControlVariant`: `Handle`、`Line`。
- `ColorMode`: `system`、`light`、`dark`。

泛型写法：

```ts
type MyNode = Node<{ title: string }, 'task'>;
type MyEdge = Edge<{ weight: number }, 'weighted'>;
type MyNodeProps = NodeProps<MyNode>;
type MyEdgeProps = EdgeProps<MyEdge>;
```

## 10. 常见实现模式

### 双击空白处创建节点

React Flow 12 没有专用的 `onPaneDoubleClick`，可以监听容器双击并确认目标位于 `.react-flow__pane`：

```tsx
const onDoubleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.react-flow__pane')) return;

  const position = screenToFlowPosition({
    x: event.clientX,
    y: event.clientY,
  });

  setNodes((nodes) => [
    ...nodes,
    { id: crypto.randomUUID(), position, data: { label: '新节点' } },
  ]);
}, [screenToFlowPosition, setNodes]);

<ReactFlow onDoubleClick={onDoubleClick} zoomOnDoubleClick={false} />;
```

### 无限画布与触摸板平移

默认 `translateExtent` 就是无限范围。需要鼠标拖动和触摸板滚动都平移时：

```tsx
<ReactFlow
  panOnDrag
  panOnScroll
  zoomOnScroll={false}
  translateExtent={[
    [-Infinity, -Infinity],
    [Infinity, Infinity],
  ]}
  minZoom={0.2}
  maxZoom={4}
/>
```

### 受控视口

```tsx
const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

<ReactFlow
  viewport={viewport}
  onViewportChange={setViewport}
/>
```

### 动态 Handle

动态增删 Handle 或改变 Handle 位置后，必须调用 `updateNodeInternals(nodeId)`，否则连接位置可能仍使用旧测量结果。

### 边标签交互

`EdgeLabelRenderer` 的内容默认不能接收鼠标事件。交互标签应设置 `pointerEvents: 'all'`，并添加 `nodrag nopan`，避免点击按钮时拖动节点或画布。

## 11. CSS 与样式

必须引入官方样式：

```tsx
import '@xyflow/react/dist/style.css';
```

画布及节点常见 class：

- `.react-flow`
- `.react-flow__renderer`
- `.react-flow__viewport`
- `.react-flow__pane`
- `.react-flow__node`
- `.react-flow__edge`
- `.react-flow__handle`
- `.react-flow__controls`
- `.react-flow__minimap`
- `.react-flow__panel`
- `.nodrag`、`.nopan`、`.nowheel`

可通过 `colorMode="dark"`、CSS 变量和自定义 class 定制颜色；节点和边也可以分别使用 `style`、`className` 和自定义组件实现完全定制。

## 12. 版本注意事项

- 本文档按当前项目的 `@xyflow/react` 12.10.x API 编写，升级主版本后应重新核对类型声明。
- `useHandleConnections` 已标记 deprecated，新代码使用 `useNodeConnections`。
- React Flow Provider 内部使用 Zustand store，但业务代码优先使用公开 Hooks 和 `useReactFlow`。
- 大量节点时可以考虑 `onlyRenderVisibleElements`、节点 memo、稳定的 `nodeTypes`/`edgeTypes` 对象以及外部状态管理。

## 不管不顾啊
