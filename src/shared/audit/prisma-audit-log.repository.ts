import prismaClient from '../../prisma';
import { AuditLogRepository } from './audit-log.repository';
import {
  AuditLogItem,
  AuditLogStatus,
  CreateAuditLogInput,
  ListAuditLogsFilters,
  PaginatedAuditLogs,
} from './audit.types';

function mapRowToAuditLogItem(row: any): AuditLogItem {
  return {
    uuid: row.uuid,
    requestId: row.request_id ?? null,
    actionAt: row.action_at,
    createdAt: row.created_at,
    actorUserUuid: row.actor_user_uuid ?? null,
    actorRole: row.actor_role ?? null,
    activeOrganizationId: row.active_organization_id ?? null,
    targetOrganizationId: row.target_organization_id ?? null,
    module: row.module,
    action: row.action,
    entityType: row.entity_type ?? null,
    entityId: row.entity_id ?? null,
    entityUuid: row.entity_uuid ?? null,
    route: row.route,
    method: row.method,
    status: row.status as AuditLogStatus,
    summary: row.summary ?? null,
    ipAddress: row.ip_address ?? null,
    userAgent: row.user_agent ?? null,
    beforeData: row.before_data ?? null,
    afterData: row.after_data ?? null,
    metadata: row.metadata ?? null,
  };
}

export class PrismaAuditLogRepository implements AuditLogRepository {
  async create(input: CreateAuditLogInput): Promise<void> {
    await prismaClient.auditLog.create({
      data: {
        request_id: input.requestId ?? null,
        action_at: input.actionAt ?? new Date(),
        actor_user_uuid: input.actorUserUuid ?? null,
        actor_role: input.actorRole ?? null,
        active_organization_id: input.activeOrganizationId ?? null,
        target_organization_id: input.targetOrganizationId ?? null,
        module: input.module,
        action: input.action,
        entity_type: input.entityType ?? null,
        entity_id: input.entityId ?? null,
        entity_uuid: input.entityUuid ?? null,
        route: input.route,
        method: input.method,
        status: input.status,
        summary: input.summary ?? null,
        ip_address: input.ipAddress ?? null,
        user_agent: input.userAgent ?? null,
        before_data: input.beforeData as any,
        after_data: input.afterData as any,
        metadata: input.metadata as any,
      },
    });
  }

  async list(filters: ListAuditLogsFilters): Promise<PaginatedAuditLogs> {
    const page = Math.max(filters.page ?? 1, 1);
    const pageSize = Math.min(Math.max(filters.pageSize ?? 20, 1), 100);
    const where: any = {};

    if (filters.module) {
      where.module = filters.module;
    }

    if (filters.action) {
      where.action = filters.action;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.actorUserUuid) {
      where.actor_user_uuid = filters.actorUserUuid;
    }

    if (filters.entityType) {
      where.entity_type = filters.entityType;
    }

    if (filters.entityUuid) {
      where.entity_uuid = filters.entityUuid;
    }

    if (filters.requestId) {
      where.request_id = filters.requestId;
    }

    if (typeof filters.organizationId === 'number') {
      where.OR = [
        { active_organization_id: filters.organizationId },
        { target_organization_id: filters.organizationId },
      ];
    }

    if (filters.actionAtFrom || filters.actionAtTo) {
      where.action_at = {};

      if (filters.actionAtFrom) {
        where.action_at.gte = filters.actionAtFrom;
      }

      if (filters.actionAtTo) {
        where.action_at.lte = filters.actionAtTo;
      }
    }

    const [rows, total] = await prismaClient.$transaction([
      prismaClient.auditLog.findMany({
        where,
        orderBy: { action_at: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prismaClient.auditLog.count({ where }),
    ]);

    return {
      items: rows.map((row) => mapRowToAuditLogItem(row)),
      total,
      page,
      pageSize,
    };
  }
}
