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
    <Card className="w-60">
      <CardHeader>
        <CardTitle>{data.modelName}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="divide-y divide-gray-200 p-0">
        {data.fields.map((field) => (
          <li
            key={field.name}
            className="flex justify-between px-3 py-1 text-sm"
          >
            <span>{field.name}</span>
            <span className="text-gray-500">{field.type}</span>
          </li>
        ))}
      </CardContent>

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </Card>
  );
};

export default ModelNode;
