import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { AddStudentToClassUseCase } from '../../application/use-cases/add-student-to-class.use-case';
import { AddTeacherToClassUseCase } from '../../application/use-cases/add-teacher-to-class.use-case';
import { CreateClassUseCase } from '../../application/use-cases/create-class.use-case';
import { ListClassUseCase } from '../../application/use-cases/list-class.use-case';
import { ListClassStudentsUseCase } from '../../application/use-cases/list-class-students.use-case';
import { ListClassTeachersUseCase } from '../../application/use-cases/list-class-teachers.use-case';
import { PrismaClassRepository } from '../../infra/repositories/prisma-class.repository';
import { AddStudentToClassController } from '../controllers/add-student-to-class.controller';
import { AddTeacherToClassController } from '../controllers/add-teacher-to-class.controller';
import { CreateClassController } from '../controllers/create-class.controller';
import { ListClassController } from '../controllers/list-class.controller';
import { ListClassStudentsController } from '../controllers/list-class-students.controller';
import { ListClassTeachersController } from '../controllers/list-class-teachers.controller';
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

const listClassController = new ListClassController(new ListClassUseCase(classRepository));

const listClassTeachersController = new ListClassTeachersController(
  new ListClassTeachersUseCase(classRepository),
);

const listClassStudentsController = new ListClassStudentsController(
  new ListClassStudentsUseCase(classRepository),
);

classRoutes.use(isAutenticated);

classRoutes.post('/class', requirePermission('school:create'), createClassController.handle);
classRoutes.get('/class', requirePermission('school:read'), listClassController.handle);
classRoutes.post('/class/teacher', requirePermission('school:update'), addTeacherToClassController.handle);
classRoutes.post('/class/student', requirePermission('school:update'), addStudentToClassController.handle);
classRoutes.get('/class/:id/teachers', requirePermission('school:read'), listClassTeachersController.handle);
classRoutes.get('/class/:id/students', requirePermission('school:read'), listClassStudentsController.handle);

export { classRoutes };
