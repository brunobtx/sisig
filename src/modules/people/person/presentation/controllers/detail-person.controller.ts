import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { DetailPersonUseCase } from '../../application/use-cases/detail-person.use-case';

export class DetailPersonController {
  constructor(private readonly useCase: DetailPersonUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const uuid = req.params.uuid;

    if (!uuid) {
      return res.status(400).json({ message: 'UUID inválido' });
    }

    try {
      const person = await this.useCase.execute(uuid);
      return res.status(200).json(person);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
