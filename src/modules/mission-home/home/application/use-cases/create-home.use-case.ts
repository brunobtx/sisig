import { AppError } from '../../../../../shared/errors/AppError';
import { HomeEntity } from '../../domain/entities/home.entity';
import { HomeRepository } from '../../domain/repositories/home.repository';
import { CreateHomeInputDto } from '../dtos/create-home-input.dto';

export class CreateHomeUseCase {
  constructor(private readonly repository: HomeRepository) {}

  async execute(data: CreateHomeInputDto): Promise<HomeEntity> {
    const alreadyExists = await this.repository.findByName(data.name);
    if (alreadyExists) {
      throw new AppError('Casa já existe', 400);
    }

    const entity = new HomeEntity({
      name: data.name,
    });

    return this.repository.create(entity);
  }
}
