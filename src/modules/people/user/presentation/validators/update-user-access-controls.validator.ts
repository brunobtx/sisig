import { IsArray, IsOptional, IsString } from 'class-validator';
import { ClassValidatorFields } from '../../../../../shared/domain/validators/classValidatorFields';
import { UpdateUserAccessControlsInputDto } from '../../application/dtos/update-user-access-controls-input.dto';

class UpdateUserAccessControlsRules {
  @IsOptional()
  @IsArray({ message: 'groupUuids deve ser uma lista.' })
  @IsString({ each: true, message: 'Cada groupUuid deve ser texto.' })
  groupUuids: string[];

  constructor(data: UpdateUserAccessControlsInputDto) {
    Object.assign(this, data);
  }
}

export class UpdateUserAccessControlsValidator extends ClassValidatorFields<UpdateUserAccessControlsRules> {
  validate(data: UpdateUserAccessControlsInputDto): boolean {
    return super.validate(new UpdateUserAccessControlsRules(data));
  }
}

export class UpdateUserAccessControlsValidatorFactory {
  static create(): UpdateUserAccessControlsValidator {
    return new UpdateUserAccessControlsValidator();
  }
}
