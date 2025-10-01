'use client';

import React, { useState } from 'react';
import FlowCanvas from '../react-flow';

import { Node } from '@xyflow/react';
import SidebarFlow from '../sidebar-flow';

export type Model = Record<
  string,
  Record<
    string,
    {
      type: string;
      value: null;
    }
  >
>;

type ClientFlowPageProps = {
  models: Model;
};

const ClientFlowPage = ({ models }: ClientFlowPageProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);

  return (
    <div className="flex h-screen">
      <SidebarFlow models={models} setNodes={setNodes} />

      <main className="flex-1 p-6">
        <FlowCanvas nodes={nodes} setNodes={setNodes} />
      </main>
    </div>
  );
};

export default ClientFlowPage;
