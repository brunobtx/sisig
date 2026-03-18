export type AuditLogStatus = 'success' | 'failure';

export type AuditJsonPrimitive = string | number | boolean | null;
export type AuditJsonValue =
  | AuditJsonPrimitive
  | AuditJsonObject
  | AuditJsonArray;

export type AuditJsonObject = {
  [key: string]: AuditJsonValue;
};

export type AuditJsonArray = AuditJsonValue[];

export type CreateAuditLogInput = {
  requestId?: string | null;
  actionAt?: Date | null;
  actorUserUuid?: string | null;
  actorRole?: string | null;
  activeOrganizationId?: number | null;
  targetOrganizationId?: number | null;
  module: string;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  entityUuid?: string | null;
  route: string;
  method: string;
  status: AuditLogStatus;
  summary?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  beforeData?: unknown;
  afterData?: unknown;
  metadata?: unknown;
};

export type AuditLogItem = {
  uuid: string;
  requestId: string | null;
  actionAt: Date;
  createdAt: Date;
  actorUserUuid: string | null;
  actorRole: string | null;
  activeOrganizationId: number | null;
  targetOrganizationId: number | null;
  module: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  entityUuid: string | null;
  route: string;
  method: string;
  status: AuditLogStatus;
  summary: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  beforeData: AuditJsonValue | null;
  afterData: AuditJsonValue | null;
  metadata: AuditJsonValue | null;
};

export type ListAuditLogsFilters = {
  module?: string;
  action?: string;
  status?: AuditLogStatus;
  actorUserUuid?: string;
  entityType?: string;
  entityUuid?: string;
  requestId?: string;
  organizationId?: number | null;
  actionAtFrom?: Date;
  actionAtTo?: Date;
  page?: number;
  pageSize?: number;
};

export type PaginatedAuditLogs = {
  items: AuditLogItem[];
  total: number;
  page: number;
  pageSize: number;
};
