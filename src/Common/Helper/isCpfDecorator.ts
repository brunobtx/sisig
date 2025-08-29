import { registerDecorator, ValidationOptions } from 'class-validator';
import { CpfHelper } from './cpfHelper';

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && CpfHelper.isValid(value);
        },
        defaultMessage() {
          return 'CPF inválido';
        },
      },
    });
  };
}