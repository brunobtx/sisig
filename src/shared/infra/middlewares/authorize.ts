import { NextFunction, Request, Response } from 'express';
import { PermissionKey, UserRole, hasPermission } from '../../auth/rbac';

export function requireRole(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Acesso negado para este recurso.' });
    }

    return next();
  };
}

export function requirePermission(permission: PermissionKey) {
  return (req: Request, res: Response, next: NextFunction) => {
    const permissions = req.userPermissions ?? [];

    if (!hasPermission(permissions, permission)) {
      return res.status(403).json({ message: 'Permissão insuficiente para executar esta ação.' });
    }

    return next();
  };
}
