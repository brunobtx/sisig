import { Request, Response } from 'express';
import { ListTeacherUseCase } from '../../application/use-cases/list-teacher.use-case';

export class ListTeacherController {
  constructor(private readonly useCase: ListTeacherUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const teachers = await this.useCase.execute(req.activeOrganizationId);
    return res.status(200).json(teachers);
  };
}
