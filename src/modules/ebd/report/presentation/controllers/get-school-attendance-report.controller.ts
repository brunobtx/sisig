import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { GetSchoolAttendanceReportUseCase } from '../../application/use-cases/get-school-attendance-report.use-case';

export class GetSchoolAttendanceReportController {
  constructor(private readonly useCase: GetSchoolAttendanceReportUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id_academic_year = Number(req.query.id_academic_year);
      const trimester = req.query.trimester ? Number(req.query.trimester) : undefined;
      const id_turma = req.query.id_turma ? Number(req.query.id_turma) : undefined;

      const report = await this.useCase.execute({
        id_academic_year,
        trimester,
        id_turma,
      }, req.activeOrganizationId);

      return res.status(200).json(report);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
