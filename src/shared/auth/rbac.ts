export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'export';
export type PermissionModule =
  | 'people'
  | 'users'
  | 'members'
  | 'events'
  | 'school'
  | 'finance'
  | 'settings';

export type PermissionKey = `${PermissionModule}:${PermissionAction}`;

export type Permission = {
  module: PermissionModule;
  actions: PermissionAction[];
};

const ALL_ACTIONS: PermissionAction[] = ['create', 'read', 'update', 'delete', 'export'];
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { module: 'people', actions: ALL_ACTIONS },
    { module: 'users', actions: ALL_ACTIONS },
    { module: 'members', actions: ALL_ACTIONS },
    { module: 'events', actions: ALL_ACTIONS },
    { module: 'school', actions: ALL_ACTIONS },
    { module: 'finance', actions: ALL_ACTIONS },
    { module: 'settings', actions: ALL_ACTIONS },
  ],
  manager: [
    { module: 'people', actions: ALL_ACTIONS },
    { module: 'users', actions: ['read'] },
    { module: 'members', actions: ALL_ACTIONS },
    { module: 'events', actions: ALL_ACTIONS },
    { module: 'school', actions: ALL_ACTIONS },
    { module: 'finance', actions: ['read', 'export'] },
    { module: 'settings', actions: ['read'] },
  ],
  editor: [
    { module: 'people', actions: ['read', 'update'] },
    { module: 'users', actions: ['read'] },
    { module: 'members', actions: ['read', 'update'] },
    { module: 'events', actions: ['create', 'read', 'update'] },
    { module: 'school', actions: ['create', 'read', 'update'] },
    { module: 'finance', actions: ['read'] },
    { module: 'settings', actions: [] },
  ],
  viewer: [
    { module: 'people', actions: ['read'] },
    { module: 'users', actions: [] },
    { module: 'members', actions: ['read'] },
    { module: 'events', actions: ['read'] },
    { module: 'school', actions: ['read'] },
    { module: 'finance', actions: ['read'] },
    { module: 'settings', actions: [] },
  ],
};

export function isValidRole(role: string): role is UserRole {
  return role in ROLE_PERMISSIONS;
}

function normalizePermissionSet(permissions: Permission[]): Set<PermissionKey> {
  const keys = new Set<PermissionKey>();

  for (const permission of permissions) {
    for (const action of permission.actions) {
      keys.add(`${permission.module}:${action}` as PermissionKey);
    }
  }

  return keys;
}

function toPermissionList(keys: Set<PermissionKey>): Permission[] {
  const moduleMap = new Map<PermissionModule, Set<PermissionAction>>();

  for (const key of keys) {
    const [module, action] = key.split(':') as [PermissionModule, PermissionAction];

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

function sanitizeCustomPermissions(customPermissions?: string[]): PermissionKey[] {
  if (!customPermissions) return [];

  return customPermissions.filter((item) => {
    const [module, action] = item.split(':');

    if (!module || !action) return false;

    const moduleIsValid = [
      'people',
      'users',
      'members',
      'events',
      'school',
      'finance',
      'settings',
    ].includes(module);
    const actionIsValid = ['create', 'read', 'update', 'delete', 'export'].includes(action);

    return moduleIsValid && actionIsValid;
  }) as PermissionKey[];
}

export function getPermissionsForUser(role: UserRole, customPermissions?: string[]): Permission[] {
  const base = normalizePermissionSet(ROLE_PERMISSIONS[role]);
  const extras = sanitizeCustomPermissions(customPermissions);

  for (const permission of extras) {
    base.add(permission);
  }

  return toPermissionList(base);
}

export function hasPermission(permissions: Permission[], required: PermissionKey): boolean {
  for (const permission of permissions) {
    if (permission.actions.some((action) => `${permission.module}:${action}` === required)) {
      return true;
    }
  }

  return false;
}
