import { MaxLength, IsString, IsNotEmpty, IsOptional, IsDate, IsNumber, MinLength } from 'class-validator'
import { ClassValidatorFields } from '../../../../Common/Domain/classValidatorFields'

// Definindo o tipo de dados que o validator vai receber
export interface UserInput {
  name: string
  email: string
  password: string
  createdAt?: Date
}

// Regras de validação
export class UserRules {

  @IsNumber()
  @IsNotEmpty()
  id_person: string

  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password: string

  constructor(data: UserInput) {
    Object.assign(this, data)
  }
}

// Validator usando ClassValidatorFields
export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: UserInput): boolean {
    return super.validate(new UserRules(data))
  }
}

// Factory para criar instâncias do validator
export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator()
  }
}
