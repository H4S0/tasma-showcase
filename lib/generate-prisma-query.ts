import {
  JoinNodeData,
  ModelNodeData,
} from '@/components/react-flow/sidebar-flow';
import { Node, Edge } from '@xyflow/react';

export function generateQuery(
  node: Node<ModelNodeData>,
  nodes: Node[],
  edges: Edge[]
) {
  const { modelName, queryType, selectedFields, includeRelations } = node.data;

  const selectStr = selectedFields?.length
    ? `{ ${selectedFields.join(', ')} }`
    : undefined;

  const includes: Record<string, boolean> = {};

  edges.forEach((edge) => {
    const joinNode = nodes.find(
      (n) => n.id === edge.source && n.type === 'joinNode'
    ) as Node<JoinNodeData>;

    if (!joinNode) return;

    if (joinNode.data.fromModel === modelName) {
      includes[joinNode.data.toModel] = true;
    }

    if (joinNode.data.toModel === modelName) {
      includes[joinNode.data.fromModel] = true;
    }
  });

  const includeStr = Object.keys(includes).length
    ? `{ ${Object.keys(includes).join(': true, ')}: true }`
    : undefined;

  let query = `const result = await prisma.${modelName}.${queryType}({\n`;

  if (selectStr) query += `  select: ${selectStr},\n`;
  if (includeStr) query += `  include: ${includeStr},\n`;
  query += `});`;

  return query;
}
