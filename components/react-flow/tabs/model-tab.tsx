'use client';

import React, { useState } from 'react';
import { ModelNodeData, AddNodeFn } from '../sidebar-flow';
import { Model } from '../client-page/client-flow-page';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export type ModelTabProps = {
  setNodes: AddNodeFn;
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

const FieldsList = ({
  model,
  fields,
  selectedFields,
  toggleField,
}: {
  model: string;
  fields: Record<string, { type: string }>;
  selectedFields: string[];
  toggleField: (field: string) => void;
}) => (
  <>
    <DropdownMenuLabel>{model} fields</DropdownMenuLabel>
    {Object.entries(fields).map(([field, meta]) => (
      <DropdownMenuItem
        key={field}
        className="flex justify-between items-center px-3 py-2"
        onSelect={(e) => e.preventDefault()}
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
  </>
);

const QueryTypeSelect = ({
  value,
  onChange,
}: {
  value: ModelNodeData['queryType'];
  onChange: (v: ModelNodeData['queryType']) => void;
}) => (
  <div className="w-full">
    <Select value={value} onValueChange={(v) => onChange(v as any)}>
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
);

const PaginationInputs = ({
  skip,
  take,
  onChange,
}: {
  skip?: number;
  take?: number;
  onChange: (key: 'skip' | 'take', v: number | undefined) => void;
}) => (
  <div className="flex flex-col gap-2 w-full">
    <Input
      type="number"
      min={0}
      placeholder="Skip"
      value={skip ?? ''}
      onChange={(e) => {
        const parsed = Number(e.target.value);
        onChange('skip', isNaN(parsed) ? undefined : parsed);
      }}
    />
    <Input
      type="number"
      min={0}
      placeholder="Take"
      value={take ?? ''}
      onChange={(e) => {
        const parsed = Number(e.target.value);
        onChange('take', isNaN(parsed) ? undefined : parsed);
      }}
    />
  </div>
);

const OrderBySelect = ({
  modelFields,
  orderBy,
  onChange,
}: {
  modelFields: string[];
  orderBy?: { field: string; direction: 'asc' | 'desc' };
  onChange: (o: { field: string; direction: 'asc' | 'desc' }) => void;
}) => (
  <div className="flex flex-col gap-2 w-full">
    <Select
      value={orderBy?.field || ''}
      onValueChange={(v) =>
        onChange({ field: v, direction: orderBy?.direction || 'asc' })
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Field" />
      </SelectTrigger>
      <SelectContent>
        {modelFields.map((field) => (
          <SelectItem key={field} value={field}>
            {field}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select
      value={orderBy?.direction || ''}
      onValueChange={(v) =>
        onChange({
          field: orderBy?.field || '',
          direction: v as 'asc' | 'desc',
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
);

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
        isMainModel: prev[model]?.isMainModel || false,
        ...update,
      },
    }));
  };

  return (
    <TabsContent value="models" className="mt-5 space-y-3">
      {modelNames.map((model) => {
        const opts = modelOptions[model] || {
          queryType: 'findMany',
          selectedFields: [],
          isMainModel: false,
        };

        const toggleField = (field: string) => {
          const current = opts.selectedFields || [];
          updateModelOption(model, {
            selectedFields: current.includes(field)
              ? current.filter((f) => f !== field)
              : [...current, field],
          });
        };

        return (
          <div key={model}>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full text-left px-4 py-3 font-semibold rounded-md shadow bg-white hover:bg-gray-50">
                {model}
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-70 p-2">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="font-medium">{model} config</span>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={opts.isMainModel}
                      onCheckedChange={(v) =>
                        updateModelOption(model, { isMainModel: v === true })
                      }
                    />
                    <span className="text-sm">Main model</span>
                  </div>
                </div>

                <DropdownMenuSeparator />

                <FieldsList
                  model={model}
                  fields={models[model]}
                  selectedFields={opts.selectedFields}
                  toggleField={toggleField}
                />

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-sm font-medium px-2">
                  Query Type
                </DropdownMenuLabel>
                <QueryTypeSelect
                  value={opts.queryType}
                  onChange={(q) => updateModelOption(model, { queryType: q })}
                />

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-sm font-medium px-2">
                  Pagination
                </DropdownMenuLabel>
                <PaginationInputs
                  skip={opts.skip}
                  take={opts.take}
                  onChange={(k, v) => updateModelOption(model, { [k]: v })}
                />

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-sm font-medium px-2">
                  Order By
                </DropdownMenuLabel>
                <OrderBySelect
                  modelFields={Object.keys(models[model])}
                  orderBy={opts.orderBy}
                  onChange={(o) => updateModelOption(model, { orderBy: o })}
                />

                <DropdownMenuSeparator />

                <div className="px-2 py-2">
                  <Button
                    className="w-full"
                    onClick={() =>
                      setNodes('model', {
                        modelName: model,
                        fields: Object.entries(models[model]).map(
                          ([name, meta]) => ({
                            name,
                            type: meta.type,
                          })
                        ),
                        label: model,
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
                    + Add {model} Node
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </TabsContent>
  );
};

export default ModelTab;
