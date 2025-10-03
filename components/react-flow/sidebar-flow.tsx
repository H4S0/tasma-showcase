'use client';

import React, { useCallback } from 'react';

import { Node } from '@xyflow/react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Model } from './client-page/client-flow-page';

import ModelTab from './tabs/model-tab';
import OperatorTab from './tabs/operator-tab';
import ConditionTab from './tabs/condition-tab';
import JoinTab from './tabs/join-tab';

export type NodeKind = 'model' | 'operator' | 'join' | 'condition';

interface BaseNodeData extends Record<string, unknown> {
  label: string;
}

export interface ModelNodeData extends BaseNodeData {
  modelName: string;
  fields: { name: string; type: string }[];
  queryType: 'findMany' | 'findUnique' | 'findFirst';
  selectedFields?: string[];
  includeRelations?: string[];
  skip?: number;
  take?: number;
  cursor?: string;
  orderBy: { field: string; direction: 'asc' | 'desc' };
}

interface OperationNodeData extends BaseNodeData {
  operator: 'AND' | 'OR';
}

export interface JoinNodeData extends BaseNodeData {
  fromModel: string;
  fromField: string;
  toModel: string;
  toField: string;
}

export interface ConditionNodeData extends BaseNodeData {
  field: string;
  comparator: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'IN' | 'NOT IN';
  value: string | number;
}

type FlowNodeData =
  | ModelNodeData
  | OperationNodeData
  | JoinNodeData
  | ConditionNodeData;

type SidebarFlowProps = {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  models: Model;
};

const SidebarFlow = ({ setNodes, models }: SidebarFlowProps) => {
  const addNode = useCallback(
    (kind: NodeKind, options?: any) => {
      let data: FlowNodeData;

      switch (kind) {
        case 'model': {
          const model = options.model as string;
          const fields = Object.entries(models[model]).map(([name, meta]) => ({
            name,
            type: meta.type,
          }));
          data = {
            label: model,
            modelName: model,
            queryType: options.queryType || 'findMany',
            selectedFields: options.selectedFields || [],
            includeRelations: options.includeRelations || [],
            cursor: options.cursor || '',
            skip: options.skip || 0,
            take: options.skip || 0,
            orderBy: options.orderBy || 'desc',
            fields,
          };
          break;
        }

        case 'operator': {
          data = {
            label: options.operator,
            operator: options.operator,
          };
          break;
        }

        case 'join': {
          data = {
            label: `${options.fromModel}.${options.fromField} → ${options.toModel}.${options.toField}`,
            fromModel: options.fromModel,
            fromField: options.fromField,
            toModel: options.toModel,
            toField: options.toField,
          };
          break;
        }

        case 'condition': {
          data = {
            label: `${options.field} ${options.comparator} ${options.value}`,
            field: options.field,
            comparator: options.comparator,
            value: options.value,
          };
          break;
        }

        default:
          throw new Error('Unknown node kind');
      }

      const newNode: Node = {
        id: `${kind}-${Date.now()}`,
        type: `${kind}Node`,
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
        data,
      };

      setNodes((n) => [...n, newNode]);
    },
    [models, setNodes]
  );

  return (
    <aside className="w-72 bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid grid-cols-3 gap-1 mb-4">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="operators">Operator</TabsTrigger>
          <TabsTrigger value="join">Join</TabsTrigger>
          <TabsTrigger value="condition">Condition</TabsTrigger>
        </TabsList>

        <ModelTab models={models} setNodes={addNode} />
        <OperatorTab setNodes={addNode} />
        <JoinTab setNodes={addNode} models={models} />
        <ConditionTab models={models} setNodes={addNode} />
      </Tabs>
    </aside>
  );
};

export default SidebarFlow;
