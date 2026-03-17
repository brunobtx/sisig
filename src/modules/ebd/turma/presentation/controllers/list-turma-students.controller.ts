import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { ListTurmaStudentsUseCase } from '../../application/use-cases/list-turma-students.use-case';

export class ListTurmaStudentsController {
  constructor(private readonly useCase: ListTurmaStudentsUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id_turma = Number(req.params.id);
      const relations = await this.useCase.execute(id_turma);
      return res.status(200).json(relations);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
