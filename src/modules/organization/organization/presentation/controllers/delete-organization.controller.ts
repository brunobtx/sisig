import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { DeleteOrganizationUseCase } from '../../application/use-cases/delete-organization.use-case';

export class DeleteOrganizationController {
  constructor(private readonly useCase: DeleteOrganizationUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const uuid: string = req.params.uuid;
      const organization = await this.useCase.execute(uuid);
      return res.status(200).json(organization);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
