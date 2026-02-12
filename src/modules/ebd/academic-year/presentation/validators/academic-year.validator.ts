import { IsNotEmpty, IsNumber } from 'class-validator';
import { ClassValidatorFields } from '../../../../../Common/Domain/Validators/classValidatorFields';
import { CreateAcademicYearInputDto } from '../../application/dtos/create-academic-year-input.dto';

export class AcademicYearRules {
  @IsNumber({}, { message: "O campo 'Ano letivo' deve ser um número válido." })
  @IsNotEmpty({ message: "O campo 'Ano letivo' é obrigatório." })
  year: number;

  @IsNumber({}, { message: 'O criador deve ser um número válido.' })
  @IsNotEmpty({ message: 'A pessoa que criou o ano letivo é obrigatória.' })
  id_person_create: number;

  constructor(data: CreateAcademicYearInputDto) {
    Object.assign(this, data);
  }
}

export class AcademicYearValidator extends ClassValidatorFields<AcademicYearRules> {
  validate(data: CreateAcademicYearInputDto): boolean {
    return super.validate(new AcademicYearRules(data));
  }
}

export class AcademicYearValidatorFactory {
  static create(): AcademicYearValidator {
    return new AcademicYearValidator();
  }
}
