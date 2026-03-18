import { NextFunction, Request, RequestHandler, Response } from 'express';
import { auditService } from '../../audit';
import { AuditLogStatus } from '../../audit/audit.types';

type AuditRouteContext = {
  req: Request;
  res: Response;
  responseBody?: unknown;
  actionAt: Date;
  requestId: string;
  status: AuditLogStatus;
};

type Resolver<T> = T | ((context: AuditRouteContext) => T);

type AuditRouteOptions = {
  module: string;
  action: string;
  entityType?: Resolver<string | null | undefined>;
  entityId?: Resolver<string | number | null | undefined>;
  entityUuid?: Resolver<string | null | undefined>;
  targetOrganizationId?: Resolver<number | null | undefined>;
  summary?: Resolver<string | null | undefined>;
  beforeData?: Resolver<unknown>;
  afterData?: Resolver<unknown>;
  metadata?: Resolver<unknown>;
  shouldAudit?: Resolver<boolean>;
};

function resolve<T>(value: Resolver<T> | undefined, context: AuditRouteContext): T | undefined {
  if (typeof value === 'function') {
    return (value as (context: AuditRouteContext) => T)(context);
  }

  return value;
}

function getStatusFromResponse(res: Response): AuditLogStatus {
  return res.statusCode >= 200 && res.statusCode < 400 ? 'success' : 'failure';
}

function extractIpAddress(req: Request): string | null {
  const forwarded = req.header('x-forwarded-for');

  if (typeof forwarded === 'string' && forwarded.trim().length > 0) {
    return forwarded.split(',')[0]?.trim() ?? null;
  }

  return req.ip ?? null;
}

function buildDefaultMetadata(req: Request): Record<string, unknown> {
  const metadata: Record<string, unknown> = {};

  if (req.params && Object.keys(req.params).length > 0) {
    metadata.params = req.params;
  }

  if (req.query && Object.keys(req.query).length > 0) {
    metadata.query = req.query;
  }

  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    metadata.body = req.body;
  }

  return metadata;
}

function toNullableString(value: string | number | null | undefined): string | null {
  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  return null;
}

export function auditRoute(options: AuditRouteOptions): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const requestId = req.requestId ?? `${Date.now()}`;
    req.requestId = requestId;
    const actionAt = new Date();
    let responseBody: unknown;

    const originalJson = res.json.bind(res);
    res.json = ((body: unknown) => {
      responseBody = body;
      return originalJson(body);
    }) as Response['json'];

    res.on('finish', () => {
      const status = getStatusFromResponse(res);
      const context: AuditRouteContext = {
        req,
        res,
        responseBody,
        actionAt,
        requestId,
        status,
      };

      const shouldAudit = resolve(options.shouldAudit, context);

      if (shouldAudit === false) {
        return;
      }

      const targetOrganizationId = resolve(options.targetOrganizationId, context);
      const metadata = resolve(options.metadata, context);
      const afterData = resolve(options.afterData, context);
      const defaultMetadata = buildDefaultMetadata(req);

      void auditService.record({
        requestId,
        actionAt,
        actorUserUuid: req.userId ?? null,
        actorRole: req.userRole ?? null,
        activeOrganizationId:
          typeof req.activeOrganizationId === 'number' ? req.activeOrganizationId : null,
        targetOrganizationId:
          typeof targetOrganizationId === 'number'
            ? targetOrganizationId
            : typeof req.activeOrganizationId === 'number'
              ? req.activeOrganizationId
              : null,
        module: options.module,
        action: options.action,
        entityType: resolve(options.entityType, context) ?? null,
        entityId: toNullableString(resolve(options.entityId, context) ?? null),
        entityUuid: toNullableString(resolve(options.entityUuid, context) ?? null),
        route: req.originalUrl.split('?')[0] ?? req.originalUrl,
        method: req.method,
        status,
        summary:
          resolve(options.summary, context) ??
          `${options.module}:${options.action} (${status})`,
        ipAddress: extractIpAddress(req),
        userAgent: req.header('user-agent') ?? null,
        beforeData: resolve(options.beforeData, context),
        afterData: typeof afterData === 'undefined' ? responseBody : afterData,
        metadata:
          metadata && Object.keys(defaultMetadata).length > 0
            ? { ...defaultMetadata, extra: metadata }
            : Object.keys(defaultMetadata).length > 0
              ? defaultMetadata
              : metadata,
      }).catch((error) => {
        console.error('[AUDIT_LOG_ERROR]', error);
      });
    });

    next();
  };
}
