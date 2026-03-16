import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { CreateTeacherUseCase } from '../../application/use-cases/create-teacher.use-case';
import { ListTeacherUseCase } from '../../application/use-cases/list-teacher.use-case';
import { PrismaTeacherRepository } from '../../infra/repositories/prisma-teacher.repository';
import { CreateTeacherController } from '../controllers/create-teacher.controller';
import { ListTeacherController } from '../controllers/list-teacher.controller';
import { TeacherValidatorFactory } from '../validators/teacher.validator';

const teacherRoutes = Router();

const repository = new PrismaTeacherRepository();
const createTeacherController = new CreateTeacherController(
  new CreateTeacherUseCase(repository),
  TeacherValidatorFactory.create(),
);
const listTeacherController = new ListTeacherController(new ListTeacherUseCase(repository));

teacherRoutes.use(isAutenticated);

teacherRoutes.post('/teacher', requirePermission('school:create'), createTeacherController.handle);
teacherRoutes.get('/teacher', requirePermission('school:read'), listTeacherController.handle);

export { teacherRoutes };
