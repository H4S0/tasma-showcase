import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TabsContent } from '@/components/ui/tabs';
import React from 'react';
import { NodeKind } from '../sidebar-flow';
import { Model } from '../client-page/client-flow-page';

export type ModelTabProps = {
  setNodes: (kind: NodeKind, options?: any) => void;
  models: Model;
};

const ModelTab = ({ models, setNodes }: ModelTabProps) => {
  const modelNames = Object.keys(models) as (keyof typeof models)[];

  return (
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
                <DropdownMenuItem key={field} className="flex justify-between">
                  <span>{field}</span>
                  <span className="text-gray-500 text-sm">{meta.type}</span>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-center font-semibold text-blue-600 cursor-pointer"
                onClick={() => setNodes('model', { model })}
              >
                + Add Node
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </TabsContent>
  );
};

export default ModelTab;
