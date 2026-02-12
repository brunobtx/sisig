import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { AcademicYearOutputMapper } from '../../application/dtos/academic-year-output.dto';
import { CreateAcademicYearUseCase } from '../../application/use-cases/create-academic-year.use-case';
import { AcademicYearValidator } from '../validators/academic-year.validator';

export class CreateAcademicYearController {
  constructor(
    private readonly useCase: CreateAcademicYearUseCase,
    private readonly validator: AcademicYearValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const academicYear = await this.useCase.execute(req.body);
      return res.status(201).json(AcademicYearOutputMapper.toAcademicYearOutput(academicYear));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
