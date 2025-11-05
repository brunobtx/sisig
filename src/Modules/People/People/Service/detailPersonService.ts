import { PrismaPersonRepository } from "../Repository/personRepository";
import { PersonOutput } from "../Dto/personOutput";
import { BadRequestError } from "../../../../Common/Application/Errors/badRequestError";

export class DetailPersonService {
  private repository: PrismaPersonRepository;

  constructor() {
    this.repository = new PrismaPersonRepository();
  }

  async execute(id: number): Promise<PersonOutput> {
    const person = await this.repository.findById(id);

    if (!person) {
      throw new BadRequestError("Pessoa não encontrada");
    }

    return {
      id: person.id,
      name: person.name,
      cpf: person.cpf,
      email: person.email,
    };
  }
}
