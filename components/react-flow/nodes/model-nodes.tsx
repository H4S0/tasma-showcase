import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type ModelNodeProps = {
  data: {
    modelName: string;
    fields: { name: string; type: string }[];
  };
};

const ModelNode = ({ data }: ModelNodeProps) => {
  return (
    <Card className="w-60 bg-red-400">
      <CardHeader>
        <CardTitle className="text-white">{data.modelName}</CardTitle>
      </CardHeader>
      <Separator className="bg-white" />
      <CardContent className=" p-0">
        {data.fields.map((field) => (
          <div key={field.name} className="flex flex-col justify-between px-2">
            <div className="flex items-center justify-between">
              <span className="text-white">{field.name}</span>
              <span className="text-white">{field.type}</span>
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
