// app/actions/getPrismaModels.ts
'use server';

import { getPrismaModelsFromSchema } from '@/lib/parse';

export async function getPrismaModelsWithFields() {
  return getPrismaModelsFromSchema();
}
