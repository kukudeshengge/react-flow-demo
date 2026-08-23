import type { Edge, Node } from '@xyflow/react';

export type CreativeNodeType =
  | 'idea'
  | 'text'
  | 'script'
  | 'character'
  | 'scene'
  | 'storyboard'
  | 'image'
  | 'video'
  | 'audio'
  | 'generator';

export type CreativeNodeData = {
  title: string;
  description?: string;
  content?: string;
  prompt?: string;
  status?: 'idle' | 'generating' | 'success' | 'error';
  progress?: number;
  mediaType?: 'image' | 'video' | 'audio';
  tags?: string[];
  accent: string;
};

export type CreativeNode = Node<CreativeNodeData, CreativeNodeType>;
export type CreativeEdge = Edge<{ relation?: 'context' | 'reference' | 'result' }>;
