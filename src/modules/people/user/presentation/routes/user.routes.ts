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

const userRoutes = Router();
const userRepository = new PrismaUserRepository();
const personRepository = new PrismaPersonRepository();

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

userRoutes.get('/users', isAutenticated, requirePermission('users:read'), listUserController.handle);
userRoutes.post('/users', isAutenticated, requirePermission('users:create'), createUserController.handle);
userRoutes.post('/session', authUserController.handle);
userRoutes.get('/users/:uuid', isAutenticated, requirePermission('users:read'), detailUserController.handle);

export { userRoutes };
