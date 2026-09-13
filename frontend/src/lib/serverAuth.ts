import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-access-super-secret-key-32-chars-min';

export interface AuthPayload {
  id: string;
}

/**
 * Verifies the Bearer token from the Authorization header of a Next.js request.
 * Returns the decoded payload or null if invalid/missing.
 */
export function verifyToken(req: NextRequest): AuthPayload | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id?: string };
    if (!payload?.id) return null;
    return { id: payload.id };
  } catch {
    return null;
  }
}

/**
 * Returns a 401 JSON response for unauthenticated requests.
 */
export function unauthorizedResponse(message = 'Authentication required') {
  return Response.json({ error: message }, { status: 401 });
}

const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'dev-refresh-super-secret-key-32-chars-min';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export function generateTokens(userId: string) {
  const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token: string): AuthPayload | null {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET) as { id?: string };
    if (!payload?.id) return null;
    return { id: payload.id };
  } catch {
    return null;
  }
}

export const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // seconds
