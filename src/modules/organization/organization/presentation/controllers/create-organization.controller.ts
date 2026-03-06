import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { OrganizationOutputMapper } from '../../application/dtos/organization-output.dto';
import { CreateOrganizationUseCase } from '../../application/use-cases/create-organization.use-case';
import { OrganizationValidator } from '../validators/organization.validator';

export class CreateOrganizationController {
  constructor(
    private readonly useCase: CreateOrganizationUseCase,
    private readonly validator: OrganizationValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body);

    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const organization = await this.useCase.execute(req.body);
      return res.status(201).json(OrganizationOutputMapper.toOutput(organization));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
