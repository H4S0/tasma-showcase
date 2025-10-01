import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Handle, Position } from '@xyflow/react';
import { Link2 } from 'lucide-react';
import React from 'react';

type JoinNodeProps = {
  data: {
    fromModel: string;
    fromField: string;
    toModel: string;
    toField: string;
  };
};

const JoinNode = ({ data }: JoinNodeProps) => {
  return (
    <Card className="w-64 border border-blue-500 ">
      <CardHeader className="flex items-center gap-2 text-blue-600">
        <Link2 className="h-4 w-4" />
        <CardTitle className="font-semibold ">Join</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{data.fromModel}</span>
          <span className="text-gray-500">{data.fromField}</span>
        </div>
        <div className="text-center text-gray-400">⇄</div>
        <div className="flex justify-between">
          <span className="font-medium">{data.toModel}</span>
          <span className="text-gray-500">{data.toField}</span>
        </div>
      </CardContent>

      <Handle type="target" position={Position.Left} id="input" />
      <Handle type="source" position={Position.Right} id="output" />
    </Card>
  );
};

export default JoinNode;
