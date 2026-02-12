import { Router } from 'express';
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

studentRoutes.post('/student', createStudentController.handle);

export { studentRoutes };
