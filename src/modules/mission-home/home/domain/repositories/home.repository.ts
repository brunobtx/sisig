import { HomeEntity } from '../entities/home.entity';

export interface HomeRepository {
  findByName(name: string): Promise<HomeEntity | null>;
  create(entity: HomeEntity): Promise<HomeEntity>;
}
