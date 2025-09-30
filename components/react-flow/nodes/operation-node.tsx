import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Handle, Position } from '@xyflow/react';
import React from 'react';

const OperationNode = () => {
  return (
    <Card className="w-60">
      <CardHeader>
        <CardTitle>operation</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="divide-y divide-gray-200 p-0">
        operation
      </CardContent>

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </Card>
  );
};

export default OperationNode;
