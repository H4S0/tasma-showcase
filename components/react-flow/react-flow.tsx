'use client';

import { useState, useCallback } from 'react';
import {
  Edge,
  ReactFlow,
  addEdge,
  Node,
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ModelNode from './nodes/model-nodes';
import OperationNode from './nodes/operation-node';
import JoinNode from './nodes/join-node';
import ConditionNode from './nodes/condition-node';
import QueryBuilderPreview from './query-builder-preview';

const nodeTypes = {
  modelNode: ModelNode,
  operatorNode: OperationNode,
  joinNode: JoinNode,
  conditionNode: ConditionNode,
};

export default function FlowCanvas({
  nodes,
  setNodes,
}: {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}) {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [showQueryPreview, setShowQueryPreview] = useState(true);

  const onNodesChange = useCallback(
    (changes) => setNodes(applyNodeChanges(changes, nodes)),
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div className="flex h-full w-full">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={(event) => event.preventDefault()}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        <button
          onClick={() => setShowQueryPreview((v) => !v)}
          className="absolute top-4 right-4 z-10 bg-blue-600 text-white px-3 py-1 rounded shadow"
        >
          {showQueryPreview ? 'Hide Query' : 'Show Query'}
        </button>
      </div>

      {showQueryPreview && (
        <div className="w-96 border-l border-gray-300 overflow-y-auto bg-gray-50 p-4">
          <h2 className="text-lg font-semibold mb-2">Query Preview</h2>
          <QueryBuilderPreview nodes={nodes} edges={edges} />
        </div>
      )}
    </div>
  );
}
