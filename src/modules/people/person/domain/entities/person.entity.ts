import { Entity } from '../../../../../shared/domain/entities/entity';

export type PersonProps = {
  databaseId?: number;
  uuid?: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  dt_nasc: Date;
  sexo: string;
  situacao: boolean;
  id_organization?: number | null;
  createdAt?: Date | null;
};

export class PersonEntity extends Entity<PersonProps> {
  constructor(props: PersonProps, id?: string) {
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

  get id_organization() {
    return this.props.id_organization;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
