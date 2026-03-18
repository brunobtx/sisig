import { Entity } from '../../../../../shared/domain/entities/entity';
import { ClassAgeRange } from '../value-objects/class-age-range.value-object';

export type ClassProps = {
  databaseId?: number;
  uuid?: string;
  name: string;
  idade_in: number;
  idade_fn: number;
  id_organization?: number | null;
  bo_situacao?: boolean;
  description?: string | null;
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

  get id_organization() {
    return this.props.id_organization;
  }

  get description() {
    return this.props.description;
  }

  get created_at() {
    return this.props.created_at;
  }
}
