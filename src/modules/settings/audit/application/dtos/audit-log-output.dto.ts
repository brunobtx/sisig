import { AuditLogItem } from '../../../../../shared/audit';

export type AuditLogOutputDto = {
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
  status: 'success' | 'failure';
  summary: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  beforeData: unknown;
  afterData: unknown;
  metadata: unknown;
};

export type ListAuditLogsOutputDto = {
  items: AuditLogOutputDto[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export class AuditLogOutputMapper {
  static toOutput(item: AuditLogItem): AuditLogOutputDto {
    return {
      uuid: item.uuid,
      requestId: item.requestId,
      actionAt: item.actionAt,
      createdAt: item.createdAt,
      actorUserUuid: item.actorUserUuid,
      actorRole: item.actorRole,
      activeOrganizationId: item.activeOrganizationId,
      targetOrganizationId: item.targetOrganizationId,
      module: item.module,
      action: item.action,
      entityType: item.entityType,
      entityId: item.entityId,
      entityUuid: item.entityUuid,
      route: item.route,
      method: item.method,
      status: item.status,
      summary: item.summary,
      ipAddress: item.ipAddress,
      userAgent: item.userAgent,
      beforeData: item.beforeData,
      afterData: item.afterData,
      metadata: item.metadata,
    };
  }
}
