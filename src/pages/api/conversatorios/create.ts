// src/pages/api/conversatorios/create.ts
export const prerender = false;
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST({ request }: { request: Request }) {
  const data = await request.json();
  const newConversatorio = await prisma.conversatorio.create({ data });
  return new Response(JSON.stringify(newConversatorio), { status: 201 });
}
