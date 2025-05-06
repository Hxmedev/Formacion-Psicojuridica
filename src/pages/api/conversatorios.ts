import type { APIRoute } from 'astro';
import { GetConversatorios } from '@root/lib/conversatorios';

export const GET: APIRoute = async () => {
  const data = await GetConversatorios();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
