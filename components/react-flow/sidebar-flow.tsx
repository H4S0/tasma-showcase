'use client';

import React, { useCallback } from 'react';

import { Node } from '@xyflow/react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Model } from './client-page/client-flow-page';

import ModelTab from './tabs/model-tab';
import OperatorTab from './tabs/operator-tab';
import ConditionTab from './tabs/condition-tab';
import JoinTab from './tabs/join-tab';
import { toast } from 'sonner';

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
  isMainModel: boolean;
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

type SidebarFlowProps = {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  models: Model;
};

const SidebarFlow = ({ setNodes, models }: SidebarFlowProps) => {
  const addNode = useCallback(
    (kind: NodeKind, options?: any) => {
      if (kind === 'model' && options?.isMainModel) {
        setNodes((currentNodes) => {
          const mainModelExists = currentNodes.some(
            (n) =>
              n.type === 'modelNode' &&
              (n.data as ModelNodeData).isMainModel === true
          );
          if (mainModelExists) {
            toast.error('You can only have one main model!');
            return currentNodes;
          }
          return [...currentNodes, createModelNode(options)];
        });
        return;
      }

      setNodes((currentNodes) => {
        switch (kind) {
          case 'model':
            return [...currentNodes, createModelNode(options)];
          case 'operator':
            return [...currentNodes, createOperatorNode(options)];
          case 'join':
            return [...currentNodes, createJoinNode(options)];
          case 'condition':
            return [...currentNodes, createConditionNode(options)];
          default:
            return currentNodes;
        }
      });
    },
    [models, setNodes]
  );

  const createModelNode = (options: any): Node<ModelNodeData> => {
    const model = options.model as string;
    const fields = Object.entries(models[model]).map(([name, meta]) => ({
      name,
      type: meta.type,
    }));

    return {
      id: `model-${Date.now()}`,
      type: 'modelNode',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: {
        label: model,
        modelName: model,
        queryType: options.queryType || 'findMany',
        selectedFields: options.selectedFields || [],
        includeRelations: options.includeRelations || [],
        cursor: options.cursor || '',
        skip: options.skip ?? 0,
        take: options.take ?? 0,
        orderBy: options.orderBy || { field: '', direction: 'asc' },
        isMainModel: options.isMainModel ?? false,
        fields,
      },
    };
  };

  const createOperatorNode = (options: any): Node<OperationNodeData> => ({
    id: `operator-${Date.now()}`,
    type: 'operatorNode',
    position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
    data: { label: options.operator, operator: options.operator },
  });

  const createJoinNode = (options: any): Node<JoinNodeData> => ({
    id: `join-${Date.now()}`,
    type: 'joinNode',
    position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
    data: {
      label: `${options.fromModel}.${options.fromField} → ${options.toModel}.${options.toField}`,
      fromModel: options.fromModel,
      fromField: options.fromField,
      toModel: options.toModel,
      toField: options.toField,
    },
  });

  const createConditionNode = (options: any): Node<ConditionNodeData> => ({
    id: `condition-${Date.now()}`,
    type: 'conditionNode',
    position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
    data: {
      label: `${options.field} ${options.comparator} ${options.value}`,
      field: options.field,
      comparator: options.comparator,
      value: options.value,
    },
  });

  return (
    <aside className="w-72 bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid grid-cols-4 gap-1 mb-4">
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
