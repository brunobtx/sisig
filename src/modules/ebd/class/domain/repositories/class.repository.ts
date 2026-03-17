import { ClassEntity } from '../entities/class.entity';

export interface ClassRepository {
  findById(id: number): Promise<ClassEntity | null>;
  findAll(): Promise<ClassEntity[]>;
  create(data: ClassEntity): Promise<ClassEntity>;
}
