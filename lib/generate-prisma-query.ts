import {
  FunctionKeys,
  OperationArgs,
  PrismaQueryConfig,
} from '@/app/lib/types';
import {
  ConditionNodeData,
  ModelNodeData,
  JoinNodeData,
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
  queryOpts: PrismaQueryConfig<TModel, TOperation, TArgs> | null;
  queryOptsString: string | null;
} {
  if (!modelNode.data.isMainModel) {
    return { queryOpts: null, queryOptsString: null };
  }

  const getChildren = (nodeId: string) =>
    allEdges
      .filter((edge) => edge.target === nodeId)
      .map((edge) => allNodes.find((n) => n.id === edge.source))
      .filter(Boolean) as Node[];

  const buildWhere = (node: Node): Record<string, any> => {
    if (node.type === 'conditionNode') {
      const { field, comparator, value } = node.data as ConditionNodeData;
      const cleanField = field.includes('.') ? field.split('.')[1] : field;

      switch (comparator) {
        case '=':
          return { [cleanField]: value };
        case '!=':
          return { [cleanField]: { not: value } };
        case '>':
          return { [cleanField]: { gt: value } };
        case '>=':
          return { [cleanField]: { gte: value } };
        case '<':
          return { [cleanField]: { lt: value } };
        case '<=':
          return { [cleanField]: { lte: value } };
        case 'IN':
          return {
            [cleanField]: { in: Array.isArray(value) ? value : [value] },
          };
        case 'NOT IN':
          return {
            [cleanField]: { notIn: Array.isArray(value) ? value : [value] },
          };
        default:
          return {};
      }
    }

    if (node.type === 'operatorNode') {
      const children = getChildren(node.id).map(buildWhere);
      const op = (node.data as any).operator;
      return { [op]: children };
    }

    return {};
  };

  const whereNodes = getChildren(modelNode.id);
  const where = whereNodes.reduce((acc, n) => {
    return { ...acc, ...buildWhere(n) };
  }, {});

  const joins = allEdges
    .filter(
      (edge) =>
        edge.source === modelNode.id &&
        allNodes.find((n) => n.id === edge.target)?.type === 'joinNode'
    )
    .map(
      (edge) => allNodes.find((n) => n.id === edge.target) as Node<JoinNodeData>
    );

  const include: Record<string, boolean> = {};
  joins.forEach((join) => {
    include[join.data.toModel.toLowerCase()] = true;
  });

  modelNode.data.includeRelations?.forEach((rel) => {
    include[rel] = true;
  });

  const select: Record<string, boolean> = {};
  modelNode.data.selectedFields?.forEach((f) => (select[f] = true));

  const args: Record<string, any> = {};
  if (Object.keys(where).length > 0) args.where = where;
  if (Object.keys(select).length > 0) args.select = select;
  if (Object.keys(include).length > 0) args.include = include;

  if (typeof modelNode.data.skip === 'number' && modelNode.data.skip > 0)
    args.skip = modelNode.data.skip;
  if (typeof modelNode.data.take === 'number' && modelNode.data.take > 0)
    args.take = modelNode.data.take;

  if (modelNode.data.orderBy?.field) {
    args.orderBy = {
      [modelNode.data.orderBy.field]: modelNode.data.orderBy.direction,
    };
  }

  if (modelNode.data.cursor) {
    args.cursor = { id: modelNode.data.cursor };
  }

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
