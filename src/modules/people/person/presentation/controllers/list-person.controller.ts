import { Request, Response } from 'express';
import { ListPersonUseCase } from '../../application/use-cases/list-person.use-case';

export class ListPersonController {
  constructor(private readonly useCase: ListPersonUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const people = await this.useCase.execute(req.activeOrganizationId);

    if (req.query.view === 'summary') {
      return res.status(200).json(
        people.map((person) => ({
          uuid: person.uuid,
          id: person.id,
          id_organization: person.id_organization ?? null,
          name: person.name,
          situacao: person.situacao,
        })),
      );
    }

    return res.status(200).json(people);
  };
}
