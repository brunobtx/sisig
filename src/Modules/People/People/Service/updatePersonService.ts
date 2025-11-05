import prismaClient from '../../../../prisma';
import { PersonEntity, PersonProps } from '../Entity/personEntity';
import { PersonInput } from '../Dto/personInput';
import { BadRequestError } from '../../../../Common/Application/Errors/badRequestError';

export class UpdatePersonService {
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

    // 4️⃣ Atualiza no banco
    const updated = await prismaClient.person.update({
      where: { uuid: id },
      data: {
        name: personEntity.name,
        cpf: personEntity.cpf,
        email: personEntity.email,
        phone: personEntity.phone,
        dt_nasc: personEntity.dt_nasc,
        sexo: personEntity.sexo,
        situacao: personEntity.situacao
      }
    });

    // 5️⃣ Reconstrói a Entity a partir do que veio do banco
    return new PersonEntity(
      {
        name: updated.name,
        cpf: updated.cpf,
        email: updated.email,
        phone: updated.phone,
        dt_nasc: updated.dt_nasc,
        sexo: updated.sexo,
        situacao: updated.situacao,
        createdAt: updated.created_at
      },
      updated.uuid
    );
  }
}
