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

  const selectString = Object.entries(select)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  const whereString =
    Object.keys(where).length > 0
      ? 'where: {\n' +
        Object.entries(where)
          .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
          .join(',\n') +
        '},'
      : '';

  return `const result = await prisma.${modelNode.data.modelName}.findMany({
  ${whereString}
  select: { ${selectString} }
});`;
}
