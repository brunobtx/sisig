import { PersonRepository } from '../../Domain/Repository/personRepository';
import { PersonEntity, PersonProps } from '../../Domain/Entity/personEntity';
import { PersonInput } from '../Dto/personInput';

export class CreatePersonService {
  constructor(private repository: PersonRepository) {}

  async execute(data: PersonInput): Promise<PersonEntity> {
    const { name, cpf, email, phone, dt_nasc, sexo, situacao } = data;

    // 1️⃣ Verifica duplicados no banco via Repository
    if (await this.repository.emailExists(email)) {
      throw new Error("Email já existe!");
    }
    if (await this.repository.findByCpf(cpf)) {
      throw new Error("CPF já existe!");
    }

    // 2️⃣ Cria a Entity
    const personEntity = new PersonEntity({
      name,
      cpf,
      email,
      phone,
      dt_nasc: new Date(dt_nasc),
      sexo,
      situacao
    } as PersonProps);

    // 3️⃣ Salva usando o Repository
    return this.repository.create(personEntity);
  }
}
