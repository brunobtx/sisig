import { AuditService } from './audit.service';
import { PrismaAuditLogRepository } from './prisma-audit-log.repository';

export { AuditService } from './audit.service';
export { PrismaAuditLogRepository } from './prisma-audit-log.repository';
export type { AuditLogRepository } from './audit-log.repository';
export * from './audit.types';

const auditLogRepository = new PrismaAuditLogRepository();
const auditService = new AuditService(auditLogRepository);

export { auditLogRepository, auditService };
