import { getPrismaModelsWithFields } from '@/lib/parse';
import { PrismaModels } from '@/types/prismaModels';

type PrismaData<M extends PrismaModels> = {
  [K in keyof M]: {
    [F in keyof M[K]]: any;
  };
};

export async function getTypedModels(): Promise<PrismaData<PrismaModels>> {
  const fetched = await getPrismaModelsWithFields();

  const result = {} as PrismaData<PrismaModels>;

  for (const model of fetched) {
    const modelName = model.name as keyof PrismaModels;
    const fields = {} as any;

    for (const field of model.fields) {
      fields[field.name] = null;
    }

    result[modelName] = fields;
  }

  return result;
}
