import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { ListClassStudentsUseCase } from '../../application/use-cases/list-class-students.use-case';

export class ListClassStudentsController {
  constructor(private readonly useCase: ListClassStudentsUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id_class = Number(req.params.id);
      const relations = await this.useCase.execute(id_class);
      return res.status(200).json(relations);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
