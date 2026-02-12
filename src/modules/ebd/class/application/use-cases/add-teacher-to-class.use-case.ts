import { AppError } from '../../../../../shared/errors/AppError';
import { ClassRepository, TeacherClassRelation } from '../../domain/repositories/class.repository';
import { AddTeacherToClassInputDto } from '../dtos/add-teacher-to-class-input.dto';

export class AddTeacherToClassUseCase {
  constructor(private readonly repository: ClassRepository) {}

  async execute({ id_teacher, id_class }: AddTeacherToClassInputDto): Promise<TeacherClassRelation> {
    if (!id_teacher) {
      throw new AppError('É obrigatório selecionar um professor', 400);
    }

    if (!id_class) {
      throw new AppError('É obrigatório selecionar uma classe', 400);
    }

    const classExists = await this.repository.findById(id_class);
    if (!classExists) {
      throw new AppError('Classe não encontrada', 404);
    }

    const teacherExists = await this.repository.teacherExists(id_teacher);
    if (!teacherExists) {
      throw new AppError('Professor não encontrado', 404);
    }

    const alreadyLinked = await this.repository.isTeacherLinkedToClass(id_teacher, id_class);
    if (alreadyLinked) {
      throw new AppError('Esse professor já está vinculado a essa classe', 400);
    }

    return this.repository.createTeacherLink(id_teacher, id_class);
  }
}
