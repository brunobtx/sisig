import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { ClassSessionOutputMapper } from '../../application/dtos/class-session-output.dto';
import { CreateClassSessionUseCase } from '../../application/use-cases/create-class-session.use-case';
import { ClassSessionValidator } from '../validators/class-session.validator';

export class CreateClassSessionController {
  constructor(
    private readonly useCase: CreateClassSessionUseCase,
    private readonly validator: ClassSessionValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const session = await this.useCase.execute(req.body);
      return res.status(201).json(ClassSessionOutputMapper.toOutput(session));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
