import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { AccessControlOutputMapper } from '../../application/dtos/access-control-output.dto';
import { CreateAccessControlUseCase } from '../../application/use-cases/create-access-control.use-case';
import { AccessControlValidator } from '../validators/access-control.validator';

export class CreateAccessControlController {
  constructor(
    private readonly useCase: CreateAccessControlUseCase,
    private readonly validator: AccessControlValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body);

    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const entity = await this.useCase.execute(req.body);
      return res.status(201).json(AccessControlOutputMapper.toOutput(entity));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
