import { Entity } from '../../../../../shared/domain/entities/entity';

export type MemberProps = {
  databaseId?: number;
  uuid?: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  dt_nasc: Date;
  sexo: string;
  situacao: boolean;
  createdAt?: Date | null;
};

export class MemberEntity extends Entity<MemberProps> {
  constructor(props: MemberProps, id?: string) {
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get databaseId() {
    return this.props.databaseId;
  }

  get uuid() {
    return this.props.uuid;
  }

  get name() {
    return this.props.name;
  }

  get cpf() {
    return this.props.cpf;
  }

  get email() {
    return this.props.email;
  }

  get phone() {
    return this.props.phone;
  }

  get dt_nasc() {
    return this.props.dt_nasc;
  }

  get sexo() {
    return this.props.sexo;
  }

  get situacao() {
    return this.props.situacao;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
