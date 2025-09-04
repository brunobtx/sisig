import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsNumber,
  MinLength,
  maxLength,
} from "class-validator";
import { ClassValidatorFields } from "../../../../Common/Domain/Validators/classValidatorFields";
import { Type } from "class-transformer";

// Definindo o tipo de dados que o validator vai receber
export interface ClassInput {
  name: string;
  idade_in: number;
  idade_fn: number;
  createdAt?: Date;
}

// Regras de validação
export class ClassRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty({ message: "Idade Inicial é obrigatório!" })
  idade_in: number;

  @IsNumber()
  @IsNotEmpty({ message: "Idade Final é obrigatório!" })
  idade_fn: number;

  constructor(data: ClassInput) {
    Object.assign(this, data);
  }
}

// Validator usando ClassValidatorFields
export class ClassValidator extends ClassValidatorFields<ClassRules> {
  validate(data: ClassInput): boolean {
    return super.validate(new ClassRules(data));
  }
}

// Factory para criar instâncias do validator
export class ClassValidatorFactory {
  static create(): ClassValidator {
    return new ClassValidator();
  }
}
