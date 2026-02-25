import type { Permission, UserRole } from '../../shared/auth/rbac';

declare global {
  namespace Express {
    interface Request {
      userId: string;
      userRole?: UserRole;
      userPermissions?: Permission[];
    }
  }
}

export {};
