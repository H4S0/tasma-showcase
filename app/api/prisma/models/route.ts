import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

type PrismaModelKeys = {
  [K in keyof PrismaClient]: K extends `$${string}` | 'constructor' ? never : K;
}[keyof PrismaClient];

const prisma = new PrismaClient();

export async function GET() {
  const modelNames: PrismaModelKeys[] = Object.keys(prisma).filter(
    (key) =>
      !key.startsWith('_') && !key.startsWith('$') && key !== 'constructor'
  ) as PrismaModelKeys[];

  return NextResponse.json(modelNames);
}
