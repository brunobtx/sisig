import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ClassValidatorFields } from '../../../../../shared/domain/validators/classValidatorFields';
import { OrganizationInputDto } from '../../application/dtos/organization-input.dto';

export class OrganizationRules {
  @IsString({ message: 'O nome deve ser um texto válido.' })
  @MaxLength(255, { message: 'O nome deve ter no máximo 255 caracteres.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @IsString({ message: 'O tipo deve ser um texto válido.' })
  @IsIn(['area', 'headquarters', 'congregation'], {
    message: 'O tipo deve ser: area, headquarters ou congregation.',
  })
  @IsNotEmpty({ message: 'O tipo é obrigatório.' })
  type: string;

  @IsOptional()
  @IsUUID('4', { message: 'parent_uuid deve ser um UUID válido.' })
  parent_uuid?: string | null;

  @IsBoolean({ message: 'A situação deve ser um valor verdadeiro ou falso.' })
  @IsNotEmpty({ message: 'A situação é obrigatória.' })
  bo_situacao: boolean;

  constructor(data: OrganizationInputDto) {
    Object.assign(this, data);
  }
}

export class OrganizationValidator extends ClassValidatorFields<OrganizationRules> {
  validate(data: OrganizationInputDto): boolean {
    return super.validate(new OrganizationRules(data));
  }
}

export class OrganizationValidatorFactory {
  static create(): OrganizationValidator {
    return new OrganizationValidator();
  }
}
