import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { AcademicYearOutputMapper } from '../../application/dtos/academic-year-output.dto';
import { CreateAcademicYearUseCase } from '../../application/use-cases/create-academic-year.use-case';
import { AcademicYearValidator } from '../validators/academic-year.validator';
import { UserRepository } from '../../../../people/user/domain/repositories/user.repository';

export class CreateAcademicYearController {
  constructor(
    private readonly useCase: CreateAcademicYearUseCase,
    private readonly validator: AcademicYearValidator,
    private readonly userRepository?: UserRepository,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body?.id_person_create && this.userRepository && req.userId) {
      const user = await this.userRepository.findByUuid(req.userId, req.activeOrganizationId);
      if (user) {
        req.body.id_person_create = user.id_person;
      }
    }

    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const academicYear = await this.useCase.execute(req.body, req.activeOrganizationId);
      return res.status(201).json(AcademicYearOutputMapper.toAcademicYearOutput(academicYear));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
