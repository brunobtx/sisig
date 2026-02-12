import { AppError } from '../../../../../shared/errors/AppError';
import { ClassRepository, StudentClassRelation } from '../../domain/repositories/class.repository';
import { AddStudentToClassInputDto } from '../dtos/add-student-to-class-input.dto';

export class AddStudentToClassUseCase {
  constructor(private readonly repository: ClassRepository) {}

  async execute({ id_student, id_class }: AddStudentToClassInputDto): Promise<StudentClassRelation> {
    if (!id_student) {
      throw new AppError('É obrigatório selecionar um Aluno', 400);
    }

    if (!id_class) {
      throw new AppError('É obrigatório selecionar uma classe', 400);
    }

    const classExists = await this.repository.findById(id_class);
    if (!classExists) {
      throw new AppError('Classe não encontrada', 404);
    }

    const studentExists = await this.repository.studentExists(id_student);
    if (!studentExists) {
      throw new AppError('Aluno não encontrado', 404);
    }

    const studentLink = await this.repository.findStudentClassLink(id_student);
    if (studentLink && studentLink.id_class === id_class) {
      throw new AppError('Esse Aluno já está vinculado a essa classe', 400);
    }

    if (studentLink) {
      throw new AppError('Esse Aluno já está vinculado a uma classe', 400);
    }

    return this.repository.createStudentLink(id_student, id_class);
  }
}
