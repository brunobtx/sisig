import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { LessonOutputMapper } from '../../application/dtos/lesson-output.dto';
import { CreateLessonUseCase } from '../../application/use-cases/create-lesson.use-case';
import { LessonValidator } from '../validators/lesson.validator';

export class CreateLessonController {
  constructor(
    private readonly useCase: CreateLessonUseCase,
    private readonly validator: LessonValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const lesson = await this.useCase.execute(req.body, req.activeOrganizationId);
      return res.status(201).json(LessonOutputMapper.toOutput(lesson));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
