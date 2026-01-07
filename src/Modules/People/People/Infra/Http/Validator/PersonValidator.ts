import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsBoolean,
  IsEmail,
  IsDateString,
} from "class-validator";
import { ClassValidatorFields } from "../../../../../../Common/Domain/Validators/classValidatorFields";
import { IsCPF } from "../../../../../../Common/Helper/isCpfDecorator";

export interface PersonInput {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  dt_nasc: Date;
  sexo: string;
  situacao: boolean;
}

export class PersonRules {
  @IsString({ message: "O nome deve ser um texto válido." })
  @MaxLength(255, { message: "O nome deve ter no máximo 255 caracteres." })
  @IsNotEmpty({ message: "O nome é obrigatório." })
  name: string;

  @IsCPF({ message: "CPF inválido." })
  @IsString({ message: "O CPF deve ser um texto válido." })
  @MaxLength(11, { message: "O CPF deve ter no máximo 11 caracteres." })
  @IsNotEmpty({ message: "O CPF é obrigatório." })
  cpf: string;

  @IsEmail({}, { message: "Email inválido." })
  @IsString({ message: "O email deve ser um texto válido." })
  @MaxLength(255, { message: "O email deve ter no máximo 255 caracteres." })
  @IsNotEmpty({ message: "O email é obrigatório." })
  email: string;

  @IsString({ message: "O telefone deve ser um texto válido." })
  @MaxLength(255, { message: "O telefone deve ter no máximo 255 caracteres." })
  @IsNotEmpty({ message: "O telefone é obrigatório." })
  phone: string;

  @IsDateString({},{ message: "A data de nascimento deve ser uma data válida." })
  @IsNotEmpty({ message: "A data de nascimento é obrigatória." })
  dt_nasc: Date;

  @IsString({ message: "O sexo deve ser um texto válido." })
  @MaxLength(2, { message: "O sexo deve ter no máximo 2 caracteres." })
  @IsNotEmpty({ message: "O sexo é obrigatório." })
  sexo: string;

  @IsBoolean({ message: "A situação deve ser um valor verdadeiro ou falso." })
  @IsNotEmpty({ message: "A situação é obrigatória." })
  situacao: boolean;

  constructor(data: PersonInput) {
    Object.assign(this, data);
  }
}

export class PersonValidator extends ClassValidatorFields<PersonRules> {
  validate(data: PersonInput): boolean {
    return super.validate(new PersonRules(data));
  }
}

export class PersonValidatorFactory {
  static create(): PersonValidator {
    return new PersonValidator();
  }
}
