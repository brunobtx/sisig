import { AppError } from '../../../../../shared/errors/AppError';
import { ClassRepository, TeacherClassRelation } from '../../domain/repositories/class.repository';

export class ListClassTeachersUseCase {
  constructor(private readonly repository: ClassRepository) {}

  async execute(id_class: number): Promise<TeacherClassRelation[]> {
    if (!id_class) {
      throw new AppError('É obrigatório selecionar uma classe', 400);
    }

    const classExists = await this.repository.findById(id_class);
    if (!classExists) {
      throw new AppError('Classe não encontrada', 404);
    }

    return this.repository.listTeachersByClass(id_class);
  }
}
