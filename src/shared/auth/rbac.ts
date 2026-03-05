export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';
export type PermissionAction = string;
export type PermissionModule = string;
export type PermissionKey = `${string}:${string}`;

export type Permission = {
  module: PermissionModule;
  actions: PermissionAction[];
};

const VALID_ROLES: UserRole[] = ['admin', 'manager', 'editor', 'viewer'];

export function isValidRole(role: string): role is UserRole {
  return VALID_ROLES.includes(role as UserRole);
}

function normalizePermissionSet(permissions: Permission[]): Set<PermissionKey> {
  const keys = new Set<PermissionKey>();

  for (const permission of permissions) {
    for (const action of permission.actions) {
      keys.add(`${permission.module}:${action}`);
    }
  }

  return keys;
}

function normalizePermissionKey(rawKey: string): PermissionKey | null {
  const [module, action, ...rest] = rawKey.split(':');

  if (!module || !action || rest.length > 0) {
    return null;
  }

  return `${module}:${action}`;
}

export function permissionKeysToList(permissionKeys: string[]): Permission[] {
  const moduleMap = new Map<PermissionModule, Set<PermissionAction>>();

  for (const key of permissionKeys) {
    const normalizedKey = normalizePermissionKey(key);

    if (!normalizedKey) {
      continue;
    }

    const [module, action] = normalizedKey.split(':') as [PermissionModule, PermissionAction];

    if (!moduleMap.has(module)) {
      moduleMap.set(module, new Set<PermissionAction>());
    }

    moduleMap.get(module)?.add(action);
  }

  return Array.from(moduleMap.entries()).map(([module, actions]) => ({
    module,
    actions: Array.from(actions),
  }));
}

export function permissionListToKeys(permissions: Permission[]): PermissionKey[] {
  return Array.from(normalizePermissionSet(permissions));
}

export function getPermissionsFromKeys(permissionKeys: string[]): Permission[] {
  return permissionKeysToList(permissionKeys);
}

export function hasPermission(permissions: Permission[], required: PermissionKey): boolean {
  const requiredKey = normalizePermissionKey(required);

  if (!requiredKey) {
    return false;
  }

  for (const permission of permissions) {
    if (permission.actions.some((action) => `${permission.module}:${action}` === requiredKey)) {
      return true;
    }
  }

  return false;
}
