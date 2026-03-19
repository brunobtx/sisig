import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ClassValidatorFields } from '../../../../../shared/domain/validators/classValidatorFields';
import { CreateHomeInputDto } from '../../application/dtos/create-home-input.dto';

export class HomeRules {
  @IsString({ message: 'Nome deve ser texto' })
  @MaxLength(255, { message: 'Nome deve ter no maximo 255 caracteres' })
  @IsNotEmpty({ message: 'Nome e obrigatorio' })
  name: string;

  constructor(data: CreateHomeInputDto) {
    Object.assign(this, data);
  }
}

export class HomeValidator extends ClassValidatorFields<HomeRules> {
  validate(data: CreateHomeInputDto): boolean {
    return super.validate(new HomeRules(data));
  }
}

export class HomeValidatorFactory {
  static create(): HomeValidator {
    return new HomeValidator();
  }
}
