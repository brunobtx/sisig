import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { ClassOutputMapper } from '../../application/dtos/class-output.dto';
import { CreateClassUseCase } from '../../application/use-cases/create-class.use-case';
import { ClassValidator } from '../validators/class.validator';

export class CreateClassController {
  constructor(
    private readonly useCase: CreateClassUseCase,
    private readonly validator: ClassValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const classe = await this.useCase.execute(req.body, req.activeOrganizationId);
      return res.status(201).json(ClassOutputMapper.toOutput(classe));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
