// app/actions/typedModels.ts
import { getPrismaModelsWithFields, PrismaModelRuntime } from '@/lib/parse';
import { PrismaModels } from '@/types/prismaModels';

type ModelValues<M extends keyof PrismaModels> = {
  [F in keyof PrismaModels[M]]: PrismaModels[M][F] | null;
};

export type TypedModels = {
  [M in keyof PrismaModels]: ModelValues<M>;
};

export async function getTypedModels(): Promise<TypedModels> {
  const fetched: PrismaModelRuntime[] = await getPrismaModelsWithFields();
  const result = {} as TypedModels;

  for (const model of fetched) {
    const fields: any = {};
    for (const field of model.fields) {
      fields[field.name] = null; // default runtime value
    }
    result[model.name] = fields;
  }

  return result;
}
