import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  userId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-access-super-secret-key-32-chars-min';

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Authentication token missing' });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as unknown as { id?: string };
    if (!payload?.id) {
      res.status(401).json({ error: 'Invalid token payload' });
      return;
    }

    req.user = { id: payload.id };
    req.userId = payload.id;
    next();
  } catch (error: any) {
    if (error?.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Access token expired', code: 'TOKEN_EXPIRED' });
      return;
    }
    res.status(401).json({ error: 'Invalid or malformed token' });
  }
};

// Backwards compatibility alias
export const authenticateToken = requireAuth;
export type AuthRequest = AuthenticatedRequest;
