import { getTypedModels } from '@/app/actions/action';

export default async function Page() {
  const models = await getTypedModels();
  console.log(models);
  return (
    <div>
      <h1>Prisma Models</h1>

      <h2>User Fields</h2>
      <ul>
        {Object.keys(models.User).map((field) => (
          <li key={field}>{field}</li>
        ))}
      </ul>

      <h2>Post Fields</h2>
      <ul>
        {Object.keys(models.Post).map((field) => (
          <li key={field}>{field}</li>
        ))}
      </ul>
    </div>
  );
}
