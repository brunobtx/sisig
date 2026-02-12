import { Router } from 'express';
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

classSessionRoutes.post('/class-session', createClassSessionController.handle);

export { classSessionRoutes };
