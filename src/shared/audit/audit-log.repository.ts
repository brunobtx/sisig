import {
  CreateAuditLogInput,
  ListAuditLogsFilters,
  PaginatedAuditLogs,
} from './audit.types';

export interface AuditLogRepository {
  create(input: CreateAuditLogInput): Promise<void>;
  list(filters: ListAuditLogsFilters): Promise<PaginatedAuditLogs>;
}
