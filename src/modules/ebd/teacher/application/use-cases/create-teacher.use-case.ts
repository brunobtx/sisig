import { AppError } from '../../../../../shared/errors/AppError';
import { TeacherEntity } from '../../domain/entities/teacher.entity';
import { TeacherRepository } from '../../domain/repositories/teacher.repository';
import { CreateTeacherInputDto } from '../dtos/create-teacher-input.dto';

export class CreateTeacherUseCase {
  constructor(private readonly repository: TeacherRepository) {}

  async execute(data: CreateTeacherInputDto): Promise<TeacherEntity> {
    const { id_person } = data;

    if (!id_person) {
      throw new AppError('É Obrigatório selecionar uma pessoa!', 400);
    }

    const personExists = await this.repository.personExists(id_person);
    if (!personExists) {
      throw new AppError('Pessoa não encontrada!', 404);
    }

    const teacher = await this.repository.findByIdPerson(id_person);
    if (teacher) {
      throw new AppError('Pessoa já é um professor!', 400);
    }

    const newTeacher = new TeacherEntity({ id_person });
    return this.repository.create(newTeacher);
  }
}
