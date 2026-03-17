import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { ListClassSessionByTurmaUseCase } from '../../application/use-cases/list-class-session-by-turma.use-case';

export class ListClassSessionByTurmaController {
  constructor(private readonly useCase: ListClassSessionByTurmaUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id_turma = Number(req.params.id);
      const sessions = await this.useCase.execute(id_turma);
      return res.status(200).json(sessions);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
