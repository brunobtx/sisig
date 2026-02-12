import { AppError } from '../../../../../shared/errors/AppError';

export class ClassAgeRange {
  static readonly MIN_IDADE = 1;
  static readonly MAX_IDADE = 100;

  static validate(idadeIn: number, idadeFn: number): void {
    if (idadeFn < idadeIn) {
      throw new AppError('Idade Inicial Não pode ser maior que Idade Final!', 400);
    }

    if (idadeIn < this.MIN_IDADE || idadeFn < this.MIN_IDADE) {
      throw new AppError(`Idade não pode ser menor que ${this.MIN_IDADE}!`, 400);
    }

    if (idadeIn > this.MAX_IDADE || idadeFn > this.MAX_IDADE) {
      throw new AppError(`Idade não pode ser maior que ${this.MAX_IDADE}!`, 400);
    }
  }
}
