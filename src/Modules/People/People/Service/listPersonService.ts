import { PrismaPersonRepository } from "../Repository/personRepository";
import { PersonOutput } from "../Dto/personOutput";

export class ListPersonService {
  private repository: PrismaPersonRepository;

  constructor() {
    this.repository = new PrismaPersonRepository();
  }

  async execute(): Promise<PersonOutput[]> {
    const people = await this.repository.findAll();

    return people.map(person => ({
      id: person.id,
      name: person.name,
      cpf: person.cpf,
      email: person.email,
      phone: person.phone,
      dt_nasc: person.dt_nasc,
      sexo: person.sexo,
      situacao: person.situacao,
      createdAt: person.createdAt,
    }));
  }
}
