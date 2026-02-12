import { PersonEntity } from '../entities/person.entity';

export interface PersonRepository {
  findByUUID(uuid: string): Promise<PersonEntity | null>;
  findById(id: number): Promise<PersonEntity | null>;
  findByEmail(email: string): Promise<PersonEntity | null>;
  findByCpf(cpf: string): Promise<PersonEntity | null>;
  findAll(): Promise<PersonEntity[]>;
  create(person: PersonEntity): Promise<PersonEntity>;
  update(person: PersonEntity): Promise<PersonEntity>;
  inactivateByUUID(uuid: string): Promise<void>;
  emailExists(email: string): Promise<boolean>;
  emailExistsForAnother(uuid: string, email: string): Promise<boolean>;
  cpfExistsForAnother(uuid: string, cpf: string): Promise<boolean>;
}
