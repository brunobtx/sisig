import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { TurmaOutputMapper } from '../../application/dtos/turma-output.dto';
import { CreateTurmaUseCase } from '../../application/use-cases/create-turma.use-case';
import { TurmaValidator } from '../validators/turma.validator';

export class CreateTurmaController {
  constructor(
    private readonly useCase: CreateTurmaUseCase,
    private readonly validator: TurmaValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const turma = await this.useCase.execute(req.body);
      return res.status(201).json(TurmaOutputMapper.toOutput(turma));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
