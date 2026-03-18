import { AppError } from '../../../../../shared/errors/AppError';
import { StudentEntity } from '../../domain/entities/student.entity';
import { StudentRepository } from '../../domain/repositories/student.repository';
import { CreateStudentInputDto } from '../dtos/create-student-input.dto';

export class CreateStudentUseCase {
  constructor(private readonly repository: StudentRepository) {}

  async execute(data: CreateStudentInputDto, id_organization?: number | null): Promise<StudentEntity> {
    const { id_person } = data;

    if (!id_person) {
      throw new AppError('É Obrigatório selecionar uma pessoa!', 400);
    }

    const personExists = await this.repository.personExists(id_person, id_organization);
    if (!personExists) {
      throw new AppError('Pessoa não encontrada!', 404);
    }

    const student = await this.repository.findByIdPerson(id_person, id_organization);
    if (student) {
      throw new AppError('Pessoa já é um aluno!', 400);
    }

    const newStudent = new StudentEntity({ id_person });
    return this.repository.create(newStudent);
  }
}
