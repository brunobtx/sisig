export type AccessControlPermissionObjectInput = {
  module: string;
  actions: string[];
};

export type CreateAccessControlInputDto = {
  name: string;
  description?: string;
  permissions: Array<string | AccessControlPermissionObjectInput>;
};
