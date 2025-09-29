import { getPrismaModelsWithFields } from '@/app/actions/action';
import { PrismaModels } from '@/types/prismaModels';

interface PrismaField<Name extends string> {
  name: Name;
  type: string;
  isRequired: boolean;
  isList: boolean;
}

interface PrismaModel<Name extends keyof PrismaModels> {
  name: Name;
  fields: PrismaField<PrismaModels[Name]>[];
}

const models: PrismaModel<keyof PrismaModels>[] =
  await getPrismaModelsWithFields();

export default async function Page() {
  return (
    <div>
      <h1>Prisma Models</h1>
      <pre>{models.map((model) => model.fields.map((item) => item.name))}</pre>
    </div>
  );
}
