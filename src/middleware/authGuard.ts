import { GetUserFromRequest } from '../lib/auth';

export async function authGuard({ request }: { request: Request }) {
  const user = GetUserFromRequest(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return null; // Autorizado
}
