import { Router } from 'express';
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

teacherRoutes.post('/teacher', createTeacherController.handle);

export { teacherRoutes };
