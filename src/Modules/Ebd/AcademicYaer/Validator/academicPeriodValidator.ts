import {
  IsNumber,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDateString,
} from "class-validator";
import { ClassValidatorFields } from "../../../../Common/Domain/Validators/classValidatorFields";

// DTO de entrada
export interface AcademicPeriodInput {
  id_academy_year: number;
  name: string;
  dt_start: string; // usando string para validar com @IsDateString
  dt_end: string;
  id_person_create: number;
}

// Regras de validação
export class AcademicPeriodRules {
  @IsNumber({}, { message: "O campo 'Ano letivo' deve ser um número válido." })
  @IsNotEmpty({ message: "O campo 'Ano letivo' é obrigatório." })
  id_academy_year: number;

  @IsString({ message: "O nome deve ser um texto válido." })
  @IsNotEmpty({ message: "O campo 'Nome' é obrigatório." })
  @MaxLength(100, { message: "O nome pode ter no máximo 100 caracteres." })
  name: string;

  @IsDateString({}, { message: "A data de início deve ser uma data válida." })
  @IsNotEmpty({ message: "A data de início é obrigatória." })
  dt_start: string;

  @IsDateString({}, { message: "A data de término deve ser uma data válida." })
  @IsNotEmpty({ message: "A data de término é obrigatória." })
  dt_end: string;

  @IsNumber({}, { message: "O criador deve ser um número válido." })
  @IsNotEmpty({ message: "A pessoa que criou é obrigatória." })
  id_person_create: number;

  constructor(data: AcademicPeriodInput) {
    Object.assign(this, data);
  }
}

// Validator usando ClassValidatorFields
export class AcademicPeriodValidator extends ClassValidatorFields<AcademicPeriodRules> {
  validate(data: AcademicPeriodInput): boolean {
    return super.validate(new AcademicPeriodRules(data));
  }
}

// Factory para criar instâncias do validator
export class AcademicPeriodValidatorFactory {
  static create(): AcademicPeriodValidator {
    return new AcademicPeriodValidator();
  }
}
