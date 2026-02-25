import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ClassValidatorFields } from '../../../../../shared/domain/validators/classValidatorFields';
import { CreateUserInputDto } from '../../application/dtos/create-user-input.dto';
import { isValidRole } from '../../../../../shared/auth/rbac';

export class UserRules {
  @IsNumber({}, { message: 'O campo Pessoa deve ser um número válido.' })
  @IsNotEmpty({ message: 'O campo Pessoa é obrigatório.' })
  id_person: number;

  @IsString({ message: 'A senha deve ser um texto válido.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @MaxLength(100, { message: 'A senha deve ter no máximo 100 caracteres.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  password: string;

  @IsOptional()
  @IsString({ message: 'Role inválido.' })
  role?: string;

  custom_permissions?: string[];

  constructor(data: CreateUserInputDto) {
    Object.assign(this, data);
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: CreateUserInputDto): boolean {
    const isValid = super.validate(new UserRules(data));

    if (!isValid) return false;

    if (data.role && !isValidRole(data.role)) {
      this.errors = { ...this.errors, role: ['Role inválido.'] };
      return false;
    }

    if (data.custom_permissions && !Array.isArray(data.custom_permissions)) {
      this.errors = { ...this.errors, custom_permissions: ['Permissões devem ser uma lista.'] };
      return false;
    }

    return true;
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator();
  }
}
