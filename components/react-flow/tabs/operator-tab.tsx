import { TabsContent } from '@/components/ui/tabs';
import React from 'react';
import { AddNodeFn } from '../sidebar-flow';

const OperatorTab = ({ setNodes }: { setNodes: AddNodeFn }) => {
  return (
    <TabsContent value="operators" className="mt-5 space-y-3">
      <div
        onClick={() => setNodes('operator', { operator: 'AND', label: 'AND' })}
        className="w-full text-left px-3 py-2 font-medium rounded-md shadow cursor-pointer"
      >
        AND
      </div>
      <div
        onClick={() => setNodes('operator', { operator: 'OR', label: 'OR' })}
        className="w-full text-left px-3 py-2 font-medium rounded-md shadow cursor-pointer"
      >
        OR
      </div>
    </TabsContent>
  );
};

export default OperatorTab;
