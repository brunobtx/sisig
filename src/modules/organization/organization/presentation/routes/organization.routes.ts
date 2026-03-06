import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { CreateOrganizationUseCase } from '../../application/use-cases/create-organization.use-case';
import { DeleteOrganizationUseCase } from '../../application/use-cases/delete-organization.use-case';
import { DetailOrganizationUseCase } from '../../application/use-cases/detail-organization.use-case';
import { ListOrganizationUseCase } from '../../application/use-cases/list-organization.use-case';
import { UpdateOrganizationUseCase } from '../../application/use-cases/update-organization.use-case';
import { PrismaOrganizationRepository } from '../../infra/repositories/prisma-organization.repository';
import { CreateOrganizationController } from '../controllers/create-organization.controller';
import { DeleteOrganizationController } from '../controllers/delete-organization.controller';
import { DetailOrganizationController } from '../controllers/detail-organization.controller';
import { ListOrganizationController } from '../controllers/list-organization.controller';
import { UpdateOrganizationController } from '../controllers/update-organization.controller';
import { OrganizationValidatorFactory } from '../validators/organization.validator';

const organizationRoutes = Router();
const repository = new PrismaOrganizationRepository();

const createOrganizationController = new CreateOrganizationController(
  new CreateOrganizationUseCase(repository),
  OrganizationValidatorFactory.create(),
);

const listOrganizationController = new ListOrganizationController(new ListOrganizationUseCase(repository));
const detailOrganizationController = new DetailOrganizationController(
  new DetailOrganizationUseCase(repository),
);

const updateOrganizationController = new UpdateOrganizationController(
  new UpdateOrganizationUseCase(repository),
  OrganizationValidatorFactory.create(),
);

const deleteOrganizationController = new DeleteOrganizationController(
  new DeleteOrganizationUseCase(repository),
);

organizationRoutes.use(isAutenticated);

organizationRoutes.post(
  '/organizations',
  requirePermission('organization:create'),
  createOrganizationController.handle,
);
organizationRoutes.get(
  '/organizations',
  requirePermission('organization:read'),
  listOrganizationController.handle,
);
organizationRoutes.get(
  '/organizations/:uuid',
  requirePermission('organization:read'),
  detailOrganizationController.handle,
);
organizationRoutes.patch(
  '/organizations/:uuid',
  requirePermission('organization:update'),
  updateOrganizationController.handle,
);
organizationRoutes.delete(
  '/organizations/:uuid',
  requirePermission('organization:delete'),
  deleteOrganizationController.handle,
);

export { organizationRoutes };
