import { TabsContent } from '@/components/ui/tabs';
import React from 'react';
import { NodeKind } from '../sidebar-flow';

const OperatorTab = ({
  setNodes,
}: {
  setNodes: (kind: NodeKind, options?: any) => void;
}) => {
  return (
    <TabsContent value="operators" className="mt-5 space-y-3">
      <div
        onClick={() => setNodes('operator', { operator: 'AND' })}
        className="w-full text-left px-3 py-2 font-medium rounded-md shadow cursor-pointer"
      >
        AND
      </div>
      <div
        onClick={() => setNodes('operator', { operator: 'OR' })}
        className="w-full text-left px-3 py-2 font-medium rounded-md shadow cursor-pointer"
      >
        OR
      </div>
    </TabsContent>
  );
};

export default OperatorTab;
