import React from 'react';
import { Node, Edge } from '@xyflow/react';

type QueryBuilderPreviewProps = {
  nodes: Node[];
  edges: Edge[];
};

const QueryBuilderPreview = ({ nodes, edges }: QueryBuilderPreviewProps) => {
  const tableNodes = nodes.filter((node) => node.type === 'modelNode');

  const starterQueryText = `const result = await prisma.ModelName.findMany({
    include: {
      posts: true
    }
  });`;

  return <div>QueryBuilderPreview</div>;
};

export default QueryBuilderPreview;
