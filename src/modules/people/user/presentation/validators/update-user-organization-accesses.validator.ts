import { IsArray, IsBoolean, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { USER_ORGANIZATION_SCOPES } from '../../../../../shared/auth/organization-access';
import { ClassValidatorFields } from '../../../../../shared/domain/validators/classValidatorFields';
import { UpdateUserOrganizationAccessesInputDto } from '../../application/dtos/user-organization-access.dto';

class UserOrganizationAccessRules {
  @IsString({ message: 'organizationUuid deve ser texto.' })
  organizationUuid: string;

  @IsOptional()
  @IsIn(USER_ORGANIZATION_SCOPES, { message: 'scope invalido.' })
  scope?: string;

  @IsOptional()
  @IsBoolean({ message: 'isDefault deve ser verdadeiro ou falso.' })
  isDefault?: boolean;
}

class UpdateUserOrganizationAccessesRules {
  @IsOptional()
  @IsArray({ message: 'organizationAccesses deve ser uma lista.' })
  @ValidateNested({ each: true })
  @Type(() => UserOrganizationAccessRules)
  organizationAccesses: UserOrganizationAccessRules[];

  constructor(data: UpdateUserOrganizationAccessesInputDto) {
    Object.assign(this, data);
  }
}

export class UpdateUserOrganizationAccessesValidator extends ClassValidatorFields<UpdateUserOrganizationAccessesRules> {
  validate(data: UpdateUserOrganizationAccessesInputDto): boolean {
    return super.validate(new UpdateUserOrganizationAccessesRules(data));
  }
}

export class UpdateUserOrganizationAccessesValidatorFactory {
  static create(): UpdateUserOrganizationAccessesValidator {
    return new UpdateUserOrganizationAccessesValidator();
  }
}
