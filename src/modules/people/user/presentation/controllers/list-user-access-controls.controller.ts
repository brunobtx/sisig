import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { ListUserAccessControlsUseCase } from '../../application/use-cases/list-user-access-controls.use-case';

export class ListUserAccessControlsController {
  constructor(private readonly useCase: ListUserAccessControlsUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const { userUuid } = req.params;

    try {
      const output = await this.useCase.execute(userUuid, req.activeOrganizationId);
      return res.status(200).json(output);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
