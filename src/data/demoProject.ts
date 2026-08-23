import type { CreativeEdge, CreativeNode } from '../canvasTypes';

export const initialNodes: CreativeNode[] = [
  {
    id: 'idea-1',
    type: 'idea',
    position: { x: 40, y: 80 },
    data: {
      title: '一场关于月亮的旅行',
      description: '一个女孩在城市屋顶发现通往月球的秘密入口。',
      tags: ['奇幻', '短片'],
      accent: '#f4b740',
    },
  },
  {
    id: 'character-1',
    type: 'character',
    position: { x: 320, y: 30 },
    data: {
      title: '角色设定 · 林夏',
      description: '17 岁，短发，背着旧相机，勇敢又好奇。',
      content: '角色三视图与性格设定',
      tags: ['角色', '主角'],
      accent: '#e879f9',
    },
  },
  {
    id: 'scene-1',
    type: 'scene',
    position: { x: 320, y: 270 },
    data: {
      title: '场景设定 · 城市屋顶',
      description: '雨后的夜晚，霓虹灯映在积水中，远处是月亮。',
      content: '城市 / 夜晚 / 雨后',
      tags: ['场景', '夜景'],
      accent: '#60a5fa',
    },
  },
  {
    id: 'script-1',
    type: 'script',
    position: { x: 40, y: 360 },
    data: {
      title: '剧本大纲',
      description: '林夏在屋顶追逐月光，打开一扇只在午夜出现的门。',
      content: '第一幕：发现\n第二幕：进入\n第三幕：回到地球',
      accent: '#a78bfa',
    },
  },
  {
    id: 'storyboard-1',
    type: 'storyboard',
    position: { x: 680, y: 150 },
    data: {
      title: '分镜 01 · 屋顶月光',
      description: '广角，镜头从城市上空缓慢推向屋顶。',
      content: '16:9  ·  电影写实  ·  05 秒',
      tags: ['镜头 01'],
      accent: '#34d399',
    },
  },
  {
    id: 'generator-1',
    type: 'generator',
    position: { x: 1030, y: 150 },
    data: {
      title: '生成视频',
      description: '将上游的角色、场景和分镜合成为视频。',
      prompt: '电影感的月球入口，镜头缓慢推进',
      status: 'idle',
      accent: '#fb7185',
    },
  },
];

export const initialEdges: CreativeEdge[] = [
  { id: 'idea-script', source: 'idea-1', target: 'script-1', type: 'smoothstep', data: { relation: 'context' } },
  { id: 'character-storyboard', source: 'character-1', target: 'storyboard-1', type: 'smoothstep', data: { relation: 'reference' } },
  { id: 'scene-storyboard', source: 'scene-1', target: 'storyboard-1', type: 'smoothstep', data: { relation: 'reference' } },
  { id: 'script-storyboard', source: 'script-1', target: 'storyboard-1', type: 'smoothstep', data: { relation: 'context' } },
  { id: 'storyboard-generator', source: 'storyboard-1', target: 'generator-1', type: 'smoothstep', data: { relation: 'result' } },
];
