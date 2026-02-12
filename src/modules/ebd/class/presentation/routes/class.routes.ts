import { Router } from 'express';
import { AddStudentToClassUseCase } from '../../application/use-cases/add-student-to-class.use-case';
import { AddTeacherToClassUseCase } from '../../application/use-cases/add-teacher-to-class.use-case';
import { CreateClassUseCase } from '../../application/use-cases/create-class.use-case';
import { PrismaClassRepository } from '../../infra/repositories/prisma-class.repository';
import { AddStudentToClassController } from '../controllers/add-student-to-class.controller';
import { AddTeacherToClassController } from '../controllers/add-teacher-to-class.controller';
import { CreateClassController } from '../controllers/create-class.controller';
import { ClassValidatorFactory } from '../validators/class.validator';

const classRoutes = Router();
const classRepository = new PrismaClassRepository();

const createClassController = new CreateClassController(
  new CreateClassUseCase(classRepository),
  ClassValidatorFactory.create(),
);

const addTeacherToClassController = new AddTeacherToClassController(
  new AddTeacherToClassUseCase(classRepository),
);

const addStudentToClassController = new AddStudentToClassController(
  new AddStudentToClassUseCase(classRepository),
);

classRoutes.post('/class', createClassController.handle);
classRoutes.post('/class/teacher', addTeacherToClassController.handle);
classRoutes.post('/class/student', addStudentToClassController.handle);

export { classRoutes };
