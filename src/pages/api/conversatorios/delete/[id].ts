// src/pages/api/conversatorios/delete/[id].ts
export const prerender = false;
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function DELETE({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 });
  }

  try {
    await prisma.conversatorio.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'No se pudo eliminar' }), { status: 500 });
  }
}
