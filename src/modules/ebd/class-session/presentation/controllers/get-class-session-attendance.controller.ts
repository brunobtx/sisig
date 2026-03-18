import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { GetClassSessionAttendanceUseCase } from '../../application/use-cases/get-class-session-attendance.use-case';

export class GetClassSessionAttendanceController {
  constructor(private readonly useCase: GetClassSessionAttendanceUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id_class_session = Number(req.params.id);
      const attendance = await this.useCase.execute(id_class_session, req.activeOrganizationId);
      return res.status(200).json(attendance);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
