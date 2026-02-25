import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { CreateTeacherUseCase } from '../../application/use-cases/create-teacher.use-case';
import { PrismaTeacherRepository } from '../../infra/repositories/prisma-teacher.repository';
import { CreateTeacherController } from '../controllers/create-teacher.controller';
import { TeacherValidatorFactory } from '../validators/teacher.validator';

const teacherRoutes = Router();

const repository = new PrismaTeacherRepository();
const createTeacherController = new CreateTeacherController(
  new CreateTeacherUseCase(repository),
  TeacherValidatorFactory.create(),
);

teacherRoutes.use(isAutenticated);

teacherRoutes.post('/teacher', requirePermission('school:create'), createTeacherController.handle);

export { teacherRoutes };
