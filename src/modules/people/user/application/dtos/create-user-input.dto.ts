export type CreateUserInputDto = {
  id_person: number;
  password: string;
  role?: string;
  custom_permissions?: string[];
};
