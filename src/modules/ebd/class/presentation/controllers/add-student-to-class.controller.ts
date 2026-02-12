import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { AddStudentToClassUseCase } from '../../application/use-cases/add-student-to-class.use-case';

export class AddStudentToClassController {
  constructor(private readonly useCase: AddStudentToClassUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const relation = await this.useCase.execute(req.body);
      return res.status(200).json(relation);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
