import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
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

classRoutes.use(isAutenticated);

classRoutes.post('/class', requirePermission('school:create'), createClassController.handle);
classRoutes.post('/class/teacher', requirePermission('school:update'), addTeacherToClassController.handle);
classRoutes.post('/class/student', requirePermission('school:update'), addStudentToClassController.handle);

export { classRoutes };
