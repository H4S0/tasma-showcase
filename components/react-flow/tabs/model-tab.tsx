import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TabsContent } from '@/components/ui/tabs';
import React, { useState } from 'react';
import { NodeKind, ModelNodeData } from '../sidebar-flow';
import { Model } from '../client-page/client-flow-page';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export type ModelTabProps = {
  setNodes: (kind: NodeKind, options?: any) => void;
  models: Model;
};

const ModelTab = ({ models, setNodes }: ModelTabProps) => {
  const modelNames = Object.keys(models) as (keyof typeof models)[];
  const [selectedQueryTypes, setSelectedQueryTypes] = useState<
    Record<string, ModelNodeData['queryType']>
  >({});
  const [selectedFieldsMap, setSelectedFieldsMap] = useState<
    Record<string, string[]>
  >({});

  return (
    <TabsContent value="models" className="mt-5 space-y-3">
      {modelNames.map((model) => {
        const queryType = selectedQueryTypes[model] || 'findMany';
        const selectedFields = selectedFieldsMap[model] || [];

        const toggleField = (field: string) => {
          setSelectedFieldsMap((prev) => {
            const current = prev[model] || [];
            if (current.includes(field)) {
              return { ...prev, [model]: current.filter((f) => f !== field) };
            } else {
              return { ...prev, [model]: [...current, field] };
            }
          });
        };

        return (
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
                    className="flex justify-between items-center"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selectedFields.includes(field)}
                        onCheckedChange={() => toggleField(field)}
                      />
                      <span>{field}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{meta.type}</span>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex flex-col gap-1 items-start">
                  <DropdownMenuLabel className="text-sm font-medium">
                    Query Type:
                  </DropdownMenuLabel>
                  <Select
                    value={queryType}
                    onValueChange={(value) =>
                      setSelectedQueryTypes((prev) => ({
                        ...prev,
                        [model]: value as ModelNodeData['queryType'],
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Query type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="findMany">findMany</SelectItem>
                      <SelectItem value="findUnique">findUnique</SelectItem>
                      <SelectItem value="findFirst">findFirst</SelectItem>
                    </SelectContent>
                  </Select>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-center font-semibold text-blue-600 cursor-pointer"
                  onClick={() =>
                    setNodes('model', {
                      model,
                      queryType,
                      selectedFields,
                      includeRelations: [],
                    })
                  }
                >
                  + Add Node
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </TabsContent>
  );
};

export default ModelTab;
