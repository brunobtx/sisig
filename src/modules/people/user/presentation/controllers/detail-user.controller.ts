import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { DetailUserUseCase } from '../../application/use-cases/detail-user.use-case';

export class DetailUserController {
  constructor(private readonly useCase: DetailUserUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.uuid;

    try {
      const user = await this.useCase.execute(userId, req.activeOrganizationId);
      return res.status(200).json(user);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
