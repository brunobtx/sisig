import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { CreateAcademicPeriodUseCase } from '../../application/use-cases/create-academic-period.use-case';
import { CreateAcademicYearUseCase } from '../../application/use-cases/create-academic-year.use-case';
import { ListAcademicYearUseCase } from '../../application/use-cases/list-academic-year.use-case';
import { PrismaAcademicYearRepository } from '../../infra/repositories/prisma-academic-year.repository';
import { CreateAcademicPeriodController } from '../controllers/create-academic-period.controller';
import { CreateAcademicYearController } from '../controllers/create-academic-year.controller';
import { ListAcademicYearController } from '../controllers/list-academic-year.controller';
import { AcademicPeriodValidatorFactory } from '../validators/academic-period.validator';
import { AcademicYearValidatorFactory } from '../validators/academic-year.validator';
import { PrismaUserRepository } from '../../../../people/user/infra/repositories/prisma-user.repository';

const academicYearRoutes = Router();

const repository = new PrismaAcademicYearRepository();
const userRepository = new PrismaUserRepository();

const createAcademicYearController = new CreateAcademicYearController(
  new CreateAcademicYearUseCase(repository),
  AcademicYearValidatorFactory.create(),
  userRepository,
);

const createAcademicPeriodController = new CreateAcademicPeriodController(
  new CreateAcademicPeriodUseCase(repository),
  AcademicPeriodValidatorFactory.create(),
  userRepository,
);

const listAcademicYearController = new ListAcademicYearController(
  new ListAcademicYearUseCase(repository),
);

academicYearRoutes.use(isAutenticated);

academicYearRoutes.post('/academic-year', requirePermission('school:create'), createAcademicYearController.handle);
academicYearRoutes.get('/academic-year', requirePermission('school:read'), listAcademicYearController.handle);
academicYearRoutes.post('/academic-period', requirePermission('school:create'), createAcademicPeriodController.handle);

export { academicYearRoutes };
