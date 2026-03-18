import { Request, Response } from 'express';
import { ListStudentUseCase } from '../../application/use-cases/list-student.use-case';

export class ListStudentController {
  constructor(private readonly useCase: ListStudentUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const students = await this.useCase.execute(req.activeOrganizationId);
    return res.status(200).json(students);
  };
}
