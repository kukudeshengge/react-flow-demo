import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CreativeNode as CreativeNodeModel } from '../canvasTypes';

const nodeMeta = {
  idea: { label: '灵感', icon: '✦' },
  text: { label: '文本', icon: 'T' },
  script: { label: '剧本', icon: '☷' },
  character: { label: '角色', icon: '◉' },
  scene: { label: '场景', icon: '▧' },
  storyboard: { label: '分镜', icon: '▦' },
  image: { label: '图片', icon: '▣' },
  video: { label: '视频', icon: '▶' },
  audio: { label: '音频', icon: '♫' },
  generator: { label: '生成器', icon: '✧' },
} as const;

export function CreativeNode({ id, type = 'text', data, selected }: NodeProps<CreativeNodeModel>) {
  const meta = nodeMeta[type];
  const isMedia = data.mediaType || ['character', 'scene', 'storyboard', 'image', 'video'].includes(type);

  return (
    <article className={`creative-node creative-node--${type} ${selected ? 'is-selected' : ''}`} style={{ '--node-accent': data.accent } as React.CSSProperties}>
      <Handle className="creative-handle" type="target" position={Position.Left} />
      <header className="creative-node__header">
        <span className="creative-node__icon">{meta.icon}</span>
        <span className="creative-node__type">{meta.label}</span>
        <button className="node-more nodrag nopan" aria-label="更多操作">···</button>
      </header>

      {isMedia && <div className={`creative-node__preview preview--${type}`}><span>{type === 'video' ? '▶' : type === 'image' ? '✦' : '画面预览'}</span></div>}

      <div className="creative-node__body">
        <h3>{data.title}</h3>
        {data.description && <p>{data.description}</p>}
        {data.content && <div className="creative-node__content">{data.content}</div>}
        {data.prompt && <div className="creative-node__prompt">“{data.prompt}”</div>}
      </div>

      <footer className="creative-node__footer">
        {data.tags?.map((tag) => <span key={tag}>{tag}</span>)}
        {data.status === 'generating' && <span className="node-status">生成中 {data.progress ?? 0}%</span>}
        {data.status === 'success' && <span className="node-status is-success">已完成</span>}
      </footer>
      {data.status === 'generating' && <div className="node-progress"><i style={{ width: `${data.progress ?? 0}%` }} /></div>}
      <Handle className="creative-handle" type="source" position={Position.Right} />
      <span className="creative-node__id">{id.slice(0, 6)}</span>
    </article>
  );
}
