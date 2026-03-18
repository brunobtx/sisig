import { ClassEntity } from '../entities/class.entity';

export interface ClassRepository {
  findById(id: number, id_organization?: number | null): Promise<ClassEntity | null>;
  findAll(id_organization?: number | null): Promise<ClassEntity[]>;
  create(data: ClassEntity): Promise<ClassEntity>;
}
