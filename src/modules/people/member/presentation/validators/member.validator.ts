import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsCPF } from '../../../../../shared/utils/isCpfDecorator';
import { ClassValidatorFields } from '../../../../../shared/domain/validators/classValidatorFields';
import { MemberInputDto } from '../../application/dtos/member-input.dto';

export class MemberRules {
  @IsString({ message: 'O nome deve ser um texto válido.' })
  @MaxLength(255, { message: 'O nome deve ter no máximo 255 caracteres.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @IsCPF({ message: 'CPF inválido.' })
  @IsString({ message: 'O CPF deve ser um texto válido.' })
  @MaxLength(11, { message: 'O CPF deve ter no máximo 11 caracteres.' })
  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  cpf: string;

  @IsEmail({}, { message: 'Email inválido.' })
  @IsString({ message: 'O email deve ser um texto válido.' })
  @MaxLength(255, { message: 'O email deve ter no máximo 255 caracteres.' })
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  email: string;

  @IsString({ message: 'O telefone deve ser um texto válido.' })
  @MaxLength(255, { message: 'O telefone deve ter no máximo 255 caracteres.' })
  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  phone: string;

  @IsDateString({}, { message: 'A data de nascimento deve ser uma data válida.' })
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória.' })
  dt_nasc: Date | string;

  @IsString({ message: 'O sexo deve ser um texto válido.' })
  @MaxLength(2, { message: 'O sexo deve ter no máximo 2 caracteres.' })
  @IsNotEmpty({ message: 'O sexo é obrigatório.' })
  sexo: string;

  @IsBoolean({ message: 'A situação deve ser um valor verdadeiro ou falso.' })
  @IsNotEmpty({ message: 'A situação é obrigatória.' })
  situacao: boolean;

  constructor(data: MemberInputDto) {
    Object.assign(this, data);
  }
}

export class MemberValidator extends ClassValidatorFields<MemberRules> {
  validate(data: MemberInputDto): boolean {
    return super.validate(new MemberRules(data));
  }
}

export class MemberValidatorFactory {
  static create(): MemberValidator {
    return new MemberValidator();
  }
}
