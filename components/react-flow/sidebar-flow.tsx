'use client';

import React, { useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Node } from '@xyflow/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Model } from './client-page/client-flow-page';

type NodeKind = 'model' | 'operation' | 'join' | 'condition';

interface BaseNodeData extends Record<string, unknown> {
  label: string;
}

interface ModelNodeData extends BaseNodeData {
  modelName: string;
  fields: { name: string; type: string }[];
}

interface OperationNodeData extends BaseNodeData {
  operator: 'AND' | 'OR';
}

interface JoinNodeData extends BaseNodeData {
  from: string;
  to: string;
}

interface ConditionNodeData extends BaseNodeData {
  field: string;
  comparator: '=' | '!=' | '>' | '<';
  value: string | number;
}

type FlowNodeData =
  | ModelNodeData
  | OperationNodeData
  | JoinNodeData
  | ConditionNodeData;

const SidebarFlow = ({
  setNodes,
  models,
}: {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  models: Model;
}) => {
  const addNode = useCallback(
    (kind: NodeKind, options?: any) => {
      let data: FlowNodeData;

      switch (kind) {
        case 'model':
          const model = options.model as string;
          const fields = Object.entries(models[model]).map(([name, meta]) => ({
            name,
            type: meta.type,
          }));
          data = {
            label: model,
            modelName: model,
            fields,
          };
          break;

        case 'operation':
          data = {
            label: options.operator,
            operator: options.operator,
          };
          break;

        case 'join':
          data = {
            label: 'Join',
            from: options.from,
            to: options.to,
          };
          break;

        case 'condition':
          data = {
            label: `${options.field} ${options.comparator} ${options.value}`,
            field: options.field,
            comparator: options.comparator,
            value: options.value,
          };
          break;

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

  const modelNames = Object.keys(models) as (keyof typeof models)[];

  return (
    <aside className="w-72 bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid grid-cols-3 gap-1 mb-4">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="operators">Operator</TabsTrigger>
          <TabsTrigger value="join">Join</TabsTrigger>
          <TabsTrigger value="field-relation">Relation</TabsTrigger>
          <TabsTrigger value="condition">Condition</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="mt-5">
          <ul className="space-y-4">
            {modelNames.map((model) => (
              <li key={model}>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full text-left px-3 py-2 font-medium rounded-md shadow">
                    {model}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64">
                    <DropdownMenuLabel>{model} fields</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {Object.entries(models[model]).map(([field, meta]) => (
                      <DropdownMenuItem
                        key={field}
                        className="flex justify-between"
                      >
                        <span>{field}</span>
                        <span className="text-gray-500 text-sm">
                          {meta.type}
                        </span>
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-center font-semibold text-blue-600 cursor-pointer"
                      onClick={() => addNode('model', { model })}
                    >
                      + Add Node
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="operators" className="mt-5">
          <li onClick={() => addNode('operation', { operator: 'AND' })}>and</li>
          <li onClick={() => addNode('operation', { operator: 'OR' })}>or</li>
        </TabsContent>

        <TabsContent value="join" className="mt-5">
          <p className="text-gray-600">Set up joins between models here.</p>
        </TabsContent>

        <TabsContent value="field-relation" className="mt-5">
          <p className="text-gray-600">Configure field relations here.</p>
        </TabsContent>

        <TabsContent value="condition" className="mt-5">
          <p className="text-gray-600">Add conditions/filters here.</p>
        </TabsContent>
      </Tabs>
    </aside>
  );
};

export default SidebarFlow;
