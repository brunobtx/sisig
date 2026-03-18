import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { AddStudentToTurmaUseCase } from '../../application/use-cases/add-student-to-turma.use-case';

export class AddStudentToTurmaController {
  constructor(private readonly useCase: AddStudentToTurmaUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const relation = await this.useCase.execute(req.body, req.activeOrganizationId);
      return res.status(200).json(relation);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
