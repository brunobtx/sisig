import { TeacherOutputDto } from '../dtos/teacher-output.dto';
import { TeacherRepository } from '../../domain/repositories/teacher.repository';

export class ListTeacherUseCase {
  constructor(private readonly repository: TeacherRepository) {}

  async execute(id_organization?: number | null): Promise<TeacherOutputDto[]> {
    const teachers = await this.repository.findAllWithPerson(id_organization);
    return teachers.map((teacher) => ({
      id: teacher.id,
      uuid: teacher.uuid,
      id_person: teacher.id_person,
      bo_situacao: teacher.bo_situacao,
      person: teacher.person,
    }));
  }
}
