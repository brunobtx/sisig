import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { OrganizationOutputMapper } from '../../application/dtos/organization-output.dto';
import { UpdateOrganizationUseCase } from '../../application/use-cases/update-organization.use-case';
import { OrganizationValidator } from '../validators/organization.validator';

export class UpdateOrganizationController {
  constructor(
    private readonly useCase: UpdateOrganizationUseCase,
    private readonly validator: OrganizationValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const uuid = req.params.uuid;
    const input = req.body;

    if (!this.validator.validate(input)) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const entity = await this.useCase.execute(uuid, input);
      return res.status(200).json(OrganizationOutputMapper.toOutput(entity));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
