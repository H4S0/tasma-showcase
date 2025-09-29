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

    const fields: string[] = [];
    for (const line of lines) {
      if (line.startsWith('@@') || line.startsWith('@')) continue;
      const parts = line.split(/\s+/);
      if (parts.length < 2) continue;
      fields.push(parts[0]);
    }

    output += `  ${modelName}: ${fields.map((f) => `'${f}'`).join(' | ')};\n`;
  }

  output += `};\n`;

  await writeFile(outPath, output);
  console.log('✅ Generated types/prismaModels.ts');
}

generate();
