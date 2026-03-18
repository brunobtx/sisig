import { Router } from 'express';
import { auditLogRepository } from '../../../../../shared/audit';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { ListAuditLogsUseCase } from '../../application/use-cases/list-audit-logs.use-case';
import { ListAuditLogsController } from '../controllers/list-audit-logs.controller';

const auditRoutes = Router();

const listAuditLogsController = new ListAuditLogsController(
  new ListAuditLogsUseCase(auditLogRepository),
);

auditRoutes.use(isAutenticated);
auditRoutes.get(
  '/audit-logs',
  requirePermission('settings:read'),
  listAuditLogsController.handle,
);

export { auditRoutes };
