import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ClassValidatorFields } from '../../../../../shared/domain/validators/classValidatorFields';
import { CreateLessonInputDto } from '../../application/dtos/create-lesson-input.dto';

export class LessonRules {
  @IsNumber({}, { message: "O campo 'Turma' deve ser um número válido." })
  @IsNotEmpty({ message: "O campo 'Turma' é obrigatório." })
  id_turma: number;

  @IsDateString({}, { message: 'A data da lição deve ser uma data válida.' })
  @IsNotEmpty({ message: 'A data da lição é obrigatória.' })
  dt_lesson: Date | string;

  @IsNumber({}, { message: 'O número da lição deve ser um número válido.' })
  @IsNotEmpty({ message: 'O número da lição é obrigatório.' })
  nr_lesson: number;

  @IsString({ message: 'O título deve ser um texto válido.' })
  @MaxLength(255, { message: 'O título deve ter no máximo 255 caracteres.' })
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  title: string;

  @IsString({ message: 'A descrição deve ser um texto válido.' })
  @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres.' })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'O período deve ser um número válido.' })
  @IsNotEmpty({ message: 'O período é obrigatório.' })
  id_period: number;

  @IsNumber({}, { message: 'O criador deve ser um número válido.' })
  @IsNotEmpty({ message: 'A pessoa que criou a lição é obrigatória.' })
  id_person_create: number;

  constructor(data: CreateLessonInputDto) {
    Object.assign(this, data);
  }
}

export class LessonValidator extends ClassValidatorFields<LessonRules> {
  validate(data: CreateLessonInputDto): boolean {
    return super.validate(new LessonRules(data));
  }
}

export class LessonValidatorFactory {
  static create(): LessonValidator {
    return new LessonValidator();
  }
}
