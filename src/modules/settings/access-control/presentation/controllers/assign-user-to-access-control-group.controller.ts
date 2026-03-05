import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { AssignUserToAccessControlGroupUseCase } from '../../application/use-cases/assign-user-to-access-control-group.use-case';

export class AssignUserToAccessControlGroupController {
  constructor(private readonly useCase: AssignUserToAccessControlGroupUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const { groupUuid, userUuid } = req.params;

    try {
      await this.useCase.execute({ groupUuid, userUuid });
      return res.status(204).send();
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
