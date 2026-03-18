import { Request, Response } from 'express';
import { ListAcademicYearUseCase } from '../../application/use-cases/list-academic-year.use-case';

export class ListAcademicYearController {
  constructor(private readonly useCase: ListAcademicYearUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const years = await this.useCase.execute(req.activeOrganizationId);
    return res.status(200).json(years);
  };
}
