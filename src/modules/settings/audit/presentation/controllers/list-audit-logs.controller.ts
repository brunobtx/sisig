import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { ListAuditLogsFilters } from '../../../../../shared/audit';
import { ListAuditLogsUseCase } from '../../application/use-cases/list-audit-logs.use-case';

function parsePositiveInteger(value: unknown, fieldName: string): number | undefined {
  if (typeof value === 'undefined') {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError(`${fieldName} invalido.`, 400);
  }

  return parsed;
}

function parseDate(value: unknown, fieldName: string): Date | undefined {
  if (typeof value === 'undefined') {
    return undefined;
  }

  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(`${fieldName} invalido.`, 400);
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new AppError(`${fieldName} invalido.`, 400);
  }

  return parsed;
}

export class ListAuditLogsController {
  constructor(private readonly useCase: ListAuditLogsUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const filters: ListAuditLogsFilters = {
        module: typeof req.query.module === 'string' ? req.query.module : undefined,
        action: typeof req.query.action === 'string' ? req.query.action : undefined,
        status:
          req.query.status === 'success' || req.query.status === 'failure'
            ? req.query.status
            : undefined,
        actorUserUuid:
          typeof req.query.actorUserUuid === 'string' ? req.query.actorUserUuid : undefined,
        entityType:
          typeof req.query.entityType === 'string' ? req.query.entityType : undefined,
        entityUuid:
          typeof req.query.entityUuid === 'string' ? req.query.entityUuid : undefined,
        requestId:
          typeof req.query.requestId === 'string' ? req.query.requestId : undefined,
        organizationId:
          parsePositiveInteger(req.query.organizationId, 'organizationId') ??
          req.activeOrganizationId ??
          undefined,
        actionAtFrom: parseDate(req.query.actionAtFrom, 'actionAtFrom'),
        actionAtTo: parseDate(req.query.actionAtTo, 'actionAtTo'),
        page: parsePositiveInteger(req.query.page, 'page') ?? 1,
        pageSize: parsePositiveInteger(req.query.pageSize, 'pageSize') ?? 20,
      };

      const result = await this.useCase.execute(filters);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
