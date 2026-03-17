import { ClassOutputDto, ClassOutputMapper } from '../dtos/class-output.dto';
import { ClassRepository } from '../../domain/repositories/class.repository';

export class ListClassUseCase {
  constructor(private readonly repository: ClassRepository) {}

  async execute(): Promise<ClassOutputDto[]> {
    const classes = await this.repository.findAll();
    return classes.map((classe) => ClassOutputMapper.toOutput(classe));
  }
}
