import { StudentOutputDto } from '../dtos/student-output.dto';
import { StudentRepository } from '../../domain/repositories/student.repository';

export class ListStudentUseCase {
  constructor(private readonly repository: StudentRepository) {}

  async execute(): Promise<StudentOutputDto[]> {
    const students = await this.repository.findAllWithPerson();
    return students.map((student) => ({
      id: student.id,
      uuid: student.uuid,
      id_person: student.id_person,
      bo_situacao: student.bo_situacao,
      person: student.person,
    }));
  }
}
