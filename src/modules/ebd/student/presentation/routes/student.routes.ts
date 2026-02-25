import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { CreateStudentUseCase } from '../../application/use-cases/create-student.use-case';
import { PrismaStudentRepository } from '../../infra/repositories/prisma-student.repository';
import { CreateStudentController } from '../controllers/create-student.controller';
import { StudentValidatorFactory } from '../validators/student.validator';

const studentRoutes = Router();

const repository = new PrismaStudentRepository();
const createStudentController = new CreateStudentController(
  new CreateStudentUseCase(repository),
  StudentValidatorFactory.create(),
);

studentRoutes.use(isAutenticated);

studentRoutes.post('/student', requirePermission('school:create'), createStudentController.handle);

export { studentRoutes };
