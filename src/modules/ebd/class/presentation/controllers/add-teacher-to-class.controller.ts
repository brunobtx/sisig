import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { AddTeacherToClassUseCase } from '../../application/use-cases/add-teacher-to-class.use-case';

export class AddTeacherToClassController {
  constructor(private readonly useCase: AddTeacherToClassUseCase) {}

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
