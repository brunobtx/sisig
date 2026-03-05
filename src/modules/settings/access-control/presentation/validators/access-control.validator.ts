import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ClassValidatorFields } from '../../../../../shared/domain/validators/classValidatorFields';
import {
  AccessControlPermissionObjectInput,
  CreateAccessControlInputDto,
} from '../../application/dtos/create-access-control-input.dto';

export class AccessControlRules {
  @IsString({ message: 'Nome deve ser texto' })
  @MaxLength(255, { message: 'Nome deve ter no maximo 255 caracteres' })
  @IsNotEmpty({ message: 'Nome e obrigatorio' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Descricao deve ser texto' })
  @MaxLength(255, { message: 'Descricao deve ter no maximo 255 caracteres' })
  description?: string;

  @IsArray({ message: 'Permissoes devem ser uma lista' })
  permissions: Array<string | AccessControlPermissionObjectInput>;

  constructor(data: CreateAccessControlInputDto) {
    Object.assign(this, data);
  }
}

function isValidPermissionKey(permission: string): boolean {
  const [service, feature, ...rest] = permission.split(':');
  return Boolean(service && feature && rest.length === 0);
}

function isValidPermissionObject(permission: AccessControlPermissionObjectInput): boolean {
  if (!permission || typeof permission !== 'object') return false;
  if (typeof permission.module !== 'string' || !permission.module.trim()) return false;
  if (!Array.isArray(permission.actions) || permission.actions.length === 0) return false;

  return permission.actions.every((action) => typeof action === 'string' && action.trim().length > 0);
}

export class AccessControlValidator extends ClassValidatorFields<AccessControlRules> {
  validate(data: CreateAccessControlInputDto): boolean {
    const isValid = super.validate(new AccessControlRules(data));

    if (!isValid) {
      return false;
    }

    const hasInvalidPermission = data.permissions.some((permission) => {
      if (typeof permission === 'string') {
        return !isValidPermissionKey(permission);
      }

      return !isValidPermissionObject(permission);
    });

    if (hasInvalidPermission) {
      this.errors = {
        ...this.errors,
        permissions: [
          'Cada permissao deve usar o formato servico:funcionalidade ou objeto { module, actions[] }.',
        ],
      };
      return false;
    }

    return true;
  }
}

export class AccessControlValidatorFactory {
  static create(): AccessControlValidator {
    return new AccessControlValidator();
  }
}
