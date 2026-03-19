import { MemberEntity } from '../../domain/entities/member.entity';

export type MemberOutputDto = {
  uuid: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  dt_nasc: Date;
  sexo: string;
  id_organization?: number | null;
  situacao: boolean;
};

export class MemberOutputMapper {
  static toOutput(entity: MemberEntity): MemberOutputDto {
    return {
      uuid: entity.uuid ?? entity.id,
      name: entity.name,
      cpf: entity.cpf,
      email: entity.email,
      phone: entity.phone,
      dt_nasc: entity.dt_nasc,
      sexo: entity.sexo,
      id_organization: entity.id_organization ?? null,
      situacao: entity.situacao,
    };
  }
}
