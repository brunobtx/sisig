import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { AuthUserUseCase } from '../../application/use-cases/auth-user.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { ListUserController } from '../controllers/list-user.controller'
import { DetailUserUseCase } from '../../application/use-cases/detail-user.use-case';
import { PrismaPersonRepository } from '../../../person/infra/repositories/prisma-person.repository';
import { PrismaUserRepository } from '../../infra/repositories/prisma-user.repository';
import { AuthUserController } from '../controllers/auth-user.controller';
import { CreateUserController } from '../controllers/create-user.controller';
import { DetailUserController } from '../controllers/detail-user.controller';
import { ListUserUseCase } from '../../application/use-cases/list-user.use-case';
import { UserValidatorFactory } from '../validators/user.validator';
import { RequestUserPasswordResetUseCase } from '../../application/use-cases/request-user-password-reset.use-case';
import { ConfirmUserPasswordResetUseCase } from '../../application/use-cases/confirm-user-password-reset.use-case';
import { PrismaPasswordResetTokenRepository } from '../../infra/repositories/prisma-password-reset-token.repository';
import { ConsolePasswordResetMailer } from '../../application/services/password-reset-mailer';
import { RequestPasswordResetController } from '../controllers/request-password-reset.controller';
import { ConfirmPasswordResetController } from '../controllers/confirm-password-reset.controller';
import { PrismaAccessControlRepository } from '../../../../settings/access-control/infra/repositories/prisma-access-control.repository';
import { UpdateUserAccessControlsUseCase } from '../../application/use-cases/update-user-access-controls.use-case';
import { UpdateUserAccessControlsController } from '../controllers/update-user-access-controls.controller';
import { UpdateUserAccessControlsValidatorFactory } from '../validators/update-user-access-controls.validator';
import { ListUserAccessControlsUseCase } from '../../application/use-cases/list-user-access-controls.use-case';
import { ListUserAccessControlsController } from '../controllers/list-user-access-controls.controller';
import { PrismaOrganizationRepository } from '../../../../organization/organization/infra/repositories/prisma-organization.repository';
import { PrismaUserOrganizationAccessRepository } from '../../infra/repositories/prisma-user-organization-access.repository';
import { ListUserOrganizationAccessesUseCase } from '../../application/use-cases/list-user-organization-accesses.use-case';
import { UpdateUserOrganizationAccessesUseCase } from '../../application/use-cases/update-user-organization-accesses.use-case';
import { ListUserOrganizationAccessesController } from '../controllers/list-user-organization-accesses.controller';
import { UpdateUserOrganizationAccessesController } from '../controllers/update-user-organization-accesses.controller';
import { UpdateUserOrganizationAccessesValidatorFactory } from '../validators/update-user-organization-accesses.validator';
import { UserOrganizationContextService } from '../../application/services/user-organization-context.service';
import { AuthSessionService } from '../../application/services/auth-session.service';
import { auditRoute } from '../../../../../shared/infra/middlewares/audit-route';

const userRoutes = Router();
const userRepository = new PrismaUserRepository();
const personRepository = new PrismaPersonRepository();
const passwordResetTokenRepository = new PrismaPasswordResetTokenRepository();
const passwordResetMailer = new ConsolePasswordResetMailer();
const accessControlRepository = new PrismaAccessControlRepository();
const organizationRepository = new PrismaOrganizationRepository();
const userOrganizationAccessRepository = new PrismaUserOrganizationAccessRepository();
const userOrganizationContextService = new UserOrganizationContextService(
  personRepository,
  organizationRepository,
  userOrganizationAccessRepository,
);
const authSessionService = new AuthSessionService();

const createUserController = new CreateUserController(
  new CreateUserUseCase(userRepository, accessControlRepository, personRepository),
  UserValidatorFactory.create(),
);

const listUserController = new ListUserController(
  new ListUserUseCase(userRepository, personRepository),
);

const authUserController = new AuthUserController(
  new AuthUserUseCase(
    personRepository,
    userRepository,
    accessControlRepository,
    userOrganizationContextService,
    authSessionService,
  ),
);

const detailUserController = new DetailUserController(
  new DetailUserUseCase(userRepository, personRepository),
);
const requestPasswordResetController = new RequestPasswordResetController(
  new RequestUserPasswordResetUseCase(
    personRepository,
    userRepository,
    passwordResetTokenRepository,
    passwordResetMailer,
    userOrganizationContextService,
  ),
);
const confirmPasswordResetController = new ConfirmPasswordResetController(
  new ConfirmUserPasswordResetUseCase(
    personRepository,
    userRepository,
    passwordResetTokenRepository,
    userOrganizationContextService,
  ),
);
const updateUserAccessControlsController = new UpdateUserAccessControlsController(
  new UpdateUserAccessControlsUseCase(userRepository, accessControlRepository),
  UpdateUserAccessControlsValidatorFactory.create(),
);
const listUserAccessControlsController = new ListUserAccessControlsController(
  new ListUserAccessControlsUseCase(userRepository, accessControlRepository),
);
const listUserOrganizationAccessesController = new ListUserOrganizationAccessesController(
  new ListUserOrganizationAccessesUseCase(
    userRepository,
    userOrganizationContextService,
  ),
);
const updateUserOrganizationAccessesController = new UpdateUserOrganizationAccessesController(
  new UpdateUserOrganizationAccessesUseCase(userRepository, userOrganizationAccessRepository),
  UpdateUserOrganizationAccessesValidatorFactory.create(),
);

userRoutes.get('/users', isAutenticated, requirePermission('users:read'), listUserController.handle);
userRoutes.post(
  '/users',
  isAutenticated,
  requirePermission('users:create'),
  auditRoute({
    module: 'users',
    action: 'create_user',
    entityType: 'user',
    entityUuid: ({ responseBody }) => (responseBody as { uuid?: string } | undefined)?.uuid ?? null,
    entityId: ({ responseBody }) => (responseBody as { id?: number | string } | undefined)?.id ?? null,
    summary: ({ status }) =>
      status === 'success' ? 'Usuario criado com sucesso.' : 'Falha ao criar usuario.',
  }),
  createUserController.handle,
);
userRoutes.post(
  '/session',
  auditRoute({
    module: 'auth',
    action: 'login',
    entityType: 'user',
    entityUuid: ({ responseBody }) => (responseBody as { id?: string } | undefined)?.id ?? null,
    targetOrganizationId: ({ responseBody }) =>
      (responseBody as { activeOrganizationId?: number | null } | undefined)?.activeOrganizationId ?? null,
    summary: ({ status }) =>
      status === 'success' ? 'Login realizado com sucesso.' : 'Falha na tentativa de login.',
  }),
  authUserController.handle,
);
userRoutes.post(
  '/password/forgot',
  auditRoute({
    module: 'auth',
    action: 'request_password_reset',
    entityType: 'user',
    entityUuid: ({ req }) =>
      typeof req.auditContext?.userUuid === 'string' ? req.auditContext.userUuid : null,
    targetOrganizationId: ({ req }) =>
      typeof req.auditContext?.organizationId === 'number' ? req.auditContext.organizationId : null,
    summary: ({ status }) =>
      status === 'success'
        ? 'Solicitacao de redefinicao de senha registrada.'
        : 'Falha ao solicitar redefinicao de senha.',
    afterData: ({ req, responseBody }) => ({
      ...responseBody as Record<string, unknown>,
      matchedUser:
        typeof req.auditContext?.matchedUser === 'boolean'
          ? req.auditContext.matchedUser
          : false,
    }),
  }),
  requestPasswordResetController.handle,
);
userRoutes.post(
  '/password/reset',
  auditRoute({
    module: 'auth',
    action: 'confirm_password_reset',
    entityType: 'user',
    entityUuid: ({ req }) =>
      typeof req.auditContext?.userUuid === 'string' ? req.auditContext.userUuid : null,
    targetOrganizationId: ({ req }) =>
      typeof req.auditContext?.organizationId === 'number' ? req.auditContext.organizationId : null,
    summary: ({ status }) =>
      status === 'success'
        ? 'Senha redefinida com sucesso.'
        : 'Falha ao redefinir senha.',
    afterData: ({ responseBody }) => responseBody,
  }),
  confirmPasswordResetController.handle,
);
userRoutes.get('/users/:uuid', isAutenticated, requirePermission('users:read'), detailUserController.handle);
userRoutes.get(
  '/users/:userUuid/access-controls',
  isAutenticated,
  requirePermission('settings:read'),
  listUserAccessControlsController.handle,
);
userRoutes.put(
  '/users/:userUuid/access-controls',
  isAutenticated,
  requirePermission('settings:update'),
  auditRoute({
    module: 'settings',
    action: 'update_user_access_controls',
    entityType: 'user',
    entityUuid: ({ req }) => req.params.userUuid,
    afterData: ({ req }) => ({
      groupUuids: Array.isArray(req.body?.groupUuids) ? req.body.groupUuids : [],
    }),
    summary: ({ status }) =>
      status === 'success'
        ? 'Controles de acesso do usuario atualizados.'
        : 'Falha ao atualizar controles de acesso do usuario.',
  }),
  updateUserAccessControlsController.handle,
);
userRoutes.get(
  '/users/:userUuid/organization-accesses',
  isAutenticated,
  requirePermission('users:read'),
  listUserOrganizationAccessesController.handle,
);
userRoutes.put(
  '/users/:userUuid/organization-accesses',
  isAutenticated,
  requirePermission('users:update'),
  auditRoute({
    module: 'settings',
    action: 'update_user_organization_accesses',
    entityType: 'user',
    entityUuid: ({ req }) => req.params.userUuid,
    afterData: ({ req }) => req.body,
    summary: ({ status }) =>
      status === 'success'
        ? 'Acessos organizacionais do usuario atualizados.'
        : 'Falha ao atualizar acessos organizacionais do usuario.',
  }),
  updateUserOrganizationAccessesController.handle,
);

export { userRoutes };
