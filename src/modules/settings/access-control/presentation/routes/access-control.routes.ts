import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { CreateAccessControlUseCase } from '../../application/use-cases/create-access-control.use-case';
import { AssignUserToAccessControlGroupUseCase } from '../../application/use-cases/assign-user-to-access-control-group.use-case';
import { ListAccessControlUseCase } from '../../application/use-cases/list-access-control.use-case';
import { UpdateAccessControlUseCase } from '../../application/use-cases/update-access-control.use-case';
import { PrismaAccessControlRepository } from '../../infra/repositories/prisma-access-control.repository';
import { CreateAccessControlController } from '../controllers/create-access-control.controller';
import { AssignUserToAccessControlGroupController } from '../controllers/assign-user-to-access-control-group.controller';
import { ListAccessControlController } from '../controllers/list-access-control.controller';
import { UpdateAccessControlController } from '../controllers/update-access-control.controller';
import { AccessControlValidatorFactory } from '../validators/access-control.validator';
import { auditRoute } from '../../../../../shared/infra/middlewares/audit-route';

const accessControlRoutes = Router();

const repository = new PrismaAccessControlRepository();
const validator = AccessControlValidatorFactory.create();

const createAccessControlController = new CreateAccessControlController(
  new CreateAccessControlUseCase(repository),
  validator,
);
const updateAccessControlController = new UpdateAccessControlController(
  new UpdateAccessControlUseCase(repository),
  validator,
);
const assignUserToAccessControlGroupController = new AssignUserToAccessControlGroupController(
  new AssignUserToAccessControlGroupUseCase(repository),
);
const listAccessControlController = new ListAccessControlController(new ListAccessControlUseCase(repository));

accessControlRoutes.use(isAutenticated);
accessControlRoutes.post(
  '/access-controls/groups',
  requirePermission('settings:update'),
  auditRoute({
    module: 'settings',
    action: 'create_access_control_group',
    entityType: 'permission_group',
    entityUuid: ({ responseBody }) => (responseBody as { uuid?: string } | undefined)?.uuid ?? null,
    entityId: ({ responseBody }) => (responseBody as { id?: number | string } | undefined)?.id ?? null,
    summary: ({ status }) =>
      status === 'success'
        ? 'Grupo de permissao criado com sucesso.'
        : 'Falha ao criar grupo de permissao.',
  }),
  createAccessControlController.handle,
);
accessControlRoutes.put(
  '/access-controls/groups/:groupUuid',
  requirePermission('settings:update'),
  auditRoute({
    module: 'settings',
    action: 'update_access_control_group',
    entityType: 'permission_group',
    entityUuid: ({ req }) => req.params.groupUuid,
    summary: ({ status }) =>
      status === 'success'
        ? 'Grupo de permissao atualizado com sucesso.'
        : 'Falha ao atualizar grupo de permissao.',
  }),
  updateAccessControlController.handle,
);
accessControlRoutes.put(
  '/access-controls/groups/:groupUuid/users/:userUuid',
  requirePermission('settings:update'),
  auditRoute({
    module: 'settings',
    action: 'assign_user_to_access_control_group',
    entityType: 'user',
    entityUuid: ({ req }) => req.params.userUuid,
    afterData: ({ req }) => ({
      userUuid: req.params.userUuid,
      groupUuid: req.params.groupUuid,
    }),
    summary: ({ status }) =>
      status === 'success'
        ? 'Usuario vinculado ao grupo de permissao.'
        : 'Falha ao vincular usuario ao grupo de permissao.',
  }),
  assignUserToAccessControlGroupController.handle,
);
accessControlRoutes.get('/access-controls/groups', requirePermission('settings:read'), listAccessControlController.handle);

export { accessControlRoutes };
