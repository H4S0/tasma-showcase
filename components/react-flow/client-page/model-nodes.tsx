import React from 'react';
import { Handle, Position } from '@xyflow/react';

type ModelNodeProps = {
  data: {
    modelName: string;
    fields: { name: string; type: string }[];
  };
};

const ModelNode = ({ data }: ModelNodeProps) => {
  return (
    <div className="rounded-lg shadow-md bg-white border border-gray-300 w-64">
      <div className="bg-gray-100 px-3 py-2 font-semibold border-b border-gray-300">
        {data.modelName}
      </div>
      <ul className="divide-y divide-gray-200">
        {data.fields.map((field) => (
          <li
            key={field.name}
            className="flex justify-between px-3 py-1 text-sm"
          >
            <span>{field.name}</span>
            <span className="text-gray-500">{field.type}</span>
          </li>
        ))}
      </ul>

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

export default ModelNode;
