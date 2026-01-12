import prismaClient from '../../../../../prisma';
import { PersonEntity, PersonProps } from '../../Domain/Entity/personEntity';
import { PersonInput } from '../Dto/personInput';
import { BadRequestError } from '../../../../../Common/Application/Errors/badRequestError';
import { PrismaPersonRepository } from '../../Domain/Repository/personRepository';

export class UpdatePersonService {
  private repository: PrismaPersonRepository;

  constructor() {
    this.repository = new PrismaPersonRepository();
  }

  async execute(id: string, data: PersonInput): Promise<PersonEntity> {
    const { name, cpf, email, phone, dt_nasc, sexo, situacao } = data;

    // 1️⃣ Verifica se a pessoa existe
    const existingPerson = await prismaClient.person.findUnique({
      where: { uuid: id }
    });
    if (!existingPerson) {
      throw new BadRequestError("Pessoa não encontrada!");
    }

    // 2️⃣ Verifica duplicados (ignorando o próprio registro)
    const emailAlreadyExists = await prismaClient.person.findFirst({
      where: { email, NOT: { uuid: id } }
    });
    if (emailAlreadyExists) {
        throw new BadRequestError("Email já existe!");
    }
    const personAlreadyExists = await prismaClient.person.findFirst({
      where: { cpf, NOT: { uuid: id } }
    });
    if (personAlreadyExists) {
        throw new BadRequestError("CPF já existe!");
    }

    // 3️⃣ Cria a Entity (sem gerar UUID novo)
    const personEntity = new PersonEntity(
      {
        name,
        cpf,
        email,
        phone,
        dt_nasc: new Date(dt_nasc),
        sexo,
        situacao,
        createdAt: existingPerson.created_at // mantém a data original
      } as PersonProps,
      existingPerson.uuid
    );

    // 4️⃣ Atualiza no banco usando repository
    const updated = await this.repository.update(personEntity);

    // 5️⃣ Retorna a Entity atualizada
    return updated;
  }
}
