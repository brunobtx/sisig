import { Entity } from "../../../../Common/Domain/Entities/entity";

export type PersonProps = {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  dt_nasc: Date;
  sexo: string;
  situacao: boolean;
  createdAt?: Date;
};

export class PersonEntity extends Entity<PersonProps> {
  constructor(props: PersonProps, id?: string) {
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get name() { return this.props.name; }
  get cpf() { return this.props.cpf; }
  get email() { return this.props.email; }
  get phone() { return this.props.phone; }
  get dt_nasc() { return this.props.dt_nasc; }
  get sexo() { return this.props.sexo; }
  get situacao() { return this.props.situacao; }
  get createdAt() { return this.props.createdAt; }
}
