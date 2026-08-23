import { useCallback, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  ViewportPortal,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type EdgeMouseHandler,
  type OnNodeDrag,
  type OnConnect,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import type { CreativeNode, CreativeNodeType } from './canvasTypes';
import { initialEdges, initialNodes } from './data/demoProject';
import { nodeTypes } from './nodes';

const nodeMenu: Array<{ type: CreativeNodeType; label: string; icon: string }> = [
  { type: 'idea', label: '灵感', icon: '✦' },
  { type: 'text', label: '文本', icon: 'T' },
  { type: 'script', label: '剧本', icon: '☷' },
  { type: 'character', label: '角色', icon: '◉' },
  { type: 'scene', label: '场景', icon: '▧' },
  { type: 'storyboard', label: '分镜', icon: '▦' },
  { type: 'image', label: '图片', icon: '▣' },
  { type: 'video', label: '视频', icon: '▶' },
  { type: 'audio', label: '音频', icon: '♫' },
  { type: 'generator', label: '生成', icon: '✧' },
];

const nodeDefaults: Record<CreativeNodeType, { title: string; description: string; accent: string }> = {
  idea: { title: '新的灵感', description: '记录一个值得继续发展的想法。', accent: '#f4b740' },
  text: { title: '文本节点', description: '输入一段文字或提示词。', accent: '#94a3b8' },
  script: { title: '新剧本', description: '从大纲开始组织故事。', accent: '#a78bfa' },
  character: { title: '新角色', description: '建立角色设定和参考资产。', accent: '#e879f9' },
  scene: { title: '新场景', description: '描述故事发生的空间和氛围。', accent: '#60a5fa' },
  storyboard: { title: '新分镜', description: '设计一个镜头。', accent: '#34d399' },
  image: { title: '图片结果', description: '等待生成图片。', accent: '#38bdf8' },
  video: { title: '视频结果', description: '等待生成视频。', accent: '#fb7185' },
  audio: { title: '音频结果', description: '等待生成音频。', accent: '#f59e0b' },
  generator: { title: '生成器', description: '连接素材后开始生成。', accent: '#fb7185' },
};

type AlignmentGuides = { vertical: number[]; horizontal: number[] };
const NODE_WIDTH = 248;
const NODE_HEIGHT = 150;
const GUIDE_THRESHOLD = 8;

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const [guides, setGuides] = useState<AlignmentGuides>({ vertical: [], horizontal: [] });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [projectName, setProjectName] = useState('我的 AI 短片');
  const { screenToFlowPosition, fitView } = useReactFlow();
  const nodeId = useRef(initialNodes.length);
  const renderedEdges = useMemo(() => {
    const selectedNodeIds = new Set(nodes.filter((node) => node.selected).map((node) => node.id));

    return edges.map((edge) => ({
      ...edge,
      className: selectedNodeIds.has(edge.source) || selectedNodeIds.has(edge.target) || hoveredEdgeId === edge.id
        ? 'edge-animated'
        : undefined,
    }));
  }, [edges, hoveredEdgeId, nodes]);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((current) => addEdge({ ...connection, type: 'smoothstep', data: { relation: 'context' } }, current)),
    [setEdges],
  );

  const addCreativeNode = useCallback((type: CreativeNodeType, position?: { x: number; y: number }) => {
    const defaults = nodeDefaults[type];
    const nextId = `creative-${nodeId.current++}`;
    const nextPosition = position ?? screenToFlowPosition({
      x: window.innerWidth / 2 + (nodeId.current % 4) * 28,
      y: window.innerHeight / 2 + (nodeId.current % 3) * 28,
    });

    setNodes((current) => [...current, {
      id: nextId,
      type,
      position: nextPosition,
      data: { ...defaults, status: type === 'generator' ? 'idle' : undefined },
    }]);
    setIsMenuOpen(false);
  }, [screenToFlowPosition, setNodes]);

  const onCanvasDoubleClick = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.react-flow__pane')) return;
    addCreativeNode('text', screenToFlowPosition({ x: event.clientX, y: event.clientY }));
  }, [addCreativeNode, screenToFlowPosition]);

  const onNodeDrag: OnNodeDrag<CreativeNode> = useCallback((_, draggedNode) => {
    const draggedWidth = draggedNode.width ?? NODE_WIDTH;
    const draggedHeight = draggedNode.height ?? NODE_HEIGHT;
    const draggedX = [
      draggedNode.position.x,
      draggedNode.position.x + draggedWidth / 2,
      draggedNode.position.x + draggedWidth,
    ];
    const draggedY = [
      draggedNode.position.y,
      draggedNode.position.y + draggedHeight / 2,
      draggedNode.position.y + draggedHeight,
    ];
    const vertical: number[] = [];
    const horizontal: number[] = [];
    let snapX: { delta: number; distance: number; guide: number } | undefined;
    let snapY: { delta: number; distance: number; guide: number } | undefined;

    nodes.forEach((node) => {
      if (node.id === draggedNode.id) return;
      const width = node.width ?? NODE_WIDTH;
      const height = node.height ?? NODE_HEIGHT;
      const nodeX = [node.position.x, node.position.x + width / 2, node.position.x + width];
      const nodeY = [node.position.y, node.position.y + height / 2, node.position.y + height];

      nodeX.forEach((targetX) => {
        draggedX.forEach((currentX) => {
          const distance = Math.abs(currentX - targetX);
          if (distance <= GUIDE_THRESHOLD) {
            vertical.push(targetX);
            if (!snapX || distance < snapX.distance) snapX = { delta: targetX - currentX, distance, guide: targetX };
          }
        });
      });
      nodeY.forEach((targetY) => {
        draggedY.forEach((currentY) => {
          const distance = Math.abs(currentY - targetY);
          if (distance <= GUIDE_THRESHOLD) {
            horizontal.push(targetY);
            if (!snapY || distance < snapY.distance) snapY = { delta: targetY - currentY, distance, guide: targetY };
          }
        });
      });
    });

    if (snapX || snapY) {
      setNodes((current) => current.map((node) => node.id === draggedNode.id
        ? {
          ...node,
          position: {
            x: node.position.x + (snapX?.delta ?? 0),
            y: node.position.y + (snapY?.delta ?? 0),
          },
        }
        : node));
    }

    setGuides({
      vertical: snapX ? [snapX.guide] : [...new Set(vertical)],
      horizontal: snapY ? [snapY.guide] : [...new Set(horizontal)],
    });
  }, [nodes, setNodes]);

  const clearGuides = useCallback(() => setGuides({ vertical: [], horizontal: [] }), []);
  const onEdgeMouseEnter: EdgeMouseHandler = useCallback((_, edge) => setHoveredEdgeId(edge.id), []);
  const onEdgeMouseLeave: EdgeMouseHandler = useCallback(() => setHoveredEdgeId(null), []);

  return (
    <main className="studio-shell">
      <header className="studio-topbar">
        <div className="brand-lockup"><span className="brand-mark">✦</span><span>Canvas Studio</span><small>BETA</small></div>
        <div className="project-title">
          <input value={projectName} onChange={(event) => setProjectName(event.target.value)} aria-label="项目名称" />
          <span className="save-state"><i /> 已保存</span>
        </div>
        <div className="topbar-actions">
          <button className="ghost-button" onClick={() => window.alert('撤销功能将在下一阶段接入')}>↶</button>
          <button className="ghost-button" onClick={() => window.alert('重做功能将在下一阶段接入')}>↷</button>
          <span className="topbar-divider" />
          <button className="ghost-button" onClick={() => fitView({ padding: 0.25, duration: 350 })}>⌗ 适应画布</button>
          <button className="ghost-button" onClick={() => window.alert('预览模式 Demo')}>▷ 预览</button>
          <button className="primary-button" onClick={() => window.alert('项目 JSON 导出将在下一阶段接入')}>导出项目</button>
          <div className="avatar">S</div>
        </div>
      </header>

      <div className="studio-body">
        <aside className="left-rail">
          <div className="rail-section-title">创作</div>
          <button className={`rail-item ${isMenuOpen ? 'is-active' : ''}`} onClick={() => setIsMenuOpen((open) => !open)}><span>＋</span><b>添加节点</b></button>
          <button className="rail-item" onClick={() => window.alert('资产库浮层将在后续版本接入')}><span>◇</span><b>资产库</b></button>
          <button className="rail-item" onClick={() => window.alert('模板库 Demo')}><span>▤</span><b>模板</b></button>
          <div className="rail-spacer" />
          <button className="rail-item" onClick={() => window.alert('风格库浮层将在后续版本接入')}><span>✧</span><b>风格</b></button>
          <button className="rail-item" onClick={() => window.alert('画布设置浮层将在后续版本接入')}><span>⚙</span><b>设置</b></button>
        </aside>

        <section className="canvas-stage">
          <ReactFlow
            nodes={nodes}
            edges={renderedEdges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeMouseEnter={onEdgeMouseEnter}
            onEdgeMouseLeave={onEdgeMouseLeave}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={clearGuides}
            onPaneClick={() => setIsMenuOpen(false)}
            onDoubleClick={onCanvasDoubleClick}
            panOnDrag
            panOnScroll
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            translateExtent={[[-Infinity, -Infinity], [Infinity, Infinity]]}
            minZoom={0.2}
            maxZoom={4}
            fitView
            fitViewOptions={{ padding: 0.22 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="#334155" />
            <MiniMap pannable zoomable nodeColor={(node) => String((node.data as { accent?: string }).accent ?? '#64748b')} />
            <Controls position="bottom-left" showInteractive={false} />
            <ViewportPortal>
              {guides.vertical.map((x) => <div className="alignment-guide alignment-guide--vertical" style={{ left: x }} key={`v-${x}`} />)}
              {guides.horizontal.map((y) => <div className="alignment-guide alignment-guide--horizontal" style={{ top: y }} key={`h-${y}`} />)}
            </ViewportPortal>
            <Panel position="top-right" className="canvas-hint">双击空白处添加文本节点 · 拖动画布浏览空间</Panel>
          </ReactFlow>

          {isMenuOpen && <div className="node-picker">
            <div className="node-picker__title">添加到画布 <button onClick={() => setIsMenuOpen(false)}>×</button></div>
            <div className="node-picker__grid">
              {nodeMenu.map((item) => <button key={item.type} onClick={() => addCreativeNode(item.type)}><span>{item.icon}</span>{item.label}</button>)}
            </div>
          </div>}
        </section>

      </div>

      <footer className="studio-statusbar"><span><i className="live-dot" /> 本地 Demo</span><span>{nodes.length} 个节点 · {edges.length} 条连接</span><span>100%</span><span className="statusbar-shortcuts">Space 平移 · Delete 删除 · ⌘ + D 复制</span></footer>
    </main>
  );
}

export default function App() {
  return <ReactFlowProvider><FlowCanvas /></ReactFlowProvider>;
}
