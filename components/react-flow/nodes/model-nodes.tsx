import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Database } from 'lucide-react';
import { cn } from '@/lib/utils';

type ModelNodeProps = {
  data: {
    modelName: string;
    fields: { name: string; type: string }[];
    queryType: 'findMany' | 'findUnique' | 'findFirst';
    selectedFields?: string[];
    includeRelations?: string[];
    skip?: number;
    take?: number;
    orderBy?: { field: string; direction: 'asc' | 'desc' };
    isMainModel: boolean;
  };
};

const ModelNode = ({ data }: ModelNodeProps) => {
  console.log(data);

  return (
    <Card className="w-60 border border-red-400">
      <CardHeader>
        <div className="text-red-400 flex items-center gap-2">
          <Database className="w-4 h-4" />
          <CardTitle className="font-semibold">{data.modelName}</CardTitle>
        </div>
        {data.isMainModel && <CardDescription>Main model</CardDescription>}
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        {data.fields.map((field) => (
          <div key={field.name} className="flex flex-col justify-between px-2">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  'font-medium',
                  data.selectedFields?.includes(field.name) &&
                    'text-red-400 font-semibold'
                )}
              >
                {field.name}
              </span>
              <span className="text-muted-foreground">{field.type}</span>
            </div>
          </div>
        ))}

        <Separator className="my-1" />
        <div className="px-2 py-1 text-xs text-muted-foreground space-y-1">
          <div>
            <span className="font-semibold text-red-400">Query:</span>{' '}
            {data.queryType}
          </div>
          {data.skip !== undefined && (
            <div>
              <span className="font-semibold">Skip:</span> {data.skip}
            </div>
          )}
          {data.take !== undefined && (
            <div>
              <span className="font-semibold">Take:</span> {data.take}
            </div>
          )}
          {data.orderBy?.field && (
            <div>
              <span className="font-semibold">OrderBy:</span>{' '}
              {data.orderBy.field} ({data.orderBy.direction})
            </div>
          )}
        </div>
      </CardContent>

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </Card>
  );
};

export default ModelNode;
