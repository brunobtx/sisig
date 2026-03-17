import { ClassEntity } from '../../domain/entities/class.entity';
import { ClassRepository } from '../../domain/repositories/class.repository';
import { CreateClassInputDto } from '../dtos/create-class-input.dto';

export class CreateClassUseCase {
  constructor(private readonly repository: ClassRepository) {}

  async execute(data: CreateClassInputDto): Promise<ClassEntity> {
    const classEntity = new ClassEntity({
      name: data.name,
      idade_in: data.idade_in,
      idade_fn: data.idade_fn,
      bo_situacao: data.isActive,
      description: data.description,
    });

    return this.repository.create(classEntity);
  }
}
