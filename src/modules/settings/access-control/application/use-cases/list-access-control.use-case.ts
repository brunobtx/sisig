import { AccessControlEntity } from '../../domain/entities/access-control.entity';
import { AccessControlRepository } from '../../domain/repositories/access-control.repository';

export class ListAccessControlUseCase {
  constructor(private readonly repository: AccessControlRepository) {}

  async execute(): Promise<AccessControlEntity[]> {
    return this.repository.list();
  }
}
