import { AppError } from '../../../../../shared/errors/AppError';
import { MemberEntity } from '../../domain/entities/member.entity';
import { MemberRepository } from '../../domain/repositories/member.repository';
import { MemberInputDto } from '../dtos/member-input.dto';

export class CreateMemberUseCase {
  constructor(private readonly repository: MemberRepository) {}

  async execute(data: MemberInputDto): Promise<MemberEntity> {
    const { name, cpf, email, phone, dt_nasc, sexo, situacao } = data;

    if (!email) {
      throw new AppError('Email deve ser obrigatório!', 400);
    }

    const memberAlreadyExists = await this.repository.findByEmail(email);
    if (memberAlreadyExists) {
      throw new AppError('Email já existe!', 400);
    }

    const cpfAlreadyExists = await this.repository.findByCpf(cpf);
    if (cpfAlreadyExists) {
      throw new AppError('CPF já existe!', 400);
    }

    const member = new MemberEntity({
      name,
      cpf,
      email,
      phone,
      dt_nasc: new Date(dt_nasc),
      sexo,
      situacao,
      createdAt: new Date(),
    });

    return this.repository.create(member);
  }
}
