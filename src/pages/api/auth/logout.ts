import { serialize } from 'cookie';

export async function POST() {
  // Borrar la cookie 'token'
  const cookie = serialize('token', '', {
    path: '/',  // La cookie será eliminada para todo el dominio
    httpOnly: true,
    maxAge: -1,  // Esto hace que la cookie expire inmediatamente
  });

  // Redirigir al home después de cerrar sesión con código 302 (redirección temporal)
  return new Response(null, {
    status: 302,  // Redirección temporal
    headers: {
      'Set-Cookie': cookie,  // Establecer la cookie con maxAge -1 eliminará la cookie
      'Location': '/',  // Redirigir al home (página de inicio)
    },
  });
}
