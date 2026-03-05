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
  createAccessControlController.handle,
);
accessControlRoutes.put(
  '/access-controls/groups/:groupUuid',
  requirePermission('settings:update'),
  updateAccessControlController.handle,
);
accessControlRoutes.put(
  '/access-controls/groups/:groupUuid/users/:userUuid',
  requirePermission('settings:update'),
  assignUserToAccessControlGroupController.handle,
);
accessControlRoutes.get('/access-controls/groups', requirePermission('settings:read'), listAccessControlController.handle);

export { accessControlRoutes };
