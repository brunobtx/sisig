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
import { auditRoute } from '../../../../../shared/infra/middlewares/audit-route';

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

personRoutes.post(
  '/persons',
  requirePermission('people:create'),
  auditRoute({
    module: 'people',
    action: 'create_person',
    entityType: 'person',
    entityUuid: ({ responseBody }) => (responseBody as { uuid?: string } | undefined)?.uuid ?? null,
    entityId: ({ responseBody }) => (responseBody as { id?: number | string } | undefined)?.id ?? null,
    targetOrganizationId: ({ responseBody, req }) =>
      typeof (responseBody as { id_organization?: number | null } | undefined)?.id_organization === 'number'
        ? (responseBody as { id_organization?: number | null }).id_organization ?? null
        : req.activeOrganizationId ?? null,
    summary: ({ status }) =>
      status === 'success' ? 'Pessoa criada com sucesso.' : 'Falha ao criar pessoa.',
  }),
  createPersonController.handle,
);
personRoutes.get('/persons', requirePermission('people:read'), listPersonController.handle);
personRoutes.get('/persons/:uuid', requirePermission('people:read'), detailPersonController.handle);
personRoutes.patch(
  '/persons/:uuid',
  requirePermission('people:update'),
  auditRoute({
    module: 'people',
    action: 'update_person',
    entityType: 'person',
    entityUuid: ({ req }) => req.params.uuid,
    targetOrganizationId: ({ responseBody, req }) =>
      typeof (responseBody as { id_organization?: number | null } | undefined)?.id_organization === 'number'
        ? (responseBody as { id_organization?: number | null }).id_organization ?? null
        : req.activeOrganizationId ?? null,
    summary: ({ status }) =>
      status === 'success' ? 'Pessoa atualizada com sucesso.' : 'Falha ao atualizar pessoa.',
  }),
  updatePersonController.handle,
);
personRoutes.delete(
  '/persons/:uuid',
  requirePermission('people:delete'),
  auditRoute({
    module: 'people',
    action: 'delete_person',
    entityType: 'person',
    entityUuid: ({ req }) => req.params.uuid,
    targetOrganizationId: ({ req }) => req.activeOrganizationId ?? null,
    summary: ({ status }) =>
      status === 'success' ? 'Pessoa inativada com sucesso.' : 'Falha ao inativar pessoa.',
  }),
  deletePersonController.handle,
);
personRoutes.put(
  '/persons/:personUuid/organizations/:organizationUuid',
  requirePermission('people:update'),
  auditRoute({
    module: 'people',
    action: 'assign_person_to_organization',
    entityType: 'person',
    entityUuid: ({ req }) => req.params.personUuid,
    afterData: ({ req, responseBody }) => ({
      personUuid: req.params.personUuid,
      organizationUuid: req.params.organizationUuid,
      result: responseBody,
    }),
    summary: ({ status }) =>
      status === 'success'
        ? 'Pessoa vinculada a organizacao com sucesso.'
        : 'Falha ao vincular pessoa a organizacao.',
  }),
  assignPersonToOrganizationController.handle,
);

export { personRoutes };
