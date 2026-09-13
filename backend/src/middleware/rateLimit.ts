import { Request, Response, NextFunction } from 'express';
 
// Rate limiting disabled
export const authRateLimiter = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
