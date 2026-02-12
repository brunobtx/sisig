import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { ClassValidatorFields } from '../../../../../Common/Domain/Validators/classValidatorFields';
import { CreateAcademicPeriodInputDto } from '../../application/dtos/create-academic-period-input.dto';

export class AcademicPeriodRules {
  @IsNumber({}, { message: "O campo 'Ano letivo' deve ser um número válido." })
  @IsNotEmpty({ message: "O campo 'Ano letivo' é obrigatório." })
  id_academy_year: number;

  @IsString({ message: 'O nome deve ser um texto válido.' })
  @IsNotEmpty({ message: "O campo 'Nome' é obrigatório." })
  @MaxLength(100, { message: 'O nome pode ter no máximo 100 caracteres.' })
  name: string;

  @IsDateString({}, { message: 'A data de início deve ser uma data válida.' })
  @IsNotEmpty({ message: 'A data de início é obrigatória.' })
  dt_start: string | Date;

  @IsDateString({}, { message: 'A data de término deve ser uma data válida.' })
  @IsNotEmpty({ message: 'A data de término é obrigatória.' })
  dt_end: string | Date;

  @IsNumber({}, { message: 'O criador deve ser um número válido.' })
  @IsNotEmpty({ message: 'A pessoa que criou é obrigatória.' })
  id_person_create: number;

  constructor(data: CreateAcademicPeriodInputDto) {
    Object.assign(this, data);
  }
}

export class AcademicPeriodValidator extends ClassValidatorFields<AcademicPeriodRules> {
  validate(data: CreateAcademicPeriodInputDto): boolean {
    return super.validate(new AcademicPeriodRules(data));
  }
}

export class AcademicPeriodValidatorFactory {
  static create(): AcademicPeriodValidator {
    return new AcademicPeriodValidator();
  }
}
