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
import { Input } from '@/components/ui/input';

export type ModelTabProps = {
  setNodes: (kind: NodeKind, options?: any) => void;
  models: Model;
};

type ModelOptions = {
  queryType: ModelNodeData['queryType'];
  selectedFields: string[];
  skip?: number;
  take?: number;
  orderBy?: { field: string; direction: 'asc' | 'desc' };
  isMainModel: boolean;
};

const ModelTab = ({ models, setNodes }: ModelTabProps) => {
  const modelNames = Object.keys(models) as (keyof typeof models)[];

  const [modelOptions, setModelOptions] = useState<
    Record<string, ModelOptions>
  >({});

  const updateModelOption = (model: string, update: Partial<ModelOptions>) => {
    setModelOptions((prev) => ({
      ...prev,
      [model]: {
        ...prev[model],
        queryType: prev[model]?.queryType || 'findMany',
        selectedFields: prev[model]?.selectedFields || [],
        ...update,
      },
    }));
  };

  const setMainModel = (model: string, update: Partial<ModelOptions>) => {
    setModelOptions((prev) => ({
      ...prev,
      [model]: {
        ...prev[model],
        isMainModel: prev[model]?.isMainModel || false,
        ...update,
      },
    }));
  };

  return (
    <TabsContent value="models" className="mt-5 space-y-3">
      {modelNames.map((model) => {
        const opts: ModelOptions = modelOptions[model] || {
          queryType: 'findMany',
          selectedFields: [],
        };

        const toggleField = (field: string) => {
          const current = opts.selectedFields || [];
          if (current.includes(field)) {
            updateModelOption(model, {
              selectedFields: current.filter((f) => f !== field),
            });
          } else {
            updateModelOption(model, {
              selectedFields: [...current, field],
            });
          }
        };

        const handleNumberChange = (key: 'skip' | 'take', value: string) => {
          const parsed = Number(value);
          updateModelOption(model, {
            [key]: !value || isNaN(parsed) || parsed < 0 ? undefined : parsed,
          });
        };

        return (
          <div key={model}>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full text-left px-3 py-2 font-medium rounded-md shadow">
                {model}
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-72">
                <div className="flex items-center justify-between">
                  <DropdownMenuLabel>{model} fields</DropdownMenuLabel>
                  <div className="flex items-center">
                    <Checkbox
                      checked={opts.isMainModel}
                      onCheckedChange={(value) => {
                        setMainModel(model, {
                          isMainModel: value === true,
                        });
                      }}
                    />
                    <DropdownMenuLabel>Main model</DropdownMenuLabel>
                  </div>
                </div>
                <DropdownMenuSeparator />

                {Object.entries(models[model]).map(([field, meta]) => (
                  <DropdownMenuItem
                    key={field}
                    className="flex justify-between items-center"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={opts.selectedFields?.includes(field)}
                        onCheckedChange={() => toggleField(field)}
                      />
                      <span>{field}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{meta.type}</span>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="flex flex-col gap-1 items-start"
                  onSelect={(e) => e.preventDefault()}
                >
                  <DropdownMenuLabel className="text-sm font-medium">
                    Query Type
                  </DropdownMenuLabel>
                  <div className="w-full" onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={opts.queryType}
                      onValueChange={(value) =>
                        updateModelOption(model, {
                          queryType: value as ModelNodeData['queryType'],
                        })
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
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="flex flex-col gap-2 items-start"
                  onSelect={(e) => e.preventDefault()}
                >
                  <DropdownMenuLabel className="text-sm font-medium">
                    Pagination
                  </DropdownMenuLabel>
                  <div
                    className="flex flex-col gap-2 w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      type="number"
                      min={0}
                      placeholder="Skip"
                      value={opts.skip ?? ''}
                      onChange={(e) =>
                        handleNumberChange('skip', e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      min={0}
                      placeholder="Take"
                      value={opts.take ?? ''}
                      onChange={(e) =>
                        handleNumberChange('take', e.target.value)
                      }
                    />
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="flex flex-col gap-2 items-start"
                  onSelect={(e) => e.preventDefault()}
                >
                  <DropdownMenuLabel className="text-sm font-medium">
                    Order By
                  </DropdownMenuLabel>
                  <div
                    className="flex flex-col gap-2 w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Select
                      value={opts.orderBy?.field || ''}
                      onValueChange={(value) =>
                        updateModelOption(model, {
                          orderBy: {
                            field: value,
                            direction: opts.orderBy?.direction || 'asc',
                          },
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(models[model]).map((field) => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={opts.orderBy?.direction || ''}
                      onValueChange={(value) =>
                        updateModelOption(model, {
                          orderBy: {
                            field: opts.orderBy?.field || '',
                            direction: value as 'asc' | 'desc',
                          },
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">asc</SelectItem>
                        <SelectItem value="desc">desc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-center font-semibold text-blue-600 cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                  onClick={() =>
                    setNodes('model', {
                      model,
                      queryType: opts.queryType,
                      selectedFields: opts.selectedFields,
                      includeRelations: [],
                      skip: opts.skip,
                      take: opts.take,
                      orderBy: opts.orderBy,
                      isMainModel: opts.isMainModel,
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
