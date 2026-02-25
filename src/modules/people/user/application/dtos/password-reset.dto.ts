export type RequestPasswordResetInputDto = {
  email: string;
};

export type ConfirmPasswordResetInputDto = {
  token: string;
  password: string;
};
