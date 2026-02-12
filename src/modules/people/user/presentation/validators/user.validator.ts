import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { ClassValidatorFields } from '../../../../../Common/Domain/Validators/classValidatorFields';
import { CreateUserInputDto } from '../../application/dtos/create-user-input.dto';

export class UserRules {
  @IsNumber({}, { message: 'O campo Pessoa deve ser um número válido.' })
  @IsNotEmpty({ message: 'O campo Pessoa é obrigatório.' })
  id_person: number;

  @IsString({ message: 'A senha deve ser um texto válido.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @MaxLength(100, { message: 'A senha deve ter no máximo 100 caracteres.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  password: string;

  constructor(data: CreateUserInputDto) {
    Object.assign(this, data);
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: CreateUserInputDto): boolean {
    return super.validate(new UserRules(data));
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator();
  }
}
