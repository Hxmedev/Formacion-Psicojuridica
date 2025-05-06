import { GenerateToken } from '@root/lib/auth';
import { serialize } from 'cookie';

export async function POST({ request }: { request: Request }) {
  const data = await request.formData();
  const username = data.get('username');
  const password = data.get('password');

  // Verificación de credenciales
  if (username === 'admin' && password === import.meta.env.ADMIN_PASSWORD) {
    // Generar el token
    const token = GenerateToken({ user: 'admin' });

    // Configurar la cookie con el token
    const cookie = serialize('token', token, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60,  // 1 hora de expiración
    });

    // Redirigir a la página de administración
    return new Response(null, {
      status: 302,  // 302 es el código de redirección
      headers: {
        'Set-Cookie': cookie,  // Establecer la cookie
        'Location': '/admin',   // Redirigir a /admin
      },
    });
  }

  // Si las credenciales son incorrectas
  return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
