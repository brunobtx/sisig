import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { PersonOutputMapper } from '../../application/dtos/person-output.dto';
import { CreatePersonUseCase } from '../../application/use-cases/create-person.use-case';
import { PersonValidator } from '../validators/person.validator';

export class CreatePersonController {
  constructor(
    private readonly useCase: CreatePersonUseCase,
    private readonly validator: PersonValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const person = await this.useCase.execute(req.body, req.activeOrganizationId);
      return res.status(201).json(PersonOutputMapper.toOutput(person));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
