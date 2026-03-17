import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { ClassValidatorFields } from '../../../../../shared/domain/validators/classValidatorFields';
import { CreateTurmaInputDto } from '../../application/dtos/create-turma-input.dto';

export class TurmaRules {
  @IsNumber({}, { message: 'Classe deve ser um número válido' })
  @IsNotEmpty({ message: 'Classe é obrigatória' })
  id_class: number;

  @IsNumber({}, { message: 'Ano letivo deve ser um número válido' })
  @IsNotEmpty({ message: 'Ano letivo é obrigatório' })
  id_academic_year: number;

  @IsBoolean({ message: 'Situação deve ser verdadeiro ou falso' })
  @IsNotEmpty({ message: 'Situação é obrigatória' })
  isActive: boolean;

  constructor(data: CreateTurmaInputDto) {
    Object.assign(this, data);
  }
}

export class TurmaValidator extends ClassValidatorFields<TurmaRules> {
  validate(data: CreateTurmaInputDto): boolean {
    return super.validate(new TurmaRules(data));
  }
}

export class TurmaValidatorFactory {
  static create(): TurmaValidator {
    return new TurmaValidator();
  }
}
