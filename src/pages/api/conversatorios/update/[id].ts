// src/pages/api/conversatorios/update/[id].ts
export const prerender = false;
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function PUT({ request, params }: { request: Request, params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 });
  }

  const body = await request.json();

  try {
    const updated = await prisma.conversatorio.update({
      where: { id },
      data: body
    });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'No se pudo actualizar' }), { status: 500 });
  }
}
