import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ClassValidatorFields } from '../../../../../Common/Domain/Validators/classValidatorFields';
import { CreateClassSessionInputDto } from '../../application/dtos/create-class-session-input.dto';

export class ClassSessionRules {
  @IsNumber({}, { message: "O campo 'Turma' deve ser um número válido." })
  @IsNotEmpty({ message: "O campo 'Turma' é obrigatório." })
  id_class: number;

  @IsDateString({}, { message: 'A data da sessão deve ser uma data válida.' })
  @IsNotEmpty({ message: 'A data da sessão é obrigatória.' })
  dt_session: Date | string;

  @IsNumber({}, { message: 'O número da lição deve ser um número válido.' })
  @IsNotEmpty({ message: 'O número da lição é obrigatório.' })
  nr_lesson: number;

  @IsString({ message: 'O tópico deve ser um texto válido.' })
  @MaxLength(255, { message: 'O tópico deve ter no máximo 255 caracteres.' })
  @IsNotEmpty({ message: 'O tópico é obrigatório.' })
  topic: string;

  @IsNumber({}, { message: 'O professor deve ser um número válido.' })
  @IsNotEmpty({ message: 'O professor é obrigatório.' })
  id_teacher: number;

  @IsOptional()
  @IsString({ message: 'As anotações devem ser texto.' })
  @MaxLength(500, { message: 'As anotações devem ter no máximo 500 caracteres.' })
  notes?: string;

  @IsNumber({}, { message: 'A pessoa deve ser um número válido.' })
  @IsNotEmpty({ message: 'A pessoa é obrigatória.' })
  id_person: number;

  constructor(data: CreateClassSessionInputDto) {
    Object.assign(this, data);
  }
}

export class ClassSessionValidator extends ClassValidatorFields<ClassSessionRules> {
  validate(data: CreateClassSessionInputDto): boolean {
    return super.validate(new ClassSessionRules(data));
  }
}

export class ClassSessionValidatorFactory {
  static create(): ClassSessionValidator {
    return new ClassSessionValidator();
  }
}
