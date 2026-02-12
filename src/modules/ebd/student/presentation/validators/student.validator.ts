import { IsNotEmpty, IsNumber } from 'class-validator';
import { ClassValidatorFields } from '../../../../../shared/domain/validators/classValidatorFields';
import { CreateStudentInputDto } from '../../application/dtos/create-student-input.dto';

export class StudentRules {
  @IsNumber({}, { message: 'É obrigatório selecionar uma pessoa válida' })
  @IsNotEmpty({ message: 'É obrigatório selecionar uma pessoa' })
  id_person: number;

  constructor(data: CreateStudentInputDto) {
    Object.assign(this, data);
  }
}

export class StudentValidator extends ClassValidatorFields<StudentRules> {
  validate(data: CreateStudentInputDto): boolean {
    return super.validate(new StudentRules(data));
  }
}

export class StudentValidatorFactory {
  static create(): StudentValidator {
    return new StudentValidator();
  }
}
