import { getTypedModels } from '@/app/actions/action';
import ClientFlowPage from '@/components/react-flow/client-page/client-flow-page';

export default async function Page() {
  //add ssr prefetch here using tasma queries
  const models = await getTypedModels();

  return <ClientFlowPage models={models} />;
}
