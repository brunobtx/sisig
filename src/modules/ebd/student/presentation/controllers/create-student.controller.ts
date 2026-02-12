import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { StudentOutputMapper } from '../../application/dtos/student-output.dto';
import { CreateStudentUseCase } from '../../application/use-cases/create-student.use-case';
import { StudentValidator } from '../validators/student.validator';

export class CreateStudentController {
  constructor(
    private readonly useCase: CreateStudentUseCase,
    private readonly validator: StudentValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const student = await this.useCase.execute(req.body);
      return res.status(201).json(StudentOutputMapper.toOutput(student));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
