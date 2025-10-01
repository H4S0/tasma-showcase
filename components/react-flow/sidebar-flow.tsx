'use client';

import React, { useCallback, useState } from 'react';
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
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';

type NodeKind = 'model' | 'operator' | 'join' | 'condition';

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
  fromModel: string;
  fromField: string;
  toModel: string;
  toField: string;
}

interface ConditionNodeData extends BaseNodeData {
  field: string;
  comparator: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'IN' | 'NOT IN';
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
  const [fromModel, setFromModel] = useState('');
  const [fromField, setFromField] = useState('');
  const [toModel, setToModel] = useState('');
  const [toField, setToField] = useState('');

  const [conditionField, setConditionField] = useState('');
  const [comparator, setComparator] = useState('');
  const [conditionValue, setConditionValue] = useState('');

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

  const modelNames = Object.keys(models) as (keyof typeof models)[];

  const comparators: ConditionNodeData['comparator'][] = [
    '=',
    '!=',
    '>',
    '>=',
    '<',
    '<=',
    'IN',
    'NOT IN',
  ];

  return (
    <aside className="w-72 bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid grid-cols-3 gap-1 mb-4">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="operators">Operator</TabsTrigger>
          <TabsTrigger value="join">Join</TabsTrigger>
          <TabsTrigger value="condition">Condition</TabsTrigger>
        </TabsList>

        {/* MODELS */}
        <TabsContent value="models" className="mt-5 space-y-3">
          {modelNames.map((model) => (
            <div key={model}>
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
                      <span className="text-gray-500 text-sm">{meta.type}</span>
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
            </div>
          ))}
        </TabsContent>

        {/* OPERATORS */}
        <TabsContent value="operators" className="mt-5 space-y-3">
          <div
            onClick={() => addNode('operator', { operator: 'AND' })}
            className="w-full text-left px-3 py-2 font-medium rounded-md shadow cursor-pointer"
          >
            AND
          </div>
          <div
            onClick={() => addNode('operator', { operator: 'OR' })}
            className="w-full text-left px-3 py-2 font-medium rounded-md shadow cursor-pointer"
          >
            OR
          </div>
        </TabsContent>

        <TabsContent value="join" className="mt-5 space-y-3">
          <p className="text-gray-600 mb-2">Build a join:</p>

          <Select
            value={fromModel}
            onValueChange={(val) => {
              setFromModel(val);
              setFromField('');
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="From Model" />
            </SelectTrigger>
            <SelectContent>
              {modelNames.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {fromModel && (
            <Select value={fromField} onValueChange={setFromField}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="From Field" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(models[fromModel]).map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select
            value={toModel}
            onValueChange={(val) => {
              setToModel(val);
              setToField('');
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="To Model" />
            </SelectTrigger>
            <SelectContent>
              {modelNames.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {toModel && (
            <Select value={toField} onValueChange={setToField}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="To Field" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(models[toModel]).map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            className="w-full mt-2"
            disabled={!fromModel || !fromField || !toModel || !toField}
            onClick={() =>
              addNode('join', {
                fromModel,
                fromField,
                toModel,
                toField,
              })
            }
          >
            + Add Join
          </Button>
        </TabsContent>

        <TabsContent value="condition" className="mt-5 space-y-3">
          <p className="text-gray-600 mb-2">Build a condition:</p>

          <Select value={conditionField} onValueChange={setConditionField}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Field" />
            </SelectTrigger>
            <SelectContent>
              {modelNames.flatMap((model) =>
                Object.keys(models[model]).map((field) => (
                  <SelectItem
                    key={`${model}.${field}`}
                    value={`${model}.${field}`}
                  >
                    {model}.{field}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Select value={comparator} onValueChange={setComparator}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Comparator" />
            </SelectTrigger>
            <SelectContent>
              {comparators.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Value"
            value={conditionValue}
            onChange={(e) => setConditionValue(e.target.value)}
          />

          <Button
            className="w-full mt-2"
            disabled={!conditionField || !comparator || !conditionValue}
            onClick={() =>
              addNode('condition', {
                field: conditionField,
                comparator,
                value: conditionValue,
              })
            }
          >
            + Add Condition
          </Button>
        </TabsContent>
      </Tabs>
    </aside>
  );
};

export default SidebarFlow;
