import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { CreatePersonUseCase } from '../../application/use-cases/create-person.use-case';
import { DeletePersonUseCase } from '../../application/use-cases/delete-person.use-case';
import { DetailPersonUseCase } from '../../application/use-cases/detail-person.use-case';
import { ListPersonUseCase } from '../../application/use-cases/list-person.use-case';
import { UpdatePersonUseCase } from '../../application/use-cases/update-person.use-case';
import { AssignPersonToOrganizationUseCase } from '../../application/use-cases/assign-person-to-organization.use-case';
import { PrismaPersonRepository } from '../../infra/repositories/prisma-person.repository';
import { PrismaOrganizationRepository } from '../../../../organization/organization/infra/repositories/prisma-organization.repository';
import { CreatePersonController } from '../controllers/create-person.controller';
import { DeletePersonController } from '../controllers/delete-person.controller';
import { DetailPersonController } from '../controllers/detail-person.controller';
import { ListPersonController } from '../controllers/list-person.controller';
import { UpdatePersonController } from '../controllers/update-person.controller';
import { AssignPersonToOrganizationController } from '../controllers/assign-person-to-organization.controller';
import { PersonValidatorFactory } from '../validators/person.validator';

const personRoutes = Router();
const repository = new PrismaPersonRepository();
const organizationRepository = new PrismaOrganizationRepository();

const createPersonController = new CreatePersonController(
  new CreatePersonUseCase(repository),
  PersonValidatorFactory.create(),
);

const listPersonController = new ListPersonController(new ListPersonUseCase(repository));
const detailPersonController = new DetailPersonController(new DetailPersonUseCase(repository));

const updatePersonController = new UpdatePersonController(
  new UpdatePersonUseCase(repository),
  PersonValidatorFactory.create(),
);

const deletePersonController = new DeletePersonController(new DeletePersonUseCase(repository));
const assignPersonToOrganizationController = new AssignPersonToOrganizationController(
  new AssignPersonToOrganizationUseCase(repository, organizationRepository),
);

personRoutes.use(isAutenticated);

personRoutes.post('/persons', requirePermission('people:create'), createPersonController.handle);
personRoutes.get('/persons', requirePermission('people:read'), listPersonController.handle);
personRoutes.get('/persons/:uuid', requirePermission('people:read'), detailPersonController.handle);
personRoutes.patch('/persons/:uuid', requirePermission('people:update'), updatePersonController.handle);
personRoutes.delete('/persons/:uuid', requirePermission('people:delete'), deletePersonController.handle);
personRoutes.put(
  '/persons/:personUuid/organizations/:organizationUuid',
  requirePermission('people:update'),
  assignPersonToOrganizationController.handle,
);

export { personRoutes };
