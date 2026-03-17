import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { AddStudentToTurmaUseCase } from '../../application/use-cases/add-student-to-turma.use-case';
import { AddTeacherToTurmaUseCase } from '../../application/use-cases/add-teacher-to-turma.use-case';
import { CreateTurmaUseCase } from '../../application/use-cases/create-turma.use-case';
import { ListTurmaStudentsUseCase } from '../../application/use-cases/list-turma-students.use-case';
import { ListTurmaTeachersUseCase } from '../../application/use-cases/list-turma-teachers.use-case';
import { ListTurmaUseCase } from '../../application/use-cases/list-turma.use-case';
import { PrismaStudentRepository } from '../../../student/infra/repositories/prisma-student.repository';
import { PrismaTeacherRepository } from '../../../teacher/infra/repositories/prisma-teacher.repository';
import { PrismaTurmaRepository } from '../../infra/repositories/prisma-turma.repository';
import { AddStudentToTurmaController } from '../controllers/add-student-to-turma.controller';
import { AddTeacherToTurmaController } from '../controllers/add-teacher-to-turma.controller';
import { CreateTurmaController } from '../controllers/create-turma.controller';
import { ListTurmaStudentsController } from '../controllers/list-turma-students.controller';
import { ListTurmaTeachersController } from '../controllers/list-turma-teachers.controller';
import { ListTurmaController } from '../controllers/list-turma.controller';
import { TurmaValidatorFactory } from '../validators/turma.validator';

const turmaRoutes = Router();
const turmaRepository = new PrismaTurmaRepository();
const teacherRepository = new PrismaTeacherRepository();
const studentRepository = new PrismaStudentRepository();

const createTurmaController = new CreateTurmaController(
  new CreateTurmaUseCase(turmaRepository),
  TurmaValidatorFactory.create(),
);

const addTeacherToTurmaController = new AddTeacherToTurmaController(
  new AddTeacherToTurmaUseCase(turmaRepository, teacherRepository),
);

const addStudentToTurmaController = new AddStudentToTurmaController(
  new AddStudentToTurmaUseCase(turmaRepository, studentRepository),
);

const listTurmaController = new ListTurmaController(new ListTurmaUseCase(turmaRepository));

const listTurmaTeachersController = new ListTurmaTeachersController(
  new ListTurmaTeachersUseCase(turmaRepository),
);

const listTurmaStudentsController = new ListTurmaStudentsController(
  new ListTurmaStudentsUseCase(turmaRepository),
);

turmaRoutes.use(isAutenticated);

turmaRoutes.post('/turma', requirePermission('school:create'), createTurmaController.handle);
turmaRoutes.get('/turma', requirePermission('school:read'), listTurmaController.handle);
turmaRoutes.post('/turma/teacher', requirePermission('school:update'), addTeacherToTurmaController.handle);
turmaRoutes.post('/turma/student', requirePermission('school:update'), addStudentToTurmaController.handle);
turmaRoutes.get('/turma/:id/teachers', requirePermission('school:read'), listTurmaTeachersController.handle);
turmaRoutes.get('/turma/:id/students', requirePermission('school:read'), listTurmaStudentsController.handle);

export { turmaRoutes };
