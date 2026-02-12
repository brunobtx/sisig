import { cpf } from 'cpf-cnpj-validator';

export class CpfHelper {
  static clean(value: string): string {
    return value.replace(/\D/g, '');
  }

  static isValid(value: string): boolean {
    if (!value) return false;
    return cpf.isValid(this.clean(value));
  }
}
