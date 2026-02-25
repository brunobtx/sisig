import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { Permission, UserRole } from '../../auth/rbac';

interface Payload {
  sub: string;
  role?: UserRole;
  permissions?: Permission[];
}

export function isAutenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).end();
  }

  const [, token] = authToken.split(' ');

  try {
    const payload = verify(token, process.env.JWT_SECRET as string) as Payload;

    req.userId = payload.sub;
    req.userRole = payload.role;
    req.userPermissions = payload.permissions ?? [];
    return next();
  } catch {
    return res.status(401).end();
  }
}
