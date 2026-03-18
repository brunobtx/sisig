import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export function attachRequestMetadata(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.requestId) {
    req.requestId = uuidv4();
  }

  res.setHeader('x-request-id', req.requestId);
  next();
}
