import { Entity } from '../../../../../Common/Domain/Entities/entity';
import { ClassAgeRange } from '../value-objects/class-age-range.value-object';

export type ClassProps = {
  databaseId?: number;
  uuid?: string;
  name: string;
  idade_in: number;
  idade_fn: number;
  bo_situacao?: boolean;
  created_at?: Date | null;
};

export class ClassEntity extends Entity<ClassProps> {
  constructor(props: ClassProps, id?: string) {
    super(props, id);
    this.props.created_at = this.props.created_at ?? new Date();
    this.props.bo_situacao = this.props.bo_situacao ?? true;
    ClassAgeRange.validate(this.props.idade_in, this.props.idade_fn);
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

  get idade_in() {
    return this.props.idade_in;
  }

  get idade_fn() {
    return this.props.idade_fn;
  }

  get bo_situacao() {
    return this.props.bo_situacao;
  }

  get created_at() {
    return this.props.created_at;
  }
}
