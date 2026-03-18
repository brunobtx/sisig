import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { TeacherOutputMapper } from '../../application/dtos/teacher-output.dto';
import { CreateTeacherUseCase } from '../../application/use-cases/create-teacher.use-case';
import { TeacherValidator } from '../validators/teacher.validator';

export class CreateTeacherController {
  constructor(
    private readonly useCase: CreateTeacherUseCase,
    private readonly validator: TeacherValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const teacher = await this.useCase.execute(req.body, req.activeOrganizationId);
      return res.status(201).json(TeacherOutputMapper.toOutput(teacher));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
