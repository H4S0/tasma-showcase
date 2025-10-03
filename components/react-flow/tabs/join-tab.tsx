'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TabsContent } from '@/components/ui/tabs';
import React, { useState } from 'react';
import { ModelTabProps } from './model-tab';

const JoinTab = ({ models, setNodes }: ModelTabProps) => {
  const [fromModel, setFromModel] = useState('');
  const [fromField, setFromField] = useState('');
  const [toModel, setToModel] = useState('');
  const [toField, setToField] = useState('');

  const modelNames = Object.keys(models) as (keyof typeof models)[];

  return (
    <TabsContent value="join" className="mt-5 space-y-3">
      <p className="text-gray-600 mb-2">Build a join:</p>

      <Select
        value={fromModel}
        onValueChange={(val) => {
          setFromModel(val);
          setFromField('');
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="From Model" />
        </SelectTrigger>
        <SelectContent>
          {modelNames.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {fromModel && (
        <Select value={fromField} onValueChange={setFromField}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="From Field" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(models[fromModel]).map((field) => (
              <SelectItem key={field} value={field}>
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={toModel}
        onValueChange={(val) => {
          setToModel(val);
          setToField('');
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="To Model" />
        </SelectTrigger>
        <SelectContent>
          {modelNames.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {toModel && (
        <Select value={toField} onValueChange={setToField}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="To Field" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(models[toModel]).map((field) => (
              <SelectItem key={field} value={field}>
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Button
        className="w-full mt-2"
        disabled={!fromModel || !fromField || !toModel || !toField}
        onClick={() =>
          setNodes('join', {
            label: `Join ${fromModel}.${fromField} -> ${toModel}.${toField}`,
            fromModel,
            fromField,
            toModel,
            toField,
          })
        }
      >
        + Add Join
      </Button>
    </TabsContent>
  );
};

export default JoinTab;
