import { getTypedModels } from '@/app/actions/action';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default async function Page() {
  const models = await getTypedModels();
  const modelNames = Object.keys(models) as (keyof typeof models)[];

  return (
    <div className="flex h-screen">
      <aside className="w-72 bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Prisma Models</h2>
        <ul className="space-y-4">
          {modelNames.map((model) => (
            <li key={model}>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full text-left px-3 py-2 font-medium rounded-md bg-white shadow hover:bg-gray-50">
                  {model}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>{model} fields</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.keys(models[model]).map((field) => (
                    <DropdownMenuItem key={field}>{field}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold">Select a model</h1>
        <p className="text-gray-600 mt-2">
          Click on a model from the sidebar to view its fields.
        </p>
      </main>
    </div>
  );
}
