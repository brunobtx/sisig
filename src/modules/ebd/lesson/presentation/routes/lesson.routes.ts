import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { CreateLessonUseCase } from '../../application/use-cases/create-lesson.use-case';
import { PrismaLessonRepository } from '../../infra/repositories/prisma-lesson.repository';
import { CreateLessonController } from '../controllers/create-lesson.controller';
import { LessonValidatorFactory } from '../validators/lesson.validator';
import { PrismaUserRepository } from '../../../../people/user/infra/repositories/prisma-user.repository';

const lessonRoutes = Router();

const repository = new PrismaLessonRepository();
const userRepository = new PrismaUserRepository();
const createLessonController = new CreateLessonController(
  new CreateLessonUseCase(repository),
  LessonValidatorFactory.create(),
  userRepository,
);

lessonRoutes.use(isAutenticated);

lessonRoutes.post('/lesson', requirePermission('school:create'), createLessonController.handle);

export { lessonRoutes };
