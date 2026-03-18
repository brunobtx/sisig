import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { ListTurmaTeachersUseCase } from '../../application/use-cases/list-turma-teachers.use-case';

export class ListTurmaTeachersController {
  constructor(private readonly useCase: ListTurmaTeachersUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id_turma = Number(req.params.id);
      const relations = await this.useCase.execute(id_turma, req.activeOrganizationId);
      return res.status(200).json(relations);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
