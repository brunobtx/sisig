import { MaxLength, IsString, IsNotEmpty, IsOptional, IsDate, IsNumber, MinLength } from 'class-validator'
import { ClassValidatorFields } from '../../../../Common/Domain/Validators/classValidatorFields'

export interface UserInput {
  name: string
  email: string
  password: string
  createdAt?: Date
}

export class UserRules {

  @IsNumber()
  @IsNotEmpty({ message: "O campo Pessoa é obrigatório." })
  id_person: string

  @IsString({ message: "A senha deve ser um texto válido." })
  @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres." })
  @MaxLength(100, { message: "A senha deve ter no máximo 100 caracteres." })
  @IsNotEmpty({ message: "A senha é obrigatória." })
  password: string;

  constructor(data: UserInput) {
    Object.assign(this, data)
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: UserInput): boolean {
    return super.validate(new UserRules(data))
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator()
  }
}
