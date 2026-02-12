import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { ClassValidatorFields } from '../../../../../shared/domain/validators/classValidatorFields';
import { CreateClassInputDto } from '../../application/dtos/create-class-input.dto';

export class ClassRules {
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  @IsString({ message: 'Nome deve ser texto' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsNumber({}, { message: 'Idade inicial deve ser número' })
  @IsNotEmpty({ message: 'Idade Inicial é obrigatório!' })
  idade_in: number;

  @IsNumber({}, { message: 'Idade final deve ser número' })
  @IsNotEmpty({ message: 'Idade Final é obrigatório!' })
  idade_fn: number;

  constructor(data: CreateClassInputDto) {
    Object.assign(this, data);
  }
}

export class ClassValidator extends ClassValidatorFields<ClassRules> {
  validate(data: CreateClassInputDto): boolean {
    return super.validate(new ClassRules(data));
  }
}

export class ClassValidatorFactory {
  static create(): ClassValidator {
    return new ClassValidator();
  }
}
