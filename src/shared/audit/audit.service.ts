import { AuditLogRepository } from './audit-log.repository';
import { CreateAuditLogInput } from './audit.types';
import { sanitizeAuditValue } from './audit.utils';

export class AuditService {
  constructor(private readonly repository: AuditLogRepository) {}

  async record(input: CreateAuditLogInput): Promise<void> {
    const normalizedInput: CreateAuditLogInput = {
      ...input,
      requestId: input.requestId ?? null,
      actionAt: input.actionAt ?? new Date(),
      actorUserUuid: input.actorUserUuid ?? null,
      actorRole: input.actorRole ?? null,
      activeOrganizationId:
        typeof input.activeOrganizationId === 'number' ? input.activeOrganizationId : null,
      targetOrganizationId:
        typeof input.targetOrganizationId === 'number' ? input.targetOrganizationId : null,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      entityUuid: input.entityUuid ?? null,
      summary: input.summary ?? null,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      beforeData:
        typeof input.beforeData === 'undefined' ? null : sanitizeAuditValue(input.beforeData),
      afterData:
        typeof input.afterData === 'undefined' ? null : sanitizeAuditValue(input.afterData),
      metadata:
        typeof input.metadata === 'undefined' ? null : sanitizeAuditValue(input.metadata),
    };

    await this.repository.create(normalizedInput);
  }
}
