import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { CreateClassSessionUseCase } from '../../application/use-cases/create-class-session.use-case';
import { PrismaClassSessionRepository } from '../../infra/repositories/prisma-class-session.repository';
import { CreateClassSessionController } from '../controllers/create-class-session.controller';
import { ClassSessionValidatorFactory } from '../validators/class-session.validator';

const classSessionRoutes = Router();

const repository = new PrismaClassSessionRepository();
const createClassSessionController = new CreateClassSessionController(
  new CreateClassSessionUseCase(repository),
  ClassSessionValidatorFactory.create(),
);

classSessionRoutes.use(isAutenticated);

classSessionRoutes.post('/class-session', requirePermission('school:create'), createClassSessionController.handle);

export { classSessionRoutes };
