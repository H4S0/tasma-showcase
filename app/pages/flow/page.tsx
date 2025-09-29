import { getTypedModels } from '@/app/actions/action';

export default async function Page() {
  const models = await getTypedModels();

  console.log(models);
  return (
    <div>
      <h1>Prisma Models</h1>
      <div>User email: </div>
      <div>Post title: {models.Post.title}</div>
    </div>
  );
}
