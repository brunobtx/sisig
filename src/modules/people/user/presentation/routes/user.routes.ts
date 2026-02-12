import { Router } from 'express';
import { isAutenticated } from '../../../../../Common/Middleware/isAuthenticated';
import { AuthUserUseCase } from '../../application/use-cases/auth-user.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { DetailUserUseCase } from '../../application/use-cases/detail-user.use-case';
import { PrismaPersonRepository } from '../../../person/infra/repositories/prisma-person.repository';
import { PrismaUserRepository } from '../../infra/repositories/prisma-user.repository';
import { AuthUserController } from '../controllers/auth-user.controller';
import { CreateUserController } from '../controllers/create-user.controller';
import { DetailUserController } from '../controllers/detail-user.controller';
import { UserValidatorFactory } from '../validators/user.validator';

const userRoutes = Router();
const userRepository = new PrismaUserRepository();
const personRepository = new PrismaPersonRepository();

const createUserController = new CreateUserController(
  new CreateUserUseCase(userRepository),
  UserValidatorFactory.create(),
);

const authUserController = new AuthUserController(
  new AuthUserUseCase(personRepository, userRepository),
);

const detailUserController = new DetailUserController(
  new DetailUserUseCase(userRepository, personRepository),
);

userRoutes.post('/users', isAutenticated, createUserController.handle);
userRoutes.post('/session', authUserController.handle);
userRoutes.get('/users/:uuid', isAutenticated, detailUserController.handle);

export { userRoutes };
