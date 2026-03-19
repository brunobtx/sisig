import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { ClassSessionOutputMapper } from '../../application/dtos/class-session-output.dto';
import { CreateClassSessionUseCase } from '../../application/use-cases/create-class-session.use-case';
import { ClassSessionValidator } from '../validators/class-session.validator';
import { UserRepository } from '../../../../people/user/domain/repositories/user.repository';

export class CreateClassSessionController {
  constructor(
    private readonly useCase: CreateClassSessionUseCase,
    private readonly validator: ClassSessionValidator,
    private readonly userRepository?: UserRepository,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body?.id_person && this.userRepository && req.userId) {
      const user = await this.userRepository.findByUuid(req.userId);
      if (user) {
        req.body.id_person = user.id_person;
      }
    }

    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const session = await this.useCase.execute(req.body, req.activeOrganizationId);
      return res.status(201).json(ClassSessionOutputMapper.toOutput(session));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
