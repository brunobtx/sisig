import { PersonEntity } from '../entities/person.entity';

export interface PersonRepository {
  findByUUID(uuid: string, id_organization?: number | null): Promise<PersonEntity | null>;
  findById(id: number, id_organization?: number | null): Promise<PersonEntity | null>;
  findByEmail(email: string, id_organization?: number | null): Promise<PersonEntity | null>;
  findByCpf(cpf: string, id_organization?: number | null): Promise<PersonEntity | null>;
  findAll(id_organization?: number | null): Promise<PersonEntity[]>;
  create(person: PersonEntity): Promise<PersonEntity>;
  update(person: PersonEntity): Promise<PersonEntity>;
  inactivateByUUID(uuid: string): Promise<void>;
  emailExists(email: string): Promise<boolean>;
  emailExistsForAnother(uuid: string, email: string): Promise<boolean>;
  cpfExistsForAnother(uuid: string, cpf: string): Promise<boolean>;
}
