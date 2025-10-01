import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type ConditionNodeProps = {
  data: {
    field: string;
    comparator: '=' | '!=' | '>' | '<';
    value: string | number;
  };
};

const ConditionNode = ({ data }: ConditionNodeProps) => {
  console.log(data);
  const dotPosition = data.field.indexOf('.');
  const displayField =
    dotPosition !== -1 ? data.field.slice(dotPosition + 1) : data.field;

  return (
    <Card className="w-60 border border-yellow-400 ">
      <CardHeader className="flex items-center gap-2 text-yellow-400 ">
        <Filter className="w-4 h-4" />
        <CardTitle className="font-semibold">Condition</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="flex items-center justify-between px-3 py-2 text-sm bg-white/10 rounded-md">
        <span className="font-medium">{displayField}</span>
        <span className="mx-2">{data.comparator}</span>
        <span className="text-muted-foreground">{data.value}</span>
      </CardContent>

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </Card>
  );
};

export default ConditionNode;
