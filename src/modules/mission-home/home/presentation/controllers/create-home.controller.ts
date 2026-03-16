import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { HomeOutputMapper } from '../../application/dtos/home-output.dto';
import { CreateHomeUseCase } from '../../application/use-cases/create-home.use-case';
import { HomeValidator } from '../validators/home.validator';

export class CreateHomeController {
  constructor(
    private readonly useCase: CreateHomeUseCase,
    private readonly validator: HomeValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const entity = await this.useCase.execute(req.body);
      return res.status(201).json(HomeOutputMapper.toOutput(entity));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
