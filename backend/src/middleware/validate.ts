import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const isValidObjectId = (id: string): boolean => {
  return typeof id === 'string' && OBJECT_ID_REGEX.test(id);
};

export const validateObjectIdParam = (paramName = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const rawParam = req.params[paramName];
    const value = Array.isArray(rawParam) ? rawParam[0] : rawParam;

    if (!value || typeof value !== 'string' || !isValidObjectId(value)) {
      res.status(400).json({ error: `Invalid ${paramName} format. Expected 24-character ObjectId.` });
      return;
    }
    next();
  };
};

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = (result.error as any).issues || (result.error as any).errors || [];
      const errorMessages = issues.map(
        (err: any) => `${err.path?.join('.') || 'body'}: ${err.message}`
      );
      res.status(400).json({
        error: 'Validation failed',
        details: errorMessages,
      });
      return;
    }
    req.body = result.data;
    next();
  };
};
