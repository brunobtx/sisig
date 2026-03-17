import { Entity } from '../../../../../shared/domain/entities/entity';

export type TurmaProps = {
  databaseId?: number;
  uuid?: string;
  id_class: number;
  id_academic_year: number;
  bo_situacao?: boolean;
  created_at?: Date | null;
};

export class TurmaEntity extends Entity<TurmaProps> {
  constructor(props: TurmaProps, id?: string) {
    super(props, id);
    this.props.created_at = this.props.created_at ?? new Date();
    this.props.bo_situacao = this.props.bo_situacao ?? true;
  }

  get databaseId() {
    return this.props.databaseId;
  }

  get uuid() {
    return this.props.uuid;
  }

  get id_class() {
    return this.props.id_class;
  }

  get id_academic_year() {
    return this.props.id_academic_year;
  }

  get bo_situacao() {
    return this.props.bo_situacao;
  }

  get created_at() {
    return this.props.created_at;
  }
}
