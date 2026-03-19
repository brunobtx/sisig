import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { AcademicYearOutputMapper } from '../../application/dtos/academic-year-output.dto';
import { CreateAcademicPeriodUseCase } from '../../application/use-cases/create-academic-period.use-case';
import { AcademicPeriodValidator } from '../validators/academic-period.validator';
import { UserRepository } from '../../../../people/user/domain/repositories/user.repository';

export class CreateAcademicPeriodController {
  constructor(
    private readonly useCase: CreateAcademicPeriodUseCase,
    private readonly validator: AcademicPeriodValidator,
    private readonly userRepository?: UserRepository,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body?.id_person_create && this.userRepository && req.userId) {
      const user = await this.userRepository.findByUuid(req.userId);
      if (user) {
        req.body.id_person_create = user.id_person;
      }
    }

    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const academicPeriod = await this.useCase.execute(req.body, req.activeOrganizationId);
      return res.status(201).json(AcademicYearOutputMapper.toAcademicPeriodOutput(academicPeriod));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
