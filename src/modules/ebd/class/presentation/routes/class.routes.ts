import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { CreateClassUseCase } from '../../application/use-cases/create-class.use-case';
import { ListClassUseCase } from '../../application/use-cases/list-class.use-case';
import { PrismaClassRepository } from '../../infra/repositories/prisma-class.repository';
import { CreateClassController } from '../controllers/create-class.controller';
import { ListClassController } from '../controllers/list-class.controller';
import { ClassValidatorFactory } from '../validators/class.validator';

const classRoutes = Router();
const classRepository = new PrismaClassRepository();

const createClassController = new CreateClassController(
  new CreateClassUseCase(classRepository),
  ClassValidatorFactory.create(),
);

const listClassController = new ListClassController(new ListClassUseCase(classRepository));

classRoutes.use(isAutenticated);

classRoutes.post('/class', requirePermission('school:create'), createClassController.handle);
classRoutes.get('/class', requirePermission('school:read'), listClassController.handle);

export { classRoutes };
