import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Handle, Position } from '@xyflow/react';
import React from 'react';

type OperationNodeProps = {
  data: {
    label: string;
    operator: 'AND' | 'OR';
  };
};

const OperationNode = ({ data }: OperationNodeProps) => {
  return (
    <Card className="w-40 h-20 flex items-start justify-center p-5 bg-blue-500">
      <CardHeader className="p-2">
        <CardTitle className="font-bold text-white">{data.operator}</CardTitle>
      </CardHeader>

      <Handle
        type="target"
        position={Position.Left}
        id="input-1"
        style={{ top: '30%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="input-2"
        style={{ top: '70%' }}
      />

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ top: '50%' }}
      />
    </Card>
  );
};

export default OperationNode;
