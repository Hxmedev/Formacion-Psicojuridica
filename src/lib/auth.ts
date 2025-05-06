import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const SECRET_KEY = import.meta.env.JWT_SECRET;

export function GenerateToken(payload: object): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

export function VerifyToken(token: string): any {
  return jwt.verify(token, SECRET_KEY);
}

export function GetUserFromRequest(request: Request): any | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = parse(cookieHeader);
  const token = cookies.token;
  if (!token) return null;

  try {
    return VerifyToken(token);
  } catch {
    return null;
  }
}
