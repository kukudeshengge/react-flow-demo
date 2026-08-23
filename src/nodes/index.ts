import type { NodeTypes } from '@xyflow/react';
import { CreativeNode } from './CreativeNode';

export const nodeTypes = {
  idea: CreativeNode,
  text: CreativeNode,
  script: CreativeNode,
  character: CreativeNode,
  scene: CreativeNode,
  storyboard: CreativeNode,
  image: CreativeNode,
  video: CreativeNode,
  audio: CreativeNode,
  generator: CreativeNode,
} satisfies NodeTypes;
