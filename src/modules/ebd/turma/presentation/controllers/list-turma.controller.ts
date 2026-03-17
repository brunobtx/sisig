import { Request, Response } from 'express';
import { TurmaFilters } from '../../domain/repositories/turma.repository';
import { ListTurmaUseCase } from '../../application/use-cases/list-turma.use-case';

export class ListTurmaController {
  constructor(private readonly useCase: ListTurmaUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const id_class = req.query.id_class ? Number(req.query.id_class) : undefined;
    const id_academic_year = req.query.id_academic_year
      ? Number(req.query.id_academic_year)
      : undefined;

    const filters: TurmaFilters = {};
    if (!Number.isNaN(id_class) && id_class) {
      filters.id_class = id_class;
    }
    if (!Number.isNaN(id_academic_year) && id_academic_year) {
      filters.id_academic_year = id_academic_year;
    }

    const hasFilters = Object.keys(filters).length > 0;
    const turmas = await this.useCase.execute(hasFilters ? filters : undefined);
    return res.status(200).json(turmas);
  };
}
