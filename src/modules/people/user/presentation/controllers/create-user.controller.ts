import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { UserOutputMapper } from '../../application/dtos/user-output.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UserValidator } from '../validators/user.validator';

export class CreateUserController {
  constructor(
    private readonly useCase: CreateUserUseCase,
    private readonly validator: UserValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body);

    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const user = await this.useCase.execute(req.body, req.activeOrganizationId);
      return res.status(201).json(UserOutputMapper.toCreateOutput(user));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
