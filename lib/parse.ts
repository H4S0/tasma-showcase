import { readFile } from 'fs/promises';
import path from 'path';
import { PrismaModels } from '@/types/prismaModels';

export type PrismaField = {
  name: string;
  type: string;
  isRequired: boolean;
  isList: boolean;
};

export type PrismaModelRuntime = {
  name: keyof PrismaModels;
  fields: PrismaField[];
};

export async function getPrismaModelsWithFields(): Promise<
  PrismaModelRuntime[]
> {
  const schemaPath = path.resolve(process.cwd(), 'prisma/schema.prisma');
  const schema = await readFile(schemaPath, 'utf-8');

  const models: PrismaModelRuntime[] = [];
  const modelRegex = /model\s+(\w+)\s*{([\s\S]*?)}/gm;
  let match: RegExpExecArray | null;

  while ((match = modelRegex.exec(schema)) !== null) {
    const modelName = match[1] as keyof PrismaModels;
    const body = match[2];

    const fields: PrismaField[] = [];
    const lines = body
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    for (const line of lines) {
      if (line.startsWith('@@') || line.startsWith('@')) continue;

      const parts = line.split(/\s+/);
      if (parts.length < 2) continue;

      let [name, type] = parts;
      let isList = false;
      let isRequired = false;

      if (type.endsWith('[]')) {
        type = type.slice(0, -2);
        isList = true;
      }
      if (!type.endsWith('?')) {
        isRequired = true;
      } else {
        type = type.slice(0, -1);
      }

      fields.push({ name, type, isRequired, isList });
    }

    models.push({ name: modelName, fields });
  }

  return models;
}
