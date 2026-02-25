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

const userRoutes = Router();
const userRepository = new PrismaUserRepository();
const personRepository = new PrismaPersonRepository();
const passwordResetTokenRepository = new PrismaPasswordResetTokenRepository();
const passwordResetMailer = new ConsolePasswordResetMailer();

const createUserController = new CreateUserController(
  new CreateUserUseCase(userRepository),
  UserValidatorFactory.create(),
);

const listUserController = new ListUserController(
  new ListUserUseCase(userRepository, personRepository),
);

const authUserController = new AuthUserController(
  new AuthUserUseCase(personRepository, userRepository),
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
  ),
);
const confirmPasswordResetController = new ConfirmPasswordResetController(
  new ConfirmUserPasswordResetUseCase(userRepository, passwordResetTokenRepository),
);

userRoutes.get('/users', isAutenticated, requirePermission('users:read'), listUserController.handle);
userRoutes.post('/users', isAutenticated, requirePermission('users:create'), createUserController.handle);
userRoutes.post('/session', authUserController.handle);
userRoutes.post('/password/forgot', requestPasswordResetController.handle);
userRoutes.post('/password/reset', confirmPasswordResetController.handle);
userRoutes.get('/users/:uuid', isAutenticated, requirePermission('users:read'), detailUserController.handle);

export { userRoutes };
