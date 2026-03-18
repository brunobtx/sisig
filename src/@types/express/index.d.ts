import type { Permission, UserRole } from '../../shared/auth/rbac';
import type {
  UserOrganizationAccessContext,
  UserOrganizationAccessMode,
} from '../../shared/auth/organization-access';

declare global {
  namespace Express {
    interface Request {
      userId: string;
      userRole?: UserRole;
      userPermissions?: Permission[];
      activeOrganizationId?: number | null;
      organizationAccessMode?: UserOrganizationAccessMode;
      userOrganizationAccesses?: UserOrganizationAccessContext[];
    }
  }
}

export {};
