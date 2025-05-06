import { GetUserFromRequest } from '../lib/auth';

export async function RequireAuthAstro({ request }: { request: Request }) {
  const user = await GetUserFromRequest(request);

  if (!user) {
    return null;
  }

  return user;
}