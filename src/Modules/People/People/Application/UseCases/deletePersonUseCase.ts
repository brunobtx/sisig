import { BadRequestError } from "../../../../../Common/Application/Errors/badRequestError";
import { PrismaPersonRepository } from "../../Domain/Repository/personRepository";
import { PersonOutput } from "../Dto/personOutput";

export class DeletePersonService {
  private repository: PrismaPersonRepository;

  constructor() {
    this.repository = new PrismaPersonRepository();
  }

  async execute(uuid: string): Promise<PersonOutput> {
    const person = await this.repository.findByUUID(uuid);
    if (!person) {
      throw new BadRequestError("Pessoa não encontrada");
    }

    await this.repository.inactivatePerson(uuid);

    return {
      id: person.uuid,
      name: person.name,
      email: person.email,
      cpf: person.cpf,
      situacao: person.situacao,
    };
  }
}