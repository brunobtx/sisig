import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { CreateClassSessionUseCase } from '../../application/use-cases/create-class-session.use-case';
import { GetClassSessionAttendanceUseCase } from '../../application/use-cases/get-class-session-attendance.use-case';
import { ListClassSessionByTurmaUseCase } from '../../application/use-cases/list-class-session-by-turma.use-case';
import { SaveClassSessionAttendanceUseCase } from '../../application/use-cases/save-class-session-attendance.use-case';
import { PrismaClassSessionRepository } from '../../infra/repositories/prisma-class-session.repository';
import { CreateClassSessionController } from '../controllers/create-class-session.controller';
import { GetClassSessionAttendanceController } from '../controllers/get-class-session-attendance.controller';
import { ListClassSessionByTurmaController } from '../controllers/list-class-session-by-turma.controller';
import { SaveClassSessionAttendanceController } from '../controllers/save-class-session-attendance.controller';
import { ClassSessionValidatorFactory } from '../validators/class-session.validator';
import { PrismaUserRepository } from '../../../../people/user/infra/repositories/prisma-user.repository';

const classSessionRoutes = Router();

const repository = new PrismaClassSessionRepository();
const userRepository = new PrismaUserRepository();
const createClassSessionController = new CreateClassSessionController(
  new CreateClassSessionUseCase(repository),
  ClassSessionValidatorFactory.create(),
  userRepository,
);
const listClassSessionByTurmaController = new ListClassSessionByTurmaController(
  new ListClassSessionByTurmaUseCase(repository),
);
const getClassSessionAttendanceController = new GetClassSessionAttendanceController(
  new GetClassSessionAttendanceUseCase(repository),
);
const saveClassSessionAttendanceController = new SaveClassSessionAttendanceController(
  new SaveClassSessionAttendanceUseCase(repository),
);

classSessionRoutes.use(isAutenticated);

classSessionRoutes.post('/class-session', requirePermission('school:create'), createClassSessionController.handle);
classSessionRoutes.get(
  '/turma/:id/class-sessions',
  requirePermission('school:read'),
  listClassSessionByTurmaController.handle,
);
classSessionRoutes.get(
  '/class-session/:id/attendance',
  requirePermission('school:read'),
  getClassSessionAttendanceController.handle,
);
classSessionRoutes.put(
  '/class-session/:id/attendance',
  requirePermission('school:update'),
  saveClassSessionAttendanceController.handle,
);

export { classSessionRoutes };
