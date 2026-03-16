import { Request, Response } from 'express';
import { ListClassUseCase } from '../../application/use-cases/list-class.use-case';

export class ListClassController {
  constructor(private readonly useCase: ListClassUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const academicYearId = req.query.academicYearId
      ? Number(req.query.academicYearId)
      : undefined;

    const classes = await this.useCase.execute(
      Number.isNaN(academicYearId) ? undefined : academicYearId,
    );
    return res.status(200).json(classes);
  };
}
