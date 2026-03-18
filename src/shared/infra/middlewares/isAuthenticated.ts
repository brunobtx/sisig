import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { Permission, UserRole } from '../../auth/rbac';
import {
  normalizeUserOrganizationAccesses,
  resolveDefaultOrganizationId,
  resolveUserOrganizationAccessMode,
  UserOrganizationAccessContext,
  UserOrganizationAccessMode,
  UserOrganizationAccessSerialized,
} from '../../auth/organization-access';
import prismaClient from '../../../prisma';

interface Payload {
  sub: string;
  role?: UserRole;
  permissions?: Permission[];
  organizationAccessMode?: UserOrganizationAccessMode;
  defaultOrganizationId?: number | null;
  organizationAccesses?: UserOrganizationAccessSerialized[];
}

async function isOrganizationDescendantOf(
  organizationId: number,
  ancestorId: number,
): Promise<boolean> {
  let currentId: number | null = organizationId;

  while (currentId) {
    if (currentId === ancestorId) {
      return true;
    }

    const organization = await prismaClient.organization.findUnique({
      where: { id: currentId },
      select: { id_parent: true },
    });

    currentId = organization?.id_parent ?? null;
  }

  return false;
}

async function isRequestedOrganizationAllowed(
  requestedOrganizationId: number,
  accesses: UserOrganizationAccessContext[],
): Promise<boolean> {
  if (accesses.some((access) => access.scope === 'all')) {
    return true;
  }

  if (accesses.some((access) => access.id_organization === requestedOrganizationId)) {
    return true;
  }

  const subtreeAccesses = accesses.filter((access) => access.scope === 'subtree');
  for (const access of subtreeAccesses) {
    if (await isOrganizationDescendantOf(requestedOrganizationId, access.id_organization)) {
      return true;
    }
  }

  return false;
}

export async function isAutenticated(
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
    const organizationAccesses: UserOrganizationAccessContext[] =
      normalizeUserOrganizationAccesses(
        Array.isArray(payload.organizationAccesses)
          ? payload.organizationAccesses
          : [],
      );
    const requestedOrganizationIdHeader = req.header('x-organization-id');
    const hasRequestedOrganizationId =
      typeof requestedOrganizationIdHeader === 'string' &&
      requestedOrganizationIdHeader.trim().length > 0;
    const requestedOrganizationId = hasRequestedOrganizationId
      ? Number(requestedOrganizationIdHeader)
      : null;
    const organizationAccessMode: UserOrganizationAccessMode =
      resolveUserOrganizationAccessMode(
        payload.organizationAccessMode,
        organizationAccesses,
      );

    req.userId = payload.sub;
    req.userRole = payload.role;
    req.userPermissions = payload.permissions ?? [];
    req.userOrganizationAccesses = organizationAccesses;
    req.organizationAccessMode = organizationAccessMode;

    if (organizationAccessMode !== 'scoped') {
      return res.status(403).json({
        message: 'Token sem contexto organizacional valido. Faca login novamente.',
      });
    }

    if (
      hasRequestedOrganizationId &&
      (!Number.isInteger(requestedOrganizationId) || requestedOrganizationId <= 0)
    ) {
      return res.status(400).json({ message: 'Organizacao ativa invalida.' });
    }

    const resolvedOrganizationId = resolveDefaultOrganizationId(
      hasRequestedOrganizationId ? requestedOrganizationId : payload.defaultOrganizationId,
      organizationAccesses,
    );

    if (!resolvedOrganizationId) {
      return res.status(403).json({ message: 'Nenhuma organizacao ativa foi configurada para este usuario.' });
    }

    const isAllowed = await isRequestedOrganizationAllowed(
      resolvedOrganizationId,
      organizationAccesses,
    );

    if (!isAllowed) {
      return res.status(403).json({ message: 'Voce nao possui acesso a organizacao informada.' });
    }

    req.activeOrganizationId = resolvedOrganizationId;
    return next();
  } catch {
    return res.status(401).end();
  }
}
