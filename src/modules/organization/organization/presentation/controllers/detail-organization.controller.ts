import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { DetailOrganizationUseCase } from '../../application/use-cases/detail-organization.use-case';

export class DetailOrganizationController {
  constructor(private readonly useCase: DetailOrganizationUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const uuid = req.params.uuid;

    if (!uuid) {
      return res.status(400).json({ message: 'UUID inválido' });
    }

    try {
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
