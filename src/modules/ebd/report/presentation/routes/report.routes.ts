import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { GetSchoolAttendanceReportUseCase } from '../../application/use-cases/get-school-attendance-report.use-case';
import { PrismaSchoolReportRepository } from '../../infra/repositories/prisma-school-report.repository';
import { GetSchoolAttendanceReportController } from '../controllers/get-school-attendance-report.controller';

const reportRoutes = Router();

const repository = new PrismaSchoolReportRepository();
const getSchoolAttendanceReportController = new GetSchoolAttendanceReportController(
  new GetSchoolAttendanceReportUseCase(repository),
);

reportRoutes.use(isAutenticated);

reportRoutes.get(
  '/school-report/attendance',
  requirePermission('school:read'),
  getSchoolAttendanceReportController.handle,
);

export { reportRoutes };
