'use client';

import React, { useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { generateQuery } from '@/lib/generate-prisma-query';
import { ModelNodeData } from './sidebar-flow';
import { usePrismaQuery } from '@/app/hooks/use-prisma-query';
import { PrismaClient } from '@prisma/client';
import { PrismaQueryConfig } from '@/app/lib/types';
import { Button } from '../ui/button';

type QueryBuilderPreviewProps = {
  nodes: Node[];
  edges: Edge[];
};

const QueryBuilderPreview = ({ nodes, edges }: QueryBuilderPreviewProps) => {
  const modelNodes = nodes.filter(
    (node): node is Node<ModelNodeData> =>
      node.type === 'modelNode' &&
      typeof node.data === 'object' &&
      node.data !== null &&
      'isMainModel' in node.data &&
      node.data.isMainModel === true
  );

  const generated = modelNodes.map((node) => generateQuery(node, nodes, edges));

  const queryOptsArray = generated.map((g) => g.queryOpts);
  const previewStrings = generated.map((g) => g.queryOptsString);

  const [execute, setExecute] = useState(false);

  const dummyQuery: PrismaQueryConfig<keyof PrismaClient, 'findMany'> = {
    model: 'post',
    operation: 'findMany',
  };

  const firstQueryOpts = queryOptsArray[0] ?? dummyQuery;

  const { data, isLoading, isFetching, error } = usePrismaQuery(
    firstQueryOpts,
    {
      enabled: execute && !!queryOptsArray[0],
    }
  );

  const handleRun = () => setExecute(true);

  return (
    <div className="space-y-4">
      <pre className="bg-gray-100 p-4 rounded text-sm">
        {previewStrings.length > 0
          ? previewStrings.join('\n\n')
          : 'No query generated yet. Add a model to the board.'}
      </pre>

      {queryOptsArray[0] && (
        <Button onClick={handleRun} disabled={isLoading || isFetching}>
          {isLoading || isFetching ? 'Running...' : 'Run Query'}
        </Button>
      )}

      {isLoading && (
        <div className="text-gray-500 italic">Query is running...</div>
      )}

      {error && (
        <div className="text-red-600 italic">
          Error: {(error as Error).message}
        </div>
      )}

      {execute && !isLoading && !data && !error && (
        <div className="text-gray-500 italic">
          Query ran but returned no data.
        </div>
      )}

      {data && (
        <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default QueryBuilderPreview;
