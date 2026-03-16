import { AppError } from '../../../../../shared/errors/AppError';
import { ClassRepository, StudentClassRelation } from '../../domain/repositories/class.repository';

export class ListClassStudentsUseCase {
  constructor(private readonly repository: ClassRepository) {}

  async execute(id_class: number): Promise<StudentClassRelation[]> {
    if (!id_class) {
      throw new AppError('É obrigatório selecionar uma classe', 400);
    }

    const classExists = await this.repository.findById(id_class);
    if (!classExists) {
      throw new AppError('Classe não encontrada', 404);
    }

    return this.repository.listStudentsByClass(id_class);
  }
}
