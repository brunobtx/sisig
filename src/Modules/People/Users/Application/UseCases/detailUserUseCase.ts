import { PrismaUserRepository } from "../../Domain/Repository/userRepository";
import { UserOutput } from "../Dto/userOutput";
import { BadRequestError } from "../../../../../Common/Application/Errors/badRequestError";
import { PrismaPersonRepository } from "../../../People/Domain/Repository/personRepository";

export class DetailUserService {
  private repository: PrismaUserRepository;
  private personRepository: PrismaPersonRepository;

  constructor() {
    this.repository = new PrismaUserRepository();
    this.personRepository = new PrismaPersonRepository();
  }

  async execute(userId: string): Promise<UserOutput> {
    const user = await this.repository.findByUuid(userId);

    if (!user) {
      throw new BadRequestError("Usuário não encontrado");
    }
    const person = await this.personRepository.findById(user.id_person);

    return {
      uuid: user.uuid,
      email: person.email,
      situacao: person.situacao
    };
  }
}
