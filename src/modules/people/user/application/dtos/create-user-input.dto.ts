export type CreateUserInputDto = {
  id_person: number;
  password: string;
  role?: string;
  groupUuids?: string[];
};
