import {
  IsNumber,
  IsNotEmpty,
} from "class-validator";
import { ClassValidatorFields } from "../../../../Common/Domain/Validators/classValidatorFields";

// DTO de entrada
export interface AcademicYearInput {
  year: number;
  id_person_create: number;
}

// Regras de validação
export class AcademicYearRules {
  @IsNumber({}, { message: "O campo 'Ano letivo' deve ser um número válido." })
  @IsNotEmpty({ message: "O campo 'Ano letivo' é obrigatório." })
  year: number;

  @IsNumber({}, { message: "O criador deve ser um número válido." })
  @IsNotEmpty({ message: "A pessoa que criou o ano letivo é obrigatória." })
  id_person_create: number;

  constructor(data: AcademicYearInput) {
    Object.assign(this, data);
  }
}

// Validator usando ClassValidatorFields
export class AcademicYearValidator extends ClassValidatorFields<AcademicYearRules> {
  validate(data: AcademicYearInput): boolean {
    return super.validate(new AcademicYearRules(data));
  }
}

// Factory para criar instâncias do validator
export class AcademicYearValidatorFactory {
  static create(): AcademicYearValidator {
    return new AcademicYearValidator();
  }
}
