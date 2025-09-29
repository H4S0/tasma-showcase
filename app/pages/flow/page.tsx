const Page = async () => {
  const res = await fetch(`http://localhost:3000/api/prisma/models`, {
    cache: 'no-store',
  });
  const models = await res.json();

  console.log(models);
  return <div>Models: {models.join(', ')}</div>;
};

export default Page;
