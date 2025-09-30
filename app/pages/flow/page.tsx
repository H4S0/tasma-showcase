import { getTypedModels } from '@/app/actions/action';
import ClientFlowPage from '@/components/react-flow/client-page/client-flow-page';

export default async function Page() {
  const models = await getTypedModels();

  return <ClientFlowPage models={models} />;
}
