import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Database } from 'lucide-react';

type ModelNodeProps = {
  data: {
    modelName: string;
    fields: { name: string; type: string }[];
  };
};

const ModelNode = ({ data }: ModelNodeProps) => {
  return (
    <Card className="w-60 border border-red-400">
      <CardHeader className="text-red-400  flex items-center gap-2">
        <Database className="w-4 h-4" />
        <CardTitle className="font-semibold">{data.modelName}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className=" p-0">
        {data.fields.map((field) => (
          <div key={field.name} className="flex flex-col justify-between px-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{field.name}</span>
              <span className="text-muted-foreground">{field.type}</span>
            </div>
          </div>
        ))}
      </CardContent>

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </Card>
  );
};

export default ModelNode;
