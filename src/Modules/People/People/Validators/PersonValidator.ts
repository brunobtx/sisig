import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsBoolean,
  IsEmail,
} from "class-validator";
import { ClassValidatorFields } from "../../../../Common/Domain/classValidatorFields";
import { Person } from "@prisma/client";
import { IsCPF } from "../../../../Common/Helper/isCpfDecorator";

// Definindo o tipo de dados que o validator vai receber
export interface PersonInput {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  dt_nasc: Date;
  sexo: string;
  situacao: boolean;
}

// Regras de validação
export class PersonRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsCPF({ message: 'CPF inválido' })
  @MaxLength(11)
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsEmail({}, { message: "Email inválido" })
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  email: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password: string;

  @MaxLength(2)
  @IsNotEmpty()
  @IsString()
  sexo?: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  situacao?: boolean;

  constructor(data: PersonInput) {
    Object.assign(this, data);
  }
}

export class PersonValidator extends ClassValidatorFields<Person> {
  validate(data: PersonInput): boolean {
    return super.validate(new PersonRules(data));
  }
}

export class PersonValidatorFactory {
  static create(): PersonValidator {
    return new PersonValidator();
  }
}
