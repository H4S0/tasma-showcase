import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

async function generate() {
  const schemaPath = path.resolve('prisma/schema.prisma');
  const outDir = path.resolve('types');
  const outPath = path.resolve(outDir, 'prismaModels.ts');

  await mkdir(outDir, { recursive: true });

  const schema = await readFile(schemaPath, 'utf-8');

  const modelRegex = /model\s+(\w+)\s*{([\s\S]*?)}/gm;
  let match: RegExpExecArray | null;

  let output = `// Generated file, do not edit\n\nexport type PrismaModels = {\n`;

  while ((match = modelRegex.exec(schema)) !== null) {
    const modelName = match[1];
    const body = match[2];
    const lines = body
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    output += `  ${modelName}: {\n`;

    for (const line of lines) {
      if (line.startsWith('@@') || line.startsWith('@')) continue;

      const parts = line.split(/\s+/);
      if (parts.length < 2) continue;

      const name = parts[0];
      let type = parts[1];

      let isList = false;
      let isOptional = false;

      if (type.endsWith('[]')) {
        type = type.slice(0, -2);
        isList = true;
      }
      if (type.endsWith('?')) {
        type = type.slice(0, -1);
        isOptional = true;
      }

      const typeMap: Record<string, string> = {
        String: 'string',
        Int: 'number',
        Float: 'number',
        Boolean: 'boolean',
        DateTime: 'Date',
        Json: 'any',
      };

      let tsType = typeMap[type] ?? 'any';

      if (isList) tsType += '[]';
      if (isOptional) tsType += ' | null';

      output += `    ${name}: ${tsType};\n`;
    }

    output += `  };\n`;
  }

  output += `};\n`;

  await writeFile(outPath, output);
  console.log('✅ Generated types/prismaModels.ts');
}

generate();
