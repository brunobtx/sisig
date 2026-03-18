import { ClassOutputDto, ClassOutputMapper } from '../dtos/class-output.dto';
import { ClassRepository } from '../../domain/repositories/class.repository';

export class ListClassUseCase {
  constructor(private readonly repository: ClassRepository) {}

  async execute(id_organization?: number | null): Promise<ClassOutputDto[]> {
    const classes = await this.repository.findAll(id_organization);
    return classes.map((classe) => ClassOutputMapper.toOutput(classe));
  }
}
