import { readFile } from 'fs/promises';
import path from 'path';

export interface PrismaField<Type extends string = string> {
  name: string;
  type: Type;
  isRequired: boolean;
  isList: boolean;
}

export interface PrismaModel<
  Name extends string = string,
  Field extends PrismaField = PrismaField
> {
  name: Name;
  fields: Field[];
}

export async function getPrismaModelsFromSchema<
  Model extends PrismaModel = PrismaModel
>(): Promise<Model[]> {
  const schemaPath = path.resolve(process.cwd(), 'prisma/schema.prisma');
  const schema = await readFile(schemaPath, 'utf-8');

  const models: Model[] = [];
  const modelRegex = /model\s+(\w+)\s*{([\s\S]*?)^}/gm;

  let match: RegExpExecArray | null;
  while ((match = modelRegex.exec(schema)) !== null) {
    const modelName = match[1];
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

      const name = parts[0];
      let type = parts[1];
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

    models.push({ name: modelName, fields } as Model);
  }

  return models;
}
