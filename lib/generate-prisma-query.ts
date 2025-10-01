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
    const { field, comparator, value } = cond.data;
    switch (comparator) {
      case '=':
        where[field] = value;
        break;
      case '!=':
        where[field] = { not: value };
        break;
      case '>':
        where[field] = { gt: value };
        break;
      case '>=':
        where[field] = { gte: value };
        break;
      case '<':
        where[field] = { lt: value };
        break;
      case '<=':
        where[field] = { lte: value };
        break;
      case 'IN':
        where[field] = { in: Array.isArray(value) ? value : [value] };
        break;
      case 'NOT IN':
        where[field] = { notIn: Array.isArray(value) ? value : [value] };
        break;
    }
  });

  const select: Record<string, boolean> = {};
  modelNode.data.selectedFields?.forEach((field) => {
    select[field] = true;
  });

  const selectString = Object.entries(select)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  const include: Record<string, boolean> = {};
  modelNode.data.includeRelations?.forEach((rel) => {
    include[rel] = true;
  });

  const whereString =
    Object.keys(where).length > 0
      ? 'where: {\n' +
        Object.entries(where)
          .map(([key, value]) => {
            console.log(key);
            return `${key}: ${JSON.stringify(value)}`;
          })
          .join(',\n') +
        '},'
      : '';

  const includeString =
    Object.keys(include).length > 0
      ? 'include: { ' + Object.keys(include).join(': true, ') + ': true }'
      : '';

  return `const result = await prisma.${modelNode.data.modelName}.findMany({
  ${whereString}
  select: { ${selectString} }${includeString ? ', ' + includeString : ''}
});`;
}
