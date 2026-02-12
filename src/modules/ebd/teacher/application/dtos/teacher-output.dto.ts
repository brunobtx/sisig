import { TeacherEntity } from '../../domain/entities/teacher.entity';

export type TeacherOutputDto = {
  id_person: number;
};

export class TeacherOutputMapper {
  static toOutput(entity: TeacherEntity): TeacherOutputDto {
    return {
      id_person: entity.id_person,
    };
  }
}
