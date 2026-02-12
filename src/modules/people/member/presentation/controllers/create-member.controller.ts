import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { MemberOutputMapper } from '../../application/dtos/member-output.dto';
import { CreateMemberUseCase } from '../../application/use-cases/create-member.use-case';
import { MemberValidator } from '../validators/member.validator';

export class CreateMemberController {
  constructor(
    private readonly useCase: CreateMemberUseCase,
    private readonly validator: MemberValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const member = await this.useCase.execute(req.body);
      return res.status(201).json(MemberOutputMapper.toOutput(member));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
