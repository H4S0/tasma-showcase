import {
  FunctionKeys,
  OperationArgs,
  PrismaQueryConfig,
} from '@/app/lib/types';
import {
  ConditionNodeData,
  ModelNodeData,
} from '@/components/react-flow/sidebar-flow';
import { PrismaClient } from '@prisma/client';
import { Node, Edge } from '@xyflow/react';

function objectToCode(obj: Record<string, any>, indent = 2): string {
  const pad = ' '.repeat(indent);
  return (
    '{\n' +
    Object.entries(obj)
      .map(([key, val]) => {
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          return `${pad}${key}: ${objectToCode(val, indent + 2)}`;
        } else if (Array.isArray(val)) {
          return `${pad}${key}: [${val
            .map((v) => JSON.stringify(v))
            .join(', ')}]`;
        } else {
          return `${pad}${key}: ${JSON.stringify(val)}`;
        }
      })
      .join(',\n') +
    '\n' +
    ' '.repeat(indent - 2) +
    '}'
  );
}

export function generateQuery<
  TModel extends keyof PrismaClient,
  TOperation extends FunctionKeys<PrismaClient[TModel]>,
  TArgs = OperationArgs<PrismaClient[TModel], TOperation>
>(
  modelNode: Node<ModelNodeData>,
  allNodes: Node[],
  allEdges: Edge[]
): {
  queryOpts: PrismaQueryConfig<TModel, TOperation, TArgs>;
  queryOptsString: string;
} {
  const conditions = allEdges
    .filter((edge) => edge.target === modelNode.id)
    .map((edge) => allNodes.find((n) => n.id === edge.source))
    .filter(
      (n): n is Node<ConditionNodeData> => !!n && n.type === 'conditionNode'
    );

  const where: Record<string, any> = {};
  conditions.forEach((cond) => {
    const { field, comparator, value } = cond.data;
    const cleanField = field.includes('.') ? field.split('.')[1] : field;

    switch (comparator) {
      case '=':
        where[cleanField] = value;
        break;
      case '!=':
        where[cleanField] = { not: value };
        break;
      case '>':
        where[cleanField] = { gt: value };
        break;
      case '>=':
        where[cleanField] = { gte: value };
        break;
      case '<':
        where[cleanField] = { lt: value };
        break;
      case '<=':
        where[cleanField] = { lte: value };
        break;
      case 'IN':
        where[cleanField] = { in: Array.isArray(value) ? value : [value] };
        break;
      case 'NOT IN':
        where[cleanField] = { notIn: Array.isArray(value) ? value : [value] };
        break;
    }
  });

  const select: Record<string, boolean> = {};
  modelNode.data.selectedFields?.forEach((field) => {
    select[field] = true;
  });

  const include: Record<string, boolean> = {};
  modelNode.data.includeRelations?.forEach((rel) => {
    include[rel] = true;
  });

  const args: Record<string, any> = {};
  if (Object.keys(where).length > 0) args.where = where;
  if (Object.keys(select).length > 0) args.select = select;
  if (Object.keys(include).length > 0) args.include = include;

  const queryOpts: PrismaQueryConfig<TModel, TOperation, TArgs> = {
    model: modelNode.data.modelName as TModel,
    operation: modelNode.data.queryType as TOperation,
    ...(Object.keys(args).length > 0 ? { args: args as TArgs } : {}),
  };

  const argsString =
    Object.keys(args).length > 0 ? `,\n  args: ${objectToCode(args, 4)}` : '';

  const queryOptsString = `const queryOpts = prismaQueryOptions({
  model: "${modelNode.data.modelName.toLowerCase()}",
  operation: "${modelNode.data.queryType}"${argsString}
})`;

  return { queryOpts, queryOptsString };
}
