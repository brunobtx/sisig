import { IsNotEmpty, IsNumber } from 'class-validator';
import { ClassValidatorFields } from '../../../../../shared/domain/validators/classValidatorFields';
import { CreateTeacherInputDto } from '../../application/dtos/create-teacher-input.dto';

export class TeacherRules {
  @IsNumber({}, { message: 'É obrigatório selecionar uma pessoa válida' })
  @IsNotEmpty({ message: 'É obrigatório selecionar uma pessoa' })
  id_person: number;

  constructor(data: CreateTeacherInputDto) {
    Object.assign(this, data);
  }
}

export class TeacherValidator extends ClassValidatorFields<TeacherRules> {
  validate(data: CreateTeacherInputDto): boolean {
    return super.validate(new TeacherRules(data));
  }
}

export class TeacherValidatorFactory {
  static create(): TeacherValidator {
    return new TeacherValidator();
  }
}
