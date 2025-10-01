import {
  ConditionNodeData,
  ModelNodeData,
} from '@/components/react-flow/sidebar-flow';
import { Node, Edge } from '@xyflow/react';

export function generateQuery(
  modelNode: Node<ModelNodeData>,
  allNodes: Node[],
  allEdges: Edge[]
) {
  const conditions = allEdges
    .filter((edge) => edge.target === modelNode.id)
    .map((edge) => allNodes.find((n) => n.id === edge.source))
    .filter(
      (n): n is Node<ConditionNodeData> => !!n && n.type === 'conditionNode'
    );

  const where: Record<string, any> = {};

  conditions.forEach((cond) => {
    where[cond.data.field] = cond.data.value;
  });

  const select: Record<string, boolean> = {};
  modelNode.data.selectedFields?.forEach((field) => {
    select[field] = true;
  });

  return `const result = await prisma.${modelNode.data.modelName}.findMany({
  ${
    Object.keys(where).length
      ? 'where: ' + JSON.stringify(where, null, 2) + ','
      : ''
  }
  select: ${JSON.stringify(select, null, 2)}
});`;
}
