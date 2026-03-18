import { decode, sign, type JwtPayload, type SignOptions } from 'jsonwebtoken';
import {
  UserOrganizationAccessContext,
  UserOrganizationAccessMode,
} from '../../../../../shared/auth/organization-access';
import { Permission, UserRole } from '../../../../../shared/auth/rbac';
import { AppError } from '../../../../../shared/errors/AppError';

export type IssueAuthSessionInput = {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  organizationAccessMode: UserOrganizationAccessMode;
  activeOrganizationId: number | null;
  organizationAccesses: UserOrganizationAccessContext[];
};

export type IssuedAuthSession = {
  token: string;
  expiresIn: number;
};

export class AuthSessionService {
  issue({
    userId,
    name,
    email,
    role,
    permissions,
    organizationAccessMode,
    activeOrganizationId,
    organizationAccesses,
  }: IssueAuthSessionInput): IssuedAuthSession {
    if (!process.env.JWT_SECRET) {
      throw new AppError('JWT_SECRET nao configurado.', 500);
    }

    const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn'];

    const token = sign(
      {
        name,
        email,
        role,
        permissions,
        organizationAccessMode,
        defaultOrganizationId: activeOrganizationId,
        organizationAccesses,
      },
      process.env.JWT_SECRET,
      {
        subject: userId,
        expiresIn: jwtExpiresIn,
      },
    );

    const payload = decode(token) as JwtPayload | null;
    const issuedAt = payload?.iat;
    const expiresAt = payload?.exp;

    return {
      token,
      expiresIn:
        typeof issuedAt === 'number' && typeof expiresAt === 'number'
          ? Math.max(expiresAt - issuedAt, 1)
          : 60 * 60 * 24,
    };
  }
}
