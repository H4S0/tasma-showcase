'use client';

import React, { useCallback, useState } from 'react';
import FlowCanvas from '../react-flow';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Node } from '@xyflow/react';

type ClientFlowPageProps = {
  models: Record<
    string,
    Record<
      string,
      {
        type: string;
        value: null;
      }
    >
  >;
};

const ClientFlowPage = ({ models }: ClientFlowPageProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);

  const addNode = useCallback(
    (model: string) => {
      const fields = Object.entries(models[model]).map(([name, meta]) => ({
        name,
        type: meta.type,
      }));

      const newNode = {
        id: `${model}-${Date.now()}`,
        type: 'modelNode',
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
        data: {
          modelName: model,
          fields,
        },
      };

      setNodes((n) => [...n, newNode]);
    },
    [models]
  );

  const modelNames = Object.keys(models) as (keyof typeof models)[];

  return (
    <div className="flex h-screen">
      <aside className="w-72 bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Prisma Models</h2>
        <ul className="space-y-4">
          {modelNames.map((model) => (
            <li key={model} onClick={() => addNode(model)}>
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
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-6">
        <FlowCanvas nodes={nodes} setNodes={setNodes} />
      </main>
    </div>
  );
};

export default ClientFlowPage;
