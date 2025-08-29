import { cpf } from 'cpf-cnpj-validator';

export class CpfHelper {
  // Limpa caracteres não numéricos
  static clean(value: string): string {
    return value.replace(/\D/g, '');
  }

  // Verifica se o CPF é válido usando a lib
  static isValid(value: string): boolean {
    if (!value) return false;
    return cpf.isValid(this.clean(value));
  }
}