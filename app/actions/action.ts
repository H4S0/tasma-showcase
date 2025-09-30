import { getPrismaModelsWithFields } from '@/lib/parse';

export async function getTypedModels() {
  const fetched = await getPrismaModelsWithFields();

  const result: Record<
    string,
    Record<string, { type: string; value: null }>
  > = {};

  for (const model of fetched) {
    const fields: Record<string, { type: string; value: null }> = {};
    for (const field of model.fields) {
      fields[field.name] = {
        type: field.type,
        value: null,
      };
    }
    result[model.name] = fields;
  }

  return result;
}
