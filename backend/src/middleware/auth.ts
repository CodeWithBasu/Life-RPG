import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || 'super-secret', (err, user: any) => {
    if (err) {
      res.status(403).json({ error: 'Forbidden: Invalid token' });
      return;
    }
    req.userId = user.id;
    next();
  });
};
