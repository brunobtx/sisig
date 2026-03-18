export const USER_ORGANIZATION_SCOPES = ['organization', 'subtree', 'all'] as const;

export type UserOrganizationScope = (typeof USER_ORGANIZATION_SCOPES)[number];
export type UserOrganizationAccessMode = 'legacy' | 'scoped';
export type UserOrganizationSummary = {
  id: number;
  uuid: string;
  name: string;
  type: string;
};

export type UserOrganizationAccessSerialized = {
  id_organization: number;
  scope?: string | null;
  is_default?: boolean;
  organization?: UserOrganizationSummary;
};

export type UserOrganizationAccessContext = {
  id_organization: number;
  scope: UserOrganizationScope;
  is_default: boolean;
  organization?: UserOrganizationSummary;
};

export function normalizeUserOrganizationScope(
  scope?: string | null,
): UserOrganizationScope {
  if (!scope) {
    return 'organization';
  }

  return USER_ORGANIZATION_SCOPES.includes(scope as UserOrganizationScope)
    ? (scope as UserOrganizationScope)
    : 'organization';
}

export function normalizeUserOrganizationAccess(
  access: UserOrganizationAccessSerialized,
): UserOrganizationAccessContext {
  return {
    id_organization: access.id_organization,
    scope: normalizeUserOrganizationScope(access.scope),
    is_default: access.is_default === true,
    organization: access.organization,
  };
}

export function normalizeUserOrganizationAccesses(
  accesses: UserOrganizationAccessSerialized[],
): UserOrganizationAccessContext[] {
  const normalizedAccesses = Array.from(
    new Map(
      accesses
        .filter(
          (access) =>
            typeof access?.id_organization === 'number' &&
            Number.isInteger(access.id_organization) &&
            access.id_organization > 0,
        )
        .map((access) => {
          const normalizedAccess = normalizeUserOrganizationAccess(access);

          return [
            `${normalizedAccess.id_organization}:${normalizedAccess.scope}`,
            normalizedAccess,
          ];
        }),
    ).values(),
  );

  const firstDefaultIndex = normalizedAccesses.findIndex(
    (access) => access.is_default,
  );

  if (normalizedAccesses.length > 0) {
    const resolvedDefaultIndex = firstDefaultIndex === -1 ? 0 : firstDefaultIndex;

    normalizedAccesses.forEach((access, index) => {
      access.is_default = index === resolvedDefaultIndex;
    });
  }

  return normalizedAccesses;
}

export function resolveDefaultOrganizationId(
  preferredOrganizationId: number | null | undefined,
  accesses: UserOrganizationAccessContext[],
): number | null {
  if (
    typeof preferredOrganizationId === 'number' &&
    Number.isInteger(preferredOrganizationId) &&
    preferredOrganizationId > 0 &&
    accesses.some((access) => access.id_organization === preferredOrganizationId)
  ) {
    return preferredOrganizationId;
  }

  return (
    accesses.find((access) => access.is_default)?.id_organization ??
    accesses[0]?.id_organization ??
    null
  );
}

export function resolveUserOrganizationAccessMode(
  payloadMode: UserOrganizationAccessMode | undefined,
  accesses: UserOrganizationAccessContext[],
): UserOrganizationAccessMode {
  return payloadMode === 'scoped' && accesses.length > 0 ? 'scoped' : 'legacy';
}
