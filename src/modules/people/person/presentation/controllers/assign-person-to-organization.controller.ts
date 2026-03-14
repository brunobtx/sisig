import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { PersonOutputMapper } from '../../application/dtos/person-output.dto';
import { AssignPersonToOrganizationUseCase } from '../../application/use-cases/assign-person-to-organization.use-case';

export class AssignPersonToOrganizationController {
  constructor(private readonly useCase: AssignPersonToOrganizationUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const { personUuid, organizationUuid } = req.params;

    try {
      const person = await this.useCase.execute({ personUuid, organizationUuid });
      return res.status(200).json(PersonOutputMapper.toOutput(person));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
