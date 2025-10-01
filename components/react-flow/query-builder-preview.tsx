import React from 'react';
import { Node, Edge } from '@xyflow/react';
import { generateQuery } from '@/lib/generate-prisma-query';
import { ModelNodeData } from './sidebar-flow';

type QueryBuilderPreviewProps = {
  nodes: Node[];
  edges: Edge[];
};

const QueryBuilderPreview = ({ nodes, edges }: QueryBuilderPreviewProps) => {
  const modelNodes = nodes.filter(
    (node): node is Node<ModelNodeData> => node.type === 'modelNode'
  );

  const queries = modelNodes.map((node) => generateQuery(node, nodes, edges));

  return (
    <pre className="bg-gray-100 p-4 rounded text-sm">
      {queries.join('\n\n')}
    </pre>
  );
};

export default QueryBuilderPreview;
