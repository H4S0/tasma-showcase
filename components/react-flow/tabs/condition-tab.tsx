'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TabsContent } from '@/components/ui/tabs';
import React, { useState } from 'react';
import { ConditionNodeData } from '../sidebar-flow';
import { ModelTabProps } from './model-tab';

const ConditionTab = ({ models, setNodes }: ModelTabProps) => {
  const [conditionField, setConditionField] = useState('');
  const [comparator, setComparator] = useState('');
  const [conditionValue, setConditionValue] = useState('');

  const comparators: ConditionNodeData['comparator'][] = [
    '=',
    '!=',
    '>',
    '>=',
    '<',
    '<=',
    'IN',
    'NOT IN',
  ];

  const modelNames = Object.keys(models) as (keyof typeof models)[];

  return (
    <TabsContent value="condition" className="mt-5 space-y-3">
      <p className="text-gray-600 mb-2">Build a condition:</p>

      <Select value={conditionField} onValueChange={setConditionField}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Field" />
        </SelectTrigger>
        <SelectContent>
          {modelNames.flatMap((model) =>
            Object.keys(models[model]).map((field) => (
              <SelectItem key={`${model}.${field}`} value={`${model}.${field}`}>
                {model}.{field}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Select value={comparator} onValueChange={setComparator}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Comparator" />
        </SelectTrigger>
        <SelectContent>
          {comparators.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="Value"
        value={conditionValue}
        onChange={(e) => setConditionValue(e.target.value)}
      />

      <Button
        className="w-full mt-2"
        disabled={!conditionField || !comparator || !conditionValue}
        onClick={() =>
          setNodes('condition', {
            field: conditionField,
            comparator,
            value: conditionValue,
          })
        }
      >
        + Add Condition
      </Button>
    </TabsContent>
  );
};

export default ConditionTab;
